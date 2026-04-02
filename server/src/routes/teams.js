import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { Team } from '../models/Team.js';
import { TeamMember } from '../models/TeamMember.js';
import { Invite } from '../models/Invite.js';
import { generateInviteCode } from '../utils/generateInviteCode.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

const VALID_ROLES = ['commissioner', 'captain', 'goalie', 'player'];
const VALID_POSITIONS = ['LW', 'C', 'RW', 'LD', 'RD', 'G', null];
const MAX_TEAM_SIZE = 6;

// POST / - create team
router.post('/', async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Team name is required' });
    }

    const team = await Team.create(name.trim(), req.user.userId);
    res.status(201).json({ team });
  } catch (err) {
    next(err);
  }
});

// GET /my - get current user's teams
router.get('/my', async (req, res, next) => {
  try {
    const teams = await Team.findByUserId(req.user.userId);
    res.json({ teams });
  } catch (err) {
    next(err);
  }
});

// GET /:id - get team details + roster
router.get('/:id', async (req, res, next) => {
  try {
    const teamId = parseInt(req.params.id, 10);
    if (isNaN(teamId)) {
      return res.status(400).json({ error: 'Invalid team ID' });
    }

    const membership = await TeamMember.findMembership(teamId, req.user.userId);
    if (!membership) {
      return res.status(403).json({ error: 'You are not a member of this team' });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const roster = await TeamMember.findByTeamId(teamId);
    res.json({ team, roster });
  } catch (err) {
    next(err);
  }
});

// POST /:id/invite - generate invite code (commissioner only)
router.post('/:id/invite', async (req, res, next) => {
  try {
    const teamId = parseInt(req.params.id, 10);
    if (isNaN(teamId)) {
      return res.status(400).json({ error: 'Invalid team ID' });
    }

    const membership = await TeamMember.findMembership(teamId, req.user.userId);
    if (!membership || membership.role !== 'commissioner') {
      return res.status(403).json({ error: 'Only the commissioner can generate invite codes' });
    }

    const code = generateInviteCode();
    const invite = await Invite.create(teamId, code, req.user.userId);
    res.status(201).json({ code: invite.code, expiresAt: invite.expires_at });
  } catch (err) {
    next(err);
  }
});

// POST /join - join team via invite code
router.post('/join', async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Invite code is required' });
    }

    const invite = await Invite.findByCode(code.toUpperCase());
    if (!invite) {
      return res.status(404).json({ error: 'Invalid invite code' });
    }
    if (invite.used_by !== null) {
      return res.status(400).json({ error: 'Invite code has already been used' });
    }
    if (new Date(invite.expires_at) < new Date()) {
      return res.status(400).json({ error: 'Invite code has expired' });
    }

    const existing = await TeamMember.findMembership(invite.team_id, req.user.userId);
    if (existing) {
      return res.status(400).json({ error: 'You are already a member of this team' });
    }

    const memberCount = await TeamMember.countMembers(invite.team_id);
    if (memberCount >= MAX_TEAM_SIZE) {
      return res.status(400).json({ error: 'Team is full (max 6 members)' });
    }

    await TeamMember.addMember(invite.team_id, req.user.userId, 'player');
    await Invite.markUsed(invite.id, req.user.userId);

    const team = await Team.findById(invite.team_id);
    res.json({ team, message: `Joined ${invite.team_name}` });
  } catch (err) {
    next(err);
  }
});

// PUT /:id/members/:userId/role - change member role (commissioner only)
router.put('/:id/members/:userId/role', async (req, res, next) => {
  try {
    const teamId = parseInt(req.params.id, 10);
    const targetUserId = parseInt(req.params.userId, 10);
    if (isNaN(teamId) || isNaN(targetUserId)) {
      return res.status(400).json({ error: 'Invalid IDs' });
    }

    const { role } = req.body;
    if (!role || !VALID_ROLES.includes(role)) {
      return res.status(400).json({ error: `Role must be one of: ${VALID_ROLES.join(', ')}` });
    }

    const membership = await TeamMember.findMembership(teamId, req.user.userId);
    if (!membership || membership.role !== 'commissioner') {
      return res.status(403).json({ error: 'Only the commissioner can change roles' });
    }

    if (targetUserId === req.user.userId) {
      return res.status(400).json({ error: 'Cannot change your own role' });
    }

    const targetMembership = await TeamMember.findMembership(teamId, targetUserId);
    if (!targetMembership) {
      return res.status(404).json({ error: 'Member not found on this team' });
    }

    const updated = await TeamMember.updateRole(teamId, targetUserId, role);
    res.json({ member: updated });
  } catch (err) {
    next(err);
  }
});

// PUT /:id/members/:userId/position - assign position (commissioner only)
router.put('/:id/members/:userId/position', async (req, res, next) => {
  try {
    const teamId = parseInt(req.params.id, 10);
    const targetUserId = parseInt(req.params.userId, 10);
    if (isNaN(teamId) || isNaN(targetUserId)) {
      return res.status(400).json({ error: 'Invalid IDs' });
    }

    const { position } = req.body;
    if (position !== null && !VALID_POSITIONS.includes(position)) {
      return res.status(400).json({ error: `Position must be one of: ${VALID_POSITIONS.filter(Boolean).join(', ')}, or null` });
    }

    const membership = await TeamMember.findMembership(teamId, req.user.userId);
    if (!membership || membership.role !== 'commissioner') {
      return res.status(403).json({ error: 'Only the commissioner can assign positions' });
    }

    const targetMembership = await TeamMember.findMembership(teamId, targetUserId);
    if (!targetMembership) {
      return res.status(404).json({ error: 'Member not found on this team' });
    }

    const updated = await TeamMember.updatePosition(teamId, targetUserId, position);
    res.json({ member: updated });
  } catch (err) {
    next(err);
  }
});

// DELETE /:id/members/:userId - remove member (commissioner only)
router.delete('/:id/members/:userId', async (req, res, next) => {
  try {
    const teamId = parseInt(req.params.id, 10);
    const targetUserId = parseInt(req.params.userId, 10);
    if (isNaN(teamId) || isNaN(targetUserId)) {
      return res.status(400).json({ error: 'Invalid IDs' });
    }

    const membership = await TeamMember.findMembership(teamId, req.user.userId);
    if (!membership || membership.role !== 'commissioner') {
      return res.status(403).json({ error: 'Only the commissioner can remove members' });
    }

    if (targetUserId === req.user.userId) {
      return res.status(400).json({ error: 'Cannot remove yourself from the team' });
    }

    const targetMembership = await TeamMember.findMembership(teamId, targetUserId);
    if (!targetMembership) {
      return res.status(404).json({ error: 'Member not found on this team' });
    }

    await TeamMember.removeMember(teamId, targetUserId);
    res.json({ message: 'Member removed' });
  } catch (err) {
    next(err);
  }
});

export default router;
