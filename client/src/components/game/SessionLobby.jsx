import useGame from '../../hooks/useGame';
import useAuth from '../../hooks/useAuth';

export default function SessionLobby({ teamId, isCommissioner }) {
  const { user } = useAuth();
  const {
    currentSession,
    players,
    loading,
    createSession,
    joinSession,
    startSession,
    endSession,
  } = useGame();

  const handleCreate = async () => {
    try {
      await createSession(teamId);
    } catch (err) {
      console.error('Failed to create session:', err);
    }
  };

  const handleJoin = async () => {
    if (!currentSession) return;
    try {
      await joinSession(currentSession.id);
    } catch (err) {
      console.error('Failed to join session:', err);
    }
  };

  const handleStart = async () => {
    if (!currentSession) return;
    try {
      await startSession(currentSession.id);
    } catch (err) {
      console.error('Failed to start session:', err);
    }
  };

  const handleEnd = async () => {
    if (!currentSession) return;
    try {
      await endSession(currentSession.id);
    } catch (err) {
      console.error('Failed to end session:', err);
    }
  };

  const currentUserId = user?.id || user?._id;
  const isInSession = players.some(
    (p) => (p.user_id || p.userId) === currentUserId
  );
  const isCreator = currentSession?.created_by === currentUserId;
  const canControl = isCreator || isCommissioner;

  // No active session — show create button
  if (!currentSession) {
    return (
      <div className="card border-t-4 border-t-accent">
        <h3 className="font-heading text-lg text-text-primary uppercase tracking-wider mb-4">
          Game Session
        </h3>
        <p className="text-text-secondary text-sm mb-4">
          No active game session. Start one to begin tracking stats.
        </p>
        <button
          onClick={handleCreate}
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? 'Creating...' : 'Create Game Session'}
        </button>
      </div>
    );
  }

  // Waiting state — lobby
  if (currentSession.status === 'waiting') {
    return (
      <div className="card border-t-4 border-t-accent">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-lg text-text-primary uppercase tracking-wider">
            Game Lobby
          </h3>
          <span className="text-xs font-heading uppercase tracking-wider px-3 py-1 rounded bg-accent/20 text-accent border border-accent">
            Waiting
          </span>
        </div>

        {/* Player list */}
        <div className="space-y-2 mb-4">
          <p className="text-text-secondary text-xs font-heading uppercase tracking-wider">
            Players ({players.length}/6)
          </p>
          {players.length === 0 ? (
            <p className="text-text-secondary text-sm">Waiting for players...</p>
          ) : (
            players.map((p) => (
              <div
                key={p.user_id || p.userId || p.id}
                className="flex items-center gap-3 bg-background rounded px-3 py-2"
              >
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center border border-accent/50">
                  <span className="font-heading text-white text-xs font-bold">
                    {(p.display_name || 'P').charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <span className="text-text-primary text-sm font-body">
                    {p.display_name || 'Player'}
                  </span>
                  {p.position && (
                    <span className="ml-2 text-xs font-scoreboard text-accent">
                      {p.position}
                    </span>
                  )}
                </div>
                {p.role && (
                  <span className="text-xs font-heading uppercase tracking-wider text-text-secondary">
                    {p.role}
                  </span>
                )}
              </div>
            ))
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          {!isInSession && (
            <button
              onClick={handleJoin}
              disabled={loading}
              className="btn-secondary flex-1"
            >
              Join Session
            </button>
          )}
          {canControl && players.length >= 1 && (
            <button
              onClick={handleStart}
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? 'Starting...' : 'Start Game'}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Completed state
  if (currentSession.status === 'completed') {
    return (
      <div className="card border-t-4 border-t-surface-light">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-lg text-text-primary uppercase tracking-wider">
            Game Complete
          </h3>
          <span className="text-xs font-heading uppercase tracking-wider px-3 py-1 rounded bg-surface-light/50 text-text-secondary border border-surface-light">
            Completed
          </span>
        </div>
        <p className="text-text-secondary text-sm mb-4">
          This game session has ended.
        </p>
        <button
          onClick={handleCreate}
          disabled={loading}
          className="btn-primary w-full"
        >
          Start New Game
        </button>
      </div>
    );
  }

  // Active state is handled by the parent (shows stat tracker instead)
  return null;
}
