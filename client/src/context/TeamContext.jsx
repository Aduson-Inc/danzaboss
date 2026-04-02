import { createContext, useState, useCallback } from 'react';
import apiClient from '../api/client';

export const TeamContext = createContext(null);

export function TeamProvider({ children }) {
  const [teams, setTeams] = useState([]);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTeams = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/teams/my');
      setTeams(res.data.teams);
    } catch (err) {
      console.error('Failed to fetch teams:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTeam = useCallback(async (id) => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/teams/${id}`);
      setCurrentTeam(res.data.team);
    } catch (err) {
      console.error('Failed to fetch team:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTeam = useCallback(async (name) => {
    const res = await apiClient.post('/teams', { name });
    setTeams((prev) => [...prev, res.data.team]);
    return res.data.team;
  }, []);

  const joinTeam = useCallback(async (code) => {
    const res = await apiClient.post('/teams/join', { code });
    setTeams((prev) => [...prev, res.data.team]);
    return res.data.team;
  }, []);

  const generateInvite = useCallback(async (teamId) => {
    const res = await apiClient.post(`/teams/${teamId}/invite`);
    return res.data;
  }, []);

  const updateMemberRole = useCallback(async (teamId, userId, role) => {
    await apiClient.put(`/teams/${teamId}/members/${userId}/role`, { role });
    setCurrentTeam((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        members: prev.members.map((m) =>
          m.userId === userId || m._id === userId ? { ...m, role } : m
        ),
      };
    });
  }, []);

  const updateMemberPosition = useCallback(async (teamId, userId, position) => {
    await apiClient.put(`/teams/${teamId}/members/${userId}/position`, { position });
    setCurrentTeam((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        members: prev.members.map((m) =>
          m.userId === userId || m._id === userId ? { ...m, position } : m
        ),
      };
    });
  }, []);

  const removeMember = useCallback(async (teamId, userId) => {
    await apiClient.delete(`/teams/${teamId}/members/${userId}`);
    setCurrentTeam((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        members: prev.members.filter(
          (m) => m.userId !== userId && m._id !== userId
        ),
      };
    });
  }, []);

  return (
    <TeamContext.Provider
      value={{
        teams,
        currentTeam,
        loading,
        fetchTeams,
        fetchTeam,
        createTeam,
        joinTeam,
        generateInvite,
        updateMemberRole,
        updateMemberPosition,
        removeMember,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
}
