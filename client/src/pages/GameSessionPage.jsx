import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useGame from '../hooks/useGame';
import useTeam from '../hooks/useTeam';
import AppShell from '../components/layout/AppShell';
import SessionLobby from '../components/game/SessionLobby';
import StatTracker from '../components/game/StatTracker';
import StatFeed from '../components/game/StatFeed';
import SessionSummary from '../components/game/SessionSummary';

export default function GameSessionPage() {
  const { teamId } = useParams();
  const { user } = useAuth();
  const { currentTeam, fetchTeam } = useTeam();
  const { currentSession, fetchActiveSession, loading } = useGame();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    fetchTeam(teamId);
  }, [teamId, fetchTeam]);

  useEffect(() => {
    if (!initialized && teamId) {
      fetchActiveSession(teamId).finally(() => setInitialized(true));
    }
  }, [teamId, initialized, fetchActiveSession]);

  const members = currentTeam?.roster || [];
  const currentUserId = user?.id || user?._id;
  const isCommissioner = members.some(
    (m) => {
      const memberId = m.user_id || m.userId;
      return memberId === currentUserId && m.role === 'commissioner';
    }
  );

  if (!initialized || loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="font-heading text-text-secondary text-sm uppercase tracking-wider">
              Loading game...
            </p>
          </div>
        </div>
      </AppShell>
    );
  }

  const teamName = currentTeam?.team?.name || 'Team';
  const isActive = currentSession?.status === 'active';
  const isCompleted = currentSession?.status === 'completed';

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Back button */}
        <Link
          to={`/teams/${teamId}`}
          className="inline-flex items-center gap-2 text-text-secondary hover:text-accent transition-colors font-heading text-sm uppercase tracking-wider"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to {teamName}
        </Link>

        {/* Session Lobby (waiting / no session / completed with new game option) */}
        {(!currentSession || currentSession.status === 'waiting' || currentSession.status === 'completed') && (
          <SessionLobby teamId={parseInt(teamId, 10)} isCommissioner={isCommissioner} />
        )}

        {/* Active Game — Stat Tracker + Feed */}
        {isActive && (
          <>
            <StatTracker isCommissioner={isCommissioner} />
            <StatFeed isCommissioner={isCommissioner} />
          </>
        )}

        {/* Completed Game — Summary */}
        {isCompleted && currentSession && (
          <SessionSummary sessionId={currentSession.id} />
        )}
      </div>
    </AppShell>
  );
}
