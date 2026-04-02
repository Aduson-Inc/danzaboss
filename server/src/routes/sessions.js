import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { GameSession } from '../models/GameSession.js';
import { TeamMember } from '../models/TeamMember.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// POST /api/sessions - create a game session
router.post('/', async (req, res, next) => {
  try {
    const { teamId } = req.body;
    if (!teamId) {
      return res.status(400).json({ error: 'teamId is required' });
    }

    const parsedTeamId = parseInt(teamId, 10);
    if (isNaN(parsedTeamId)) {
      return res.status(400).json({ error: 'Invalid team ID' });
    }

    // Verify user is a member of the team
    const membership = await TeamMember.findMembership(parsedTeamId, req.user.userId);
    if (!membership) {
      return res.status(403).json({ error: 'You are not a member of this team' });
    }

    // Check for existing active/waiting session
    const existing = await GameSession.findActiveByTeamId(parsedTeamId);
    if (existing) {
      return res.status(400).json({ error: 'Team already has an active session', session: existing });
    }

    const session = await GameSession.create(parsedTeamId, req.user.userId);
    res.status(201).json({ session });
  } catch (err) {
    next(err);
  }
});

// GET /api/sessions/team/:teamId - get sessions for a team
router.get('/team/:teamId', async (req, res, next) => {
  try {
    const teamId = parseInt(req.params.teamId, 10);
    if (isNaN(teamId)) {
      return res.status(400).json({ error: 'Invalid team ID' });
    }

    const membership = await TeamMember.findMembership(teamId, req.user.userId);
    if (!membership) {
      return res.status(403).json({ error: 'You are not a member of this team' });
    }

    const sessions = await GameSession.findByTeamId(teamId);
    res.json({ sessions });
  } catch (err) {
    next(err);
  }
});

// GET /api/sessions/team/:teamId/active - get active session for a team
router.get('/team/:teamId/active', async (req, res, next) => {
  try {
    const teamId = parseInt(req.params.teamId, 10);
    if (isNaN(teamId)) {
      return res.status(400).json({ error: 'Invalid team ID' });
    }

    const membership = await TeamMember.findMembership(teamId, req.user.userId);
    if (!membership) {
      return res.status(403).json({ error: 'You are not a member of this team' });
    }

    const session = await GameSession.findActiveByTeamId(teamId);
    res.json({ session: session || null });
  } catch (err) {
    next(err);
  }
});

// GET /api/sessions/:id - get session details
router.get('/:id', async (req, res, next) => {
  try {
    const sessionId = parseInt(req.params.id, 10);
    if (isNaN(sessionId)) {
      return res.status(400).json({ error: 'Invalid session ID' });
    }

    const session = await GameSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Verify user is a member of the team
    const membership = await TeamMember.findMembership(session.team_id, req.user.userId);
    if (!membership) {
      return res.status(403).json({ error: 'You are not a member of this team' });
    }

    const players = await GameSession.getPlayers(sessionId);
    res.json({ session, players });
  } catch (err) {
    next(err);
  }
});

// POST /api/sessions/:id/join - join a session
router.post('/:id/join', async (req, res, next) => {
  try {
    const sessionId = parseInt(req.params.id, 10);
    if (isNaN(sessionId)) {
      return res.status(400).json({ error: 'Invalid session ID' });
    }

    const session = await GameSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    if (session.status === 'completed') {
      return res.status(400).json({ error: 'Session has already ended' });
    }

    const membership = await TeamMember.findMembership(session.team_id, req.user.userId);
    if (!membership) {
      return res.status(403).json({ error: 'You are not a member of this team' });
    }

    const player = await GameSession.addPlayer(sessionId, req.user.userId);
    const players = await GameSession.getPlayers(sessionId);

    // Emit socket event for real-time update
    const io = req.app.get('io');
    if (io) {
      io.to(`session:${sessionId}`).emit('player-joined', {
        sessionId,
        userId: req.user.userId,
        players,
      });
    }

    res.json({ player, players });
  } catch (err) {
    next(err);
  }
});

// POST /api/sessions/:id/leave - leave a session
router.post('/:id/leave', async (req, res, next) => {
  try {
    const sessionId = parseInt(req.params.id, 10);
    if (isNaN(sessionId)) {
      return res.status(400).json({ error: 'Invalid session ID' });
    }

    const session = await GameSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    await GameSession.removePlayer(sessionId, req.user.userId);
    const players = await GameSession.getPlayers(sessionId);

    const io = req.app.get('io');
    if (io) {
      io.to(`session:${sessionId}`).emit('player-left', {
        sessionId,
        userId: req.user.userId,
        players,
      });
    }

    res.json({ message: 'Left session', players });
  } catch (err) {
    next(err);
  }
});

// POST /api/sessions/:id/start - start the game (creator or commissioner only)
router.post('/:id/start', async (req, res, next) => {
  try {
    const sessionId = parseInt(req.params.id, 10);
    if (isNaN(sessionId)) {
      return res.status(400).json({ error: 'Invalid session ID' });
    }

    const session = await GameSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Only the session creator or team commissioner can start
    const membership = await TeamMember.findMembership(session.team_id, req.user.userId);
    if (!membership) {
      return res.status(403).json({ error: 'You are not a member of this team' });
    }

    if (session.created_by !== req.user.userId && membership.role !== 'commissioner') {
      return res.status(403).json({ error: 'Only the session creator or commissioner can start the game' });
    }

    const started = await GameSession.start(sessionId);
    if (!started) {
      return res.status(400).json({ error: 'Session cannot be started (may already be active or completed)' });
    }

    const io = req.app.get('io');
    if (io) {
      io.to(`session:${sessionId}`).emit('session-started', { session: started });
    }

    res.json({ session: started });
  } catch (err) {
    next(err);
  }
});

// POST /api/sessions/:id/end - end the game (creator or commissioner only)
router.post('/:id/end', async (req, res, next) => {
  try {
    const sessionId = parseInt(req.params.id, 10);
    if (isNaN(sessionId)) {
      return res.status(400).json({ error: 'Invalid session ID' });
    }

    const session = await GameSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const membership = await TeamMember.findMembership(session.team_id, req.user.userId);
    if (!membership) {
      return res.status(403).json({ error: 'You are not a member of this team' });
    }

    if (session.created_by !== req.user.userId && membership.role !== 'commissioner') {
      return res.status(403).json({ error: 'Only the session creator or commissioner can end the game' });
    }

    const ended = await GameSession.end(sessionId);
    if (!ended) {
      return res.status(400).json({ error: 'Session cannot be ended (may not be active)' });
    }

    const io = req.app.get('io');
    if (io) {
      io.to(`session:${sessionId}`).emit('session-ended', { session: ended });
    }

    res.json({ session: ended });
  } catch (err) {
    next(err);
  }
});

export default router;
