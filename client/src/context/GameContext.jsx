import { createContext, useState, useCallback, useEffect, useRef } from 'react';
import apiClient from '../api/client';
import socket from '../api/socket';

export const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [currentSession, setCurrentSession] = useState(null);
  const [players, setPlayers] = useState([]);
  const [stats, setStats] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(false);
  const sessionIdRef = useRef(null);

  // Connect socket when component mounts
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    return () => {
      if (sessionIdRef.current) {
        socket.emit('leave-session', sessionIdRef.current);
      }
    };
  }, []);

  // Socket event listeners
  useEffect(() => {
    function onPlayerJoined(data) {
      setPlayers(data.players);
    }

    function onPlayerLeft(data) {
      setPlayers(data.players);
    }

    function onSessionStarted(data) {
      setCurrentSession(data.session);
    }

    function onSessionEnded(data) {
      setCurrentSession(data.session);
    }

    function onStatRecorded(data) {
      setStats((prev) => [...prev, data.stat]);
    }

    function onStatDisputed(data) {
      setDisputes((prev) => [...prev, data.dispute]);
      setStats((prev) =>
        prev.map((s) => (s.id === data.statId ? { ...s, disputed: true } : s))
      );
    }

    function onDisputeResolved(data) {
      setDisputes((prev) =>
        prev.map((d) =>
          d.id === data.disputeId ? { ...d, status: data.resolution, resolved_by: data.resolvedBy } : d
        )
      );
      if (data.resolution === 'overturned') {
        // The stat was deleted server-side, remove from local state
        setStats((prev) => {
          const dispute = disputes.find((d) => d.id === data.disputeId);
          if (dispute) {
            return prev.filter((s) => s.id !== dispute.stat_id);
          }
          return prev;
        });
      } else {
        // Upheld — clear disputed flag
        setStats((prev) => {
          const dispute = disputes.find((d) => d.id === data.disputeId);
          if (dispute) {
            return prev.map((s) => (s.id === dispute.stat_id ? { ...s, disputed: false } : s));
          }
          return prev;
        });
      }
    }

    function onDisputeVoteCast(data) {
      setDisputes((prev) =>
        prev.map((d) =>
          d.id === data.disputeId ? { ...d, _voteCounts: data.voteCounts, _totalVotes: data.totalVotes, _totalPlayers: data.totalPlayers } : d
        )
      );
    }

    function onDisputeTied(data) {
      setDisputes((prev) =>
        prev.map((d) =>
          d.id === data.disputeId ? { ...d, _tied: true, _voteCounts: data.voteCounts } : d
        )
      );
    }

    socket.on('player-joined', onPlayerJoined);
    socket.on('player-left', onPlayerLeft);
    socket.on('session-started', onSessionStarted);
    socket.on('session-ended', onSessionEnded);
    socket.on('stat-recorded', onStatRecorded);
    socket.on('stat-disputed', onStatDisputed);
    socket.on('dispute-resolved', onDisputeResolved);
    socket.on('dispute-vote-cast', onDisputeVoteCast);
    socket.on('dispute-tied', onDisputeTied);

    return () => {
      socket.off('player-joined', onPlayerJoined);
      socket.off('player-left', onPlayerLeft);
      socket.off('session-started', onSessionStarted);
      socket.off('session-ended', onSessionEnded);
      socket.off('stat-recorded', onStatRecorded);
      socket.off('stat-disputed', onStatDisputed);
      socket.off('dispute-resolved', onDisputeResolved);
      socket.off('dispute-vote-cast', onDisputeVoteCast);
      socket.off('dispute-tied', onDisputeTied);
    };
  }, [disputes]);

  const joinSessionRoom = useCallback((sessionId) => {
    if (sessionIdRef.current) {
      socket.emit('leave-session', sessionIdRef.current);
    }
    sessionIdRef.current = sessionId;
    socket.emit('join-session', sessionId);
  }, []);

  const leaveSessionRoom = useCallback(() => {
    if (sessionIdRef.current) {
      socket.emit('leave-session', sessionIdRef.current);
      sessionIdRef.current = null;
    }
  }, []);

  const createSession = useCallback(async (teamId) => {
    setLoading(true);
    try {
      const res = await apiClient.post('/sessions', { teamId });
      setCurrentSession(res.data.session);
      setPlayers([]);
      setStats([]);
      setDisputes([]);
      joinSessionRoom(res.data.session.id);
      return res.data.session;
    } finally {
      setLoading(false);
    }
  }, [joinSessionRoom]);

  const fetchActiveSession = useCallback(async (teamId) => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/sessions/team/${teamId}/active`);
      if (res.data.session) {
        setCurrentSession(res.data.session);
        // Also fetch players and stats
        const [playersRes, statsRes, disputesRes] = await Promise.all([
          apiClient.get(`/sessions/${res.data.session.id}`),
          apiClient.get(`/stats/session/${res.data.session.id}`),
          apiClient.get(`/stats/disputes/session/${res.data.session.id}`),
        ]);
        setPlayers(playersRes.data.players);
        setStats(statsRes.data.stats);
        setDisputes(disputesRes.data.disputes);
        joinSessionRoom(res.data.session.id);
      } else {
        setCurrentSession(null);
        setPlayers([]);
        setStats([]);
        setDisputes([]);
      }
      return res.data.session;
    } finally {
      setLoading(false);
    }
  }, [joinSessionRoom]);

  const fetchSession = useCallback(async (sessionId) => {
    setLoading(true);
    try {
      const [sessionRes, statsRes, disputesRes] = await Promise.all([
        apiClient.get(`/sessions/${sessionId}`),
        apiClient.get(`/stats/session/${sessionId}`),
        apiClient.get(`/stats/disputes/session/${sessionId}`),
      ]);
      setCurrentSession(sessionRes.data.session);
      setPlayers(sessionRes.data.players);
      setStats(statsRes.data.stats);
      setDisputes(disputesRes.data.disputes);
      joinSessionRoom(sessionId);
      return sessionRes.data.session;
    } finally {
      setLoading(false);
    }
  }, [joinSessionRoom]);

  const joinSession = useCallback(async (sessionId) => {
    const res = await apiClient.post(`/sessions/${sessionId}/join`);
    setPlayers(res.data.players);
    joinSessionRoom(sessionId);
    return res.data;
  }, [joinSessionRoom]);

  const leaveSession = useCallback(async (sessionId) => {
    const res = await apiClient.post(`/sessions/${sessionId}/leave`);
    setPlayers(res.data.players);
    return res.data;
  }, []);

  const startSession = useCallback(async (sessionId) => {
    const res = await apiClient.post(`/sessions/${sessionId}/start`);
    setCurrentSession(res.data.session);
    return res.data.session;
  }, []);

  const endSession = useCallback(async (sessionId) => {
    const res = await apiClient.post(`/sessions/${sessionId}/end`);
    setCurrentSession(res.data.session);
    return res.data.session;
  }, []);

  const recordStat = useCallback(async (sessionId, userId, statType) => {
    const res = await apiClient.post('/stats', { sessionId, userId, statType });
    return res.data.stat;
  }, []);

  const disputeStat = useCallback(async (statId, reason) => {
    const res = await apiClient.post(`/stats/${statId}/dispute`, { reason });
    return res.data.dispute;
  }, []);

  const castVote = useCallback(async (disputeId, vote) => {
    const res = await apiClient.post(`/stats/disputes/${disputeId}/vote`, { vote });
    return res.data;
  }, []);

  const commissionerResolve = useCallback(async (disputeId, resolution) => {
    const res = await apiClient.post(`/stats/disputes/${disputeId}/commissioner-resolve`, { resolution });
    return res.data;
  }, []);

  const clearSession = useCallback(() => {
    leaveSessionRoom();
    setCurrentSession(null);
    setPlayers([]);
    setStats([]);
    setDisputes([]);
  }, [leaveSessionRoom]);

  return (
    <GameContext.Provider
      value={{
        currentSession,
        players,
        stats,
        disputes,
        loading,
        createSession,
        fetchActiveSession,
        fetchSession,
        joinSession,
        leaveSession,
        startSession,
        endSession,
        recordStat,
        disputeStat,
        castVote,
        commissionerResolve,
        clearSession,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
