import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { GameStat } from '../models/GameStat.js';
import { GameSession } from '../models/GameSession.js';
import { StatDispute } from '../models/StatDispute.js';
import { TeamMember } from '../models/TeamMember.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

const VALID_STAT_TYPES = ['goal', 'assist', 'penalty'];

// POST /api/stats - record a stat
router.post('/', async (req, res, next) => {
  try {
    const { sessionId, userId, statType } = req.body;

    if (!sessionId || !userId || !statType) {
      return res.status(400).json({ error: 'sessionId, userId, and statType are required' });
    }

    if (!VALID_STAT_TYPES.includes(statType)) {
      return res.status(400).json({ error: `statType must be one of: ${VALID_STAT_TYPES.join(', ')}` });
    }

    const parsedSessionId = parseInt(sessionId, 10);
    const parsedUserId = parseInt(userId, 10);
    if (isNaN(parsedSessionId) || isNaN(parsedUserId)) {
      return res.status(400).json({ error: 'Invalid IDs' });
    }

    // Verify session exists and is active
    const session = await GameSession.findById(parsedSessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    if (session.status !== 'active') {
      return res.status(400).json({ error: 'Stats can only be recorded during an active game' });
    }

    // Verify recorder is in the session
    const recorderInSession = await GameSession.isPlayerInSession(parsedSessionId, req.user.userId);
    if (!recorderInSession) {
      return res.status(403).json({ error: 'You must be in the session to record stats' });
    }

    // Verify target player is in the session
    const targetInSession = await GameSession.isPlayerInSession(parsedSessionId, parsedUserId);
    if (!targetInSession) {
      return res.status(400).json({ error: 'Target player is not in this session' });
    }

    const stat = await GameStat.create(parsedSessionId, parsedUserId, statType, req.user.userId);

    const io = req.app.get('io');
    if (io) {
      io.to(`session:${parsedSessionId}`).emit('stat-recorded', { stat });
    }

    res.status(201).json({ stat });
  } catch (err) {
    next(err);
  }
});

// GET /api/stats/session/:sessionId - get all stats for a session
router.get('/session/:sessionId', async (req, res, next) => {
  try {
    const sessionId = parseInt(req.params.sessionId, 10);
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

    const stats = await GameStat.findBySessionId(sessionId);
    res.json({ stats });
  } catch (err) {
    next(err);
  }
});

// GET /api/stats/session/:sessionId/summary - get stat summary for a session
router.get('/session/:sessionId/summary', async (req, res, next) => {
  try {
    const sessionId = parseInt(req.params.sessionId, 10);
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

    const summary = await GameStat.getSessionSummary(sessionId);
    res.json({ summary });
  } catch (err) {
    next(err);
  }
});

// POST /api/stats/:id/dispute - dispute a stat
router.post('/:id/dispute', async (req, res, next) => {
  try {
    const statId = parseInt(req.params.id, 10);
    if (isNaN(statId)) {
      return res.status(400).json({ error: 'Invalid stat ID' });
    }

    const { reason } = req.body;

    const stat = await GameStat.findById(statId);
    if (!stat) {
      return res.status(404).json({ error: 'Stat not found' });
    }

    // Verify session is active
    const session = await GameSession.findById(stat.session_id);
    if (!session || session.status !== 'active') {
      return res.status(400).json({ error: 'Stats can only be disputed during an active game' });
    }

    // Verify disputer is in the session
    const inSession = await GameSession.isPlayerInSession(stat.session_id, req.user.userId);
    if (!inSession) {
      return res.status(403).json({ error: 'You must be in the session to dispute stats' });
    }

    // Check for existing open dispute on this stat
    const existingDispute = await StatDispute.findOpenByStatId(statId);
    if (existingDispute) {
      return res.status(400).json({ error: 'This stat already has an open dispute' });
    }

    // Mark stat as disputed and create dispute record
    await GameStat.markDisputed(statId);
    const dispute = await StatDispute.create(statId, stat.session_id, req.user.userId, reason);

    const io = req.app.get('io');
    if (io) {
      io.to(`session:${stat.session_id}`).emit('stat-disputed', { dispute, statId });
    }

    res.status(201).json({ dispute });
  } catch (err) {
    next(err);
  }
});

// GET /api/stats/disputes/session/:sessionId - get all disputes for a session
router.get('/disputes/session/:sessionId', async (req, res, next) => {
  try {
    const sessionId = parseInt(req.params.sessionId, 10);
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

    const disputes = await StatDispute.findBySessionId(sessionId);
    res.json({ disputes });
  } catch (err) {
    next(err);
  }
});

// POST /api/stats/disputes/:id/vote - cast a vote on a dispute
router.post('/disputes/:id/vote', async (req, res, next) => {
  try {
    const disputeId = parseInt(req.params.id, 10);
    if (isNaN(disputeId)) {
      return res.status(400).json({ error: 'Invalid dispute ID' });
    }

    const { vote } = req.body;
    if (!vote || !['uphold', 'overturn'].includes(vote)) {
      return res.status(400).json({ error: 'Vote must be "uphold" or "overturn"' });
    }

    const dispute = await StatDispute.findById(disputeId);
    if (!dispute) {
      return res.status(404).json({ error: 'Dispute not found' });
    }
    if (dispute.status !== 'open') {
      return res.status(400).json({ error: 'This dispute has already been resolved' });
    }

    // Verify voter is in the session
    const inSession = await GameSession.isPlayerInSession(dispute.session_id, req.user.userId);
    if (!inSession) {
      return res.status(403).json({ error: 'You must be in the session to vote' });
    }

    const voteResult = await StatDispute.castVote(disputeId, req.user.userId, vote);
    if (!voteResult) {
      return res.status(400).json({ error: 'You have already voted on this dispute' });
    }

    // Check if all players in session have voted
    const players = await GameSession.getPlayers(dispute.session_id);
    const votes = await StatDispute.getVotes(disputeId);
    const voteCounts = await StatDispute.getVoteCount(disputeId);

    const io = req.app.get('io');

    // Auto-resolve if all players voted (excluding the stat's player if desired, but keeping it simple)
    if (votes.length >= players.length) {
      let resolution;
      if (voteCounts.overturn > voteCounts.uphold) {
        resolution = 'overturned';
      } else if (voteCounts.uphold > voteCounts.overturn) {
        resolution = 'upheld';
      } else {
        // Tie — needs commissioner tiebreaker
        if (io) {
          io.to(`session:${dispute.session_id}`).emit('dispute-tied', {
            disputeId,
            voteCounts,
          });
        }
        return res.json({ vote: voteResult, voteCounts, tied: true, message: 'Vote is tied. Commissioner must break the tie.' });
      }

      const resolved = await StatDispute.resolve(disputeId, resolution, 'vote');
      if (io) {
        io.to(`session:${dispute.session_id}`).emit('dispute-resolved', {
          disputeId,
          resolution,
          resolvedBy: 'vote',
          voteCounts,
        });
      }
      return res.json({ vote: voteResult, voteCounts, resolved: resolution });
    }

    if (io) {
      io.to(`session:${dispute.session_id}`).emit('dispute-vote-cast', {
        disputeId,
        voteCounts,
        totalVotes: votes.length,
        totalPlayers: players.length,
      });
    }

    res.json({ vote: voteResult, voteCounts });
  } catch (err) {
    next(err);
  }
});

// POST /api/stats/disputes/:id/commissioner-resolve - commissioner tiebreaker
router.post('/disputes/:id/commissioner-resolve', async (req, res, next) => {
  try {
    const disputeId = parseInt(req.params.id, 10);
    if (isNaN(disputeId)) {
      return res.status(400).json({ error: 'Invalid dispute ID' });
    }

    const { resolution } = req.body;
    if (!resolution || !['upheld', 'overturned'].includes(resolution)) {
      return res.status(400).json({ error: 'Resolution must be "upheld" or "overturned"' });
    }

    const dispute = await StatDispute.findById(disputeId);
    if (!dispute) {
      return res.status(404).json({ error: 'Dispute not found' });
    }
    if (dispute.status !== 'open') {
      return res.status(400).json({ error: 'This dispute has already been resolved' });
    }

    // Verify user is commissioner of the team
    const session = await GameSession.findById(dispute.session_id);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const membership = await TeamMember.findMembership(session.team_id, req.user.userId);
    if (!membership || membership.role !== 'commissioner') {
      return res.status(403).json({ error: 'Only the commissioner can break a tie' });
    }

    const resolved = await StatDispute.resolve(disputeId, resolution, 'commissioner');

    const io = req.app.get('io');
    if (io) {
      io.to(`session:${dispute.session_id}`).emit('dispute-resolved', {
        disputeId,
        resolution,
        resolvedBy: 'commissioner',
      });
    }

    res.json({ dispute: resolved, resolution });
  } catch (err) {
    next(err);
  }
});

export default router;
