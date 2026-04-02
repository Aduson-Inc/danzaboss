import useGame from '../../hooks/useGame';
import useAuth from '../../hooks/useAuth';
import DisputePanel from './DisputePanel';

export default function StatFeed({ isCommissioner }) {
  const { user } = useAuth();
  const { stats, currentSession, disputeStat } = useGame();

  const currentUserId = user?.id || user?._id;

  const handleDispute = async (statId) => {
    try {
      await disputeStat(statId);
    } catch (err) {
      console.error('Failed to dispute stat:', err);
    }
  };

  // Only show feed during active sessions
  if (!currentSession || currentSession.status !== 'active') return null;

  const statLabel = (type) => {
    switch (type) {
      case 'goal': return 'GOAL';
      case 'assist': return 'ASSIST';
      case 'penalty': return 'PENALTY';
      default: return type;
    }
  };

  const statColor = (type) => {
    switch (type) {
      case 'goal': return 'text-primary';
      case 'assist': return 'text-accent';
      case 'penalty': return 'text-red-400';
      default: return 'text-text-secondary';
    }
  };

  return (
    <div className="space-y-4">
      {/* Dispute Panel */}
      <DisputePanel isCommissioner={isCommissioner} />

      {/* Stat Feed */}
      <div className="card">
        <h4 className="font-heading text-sm text-text-secondary uppercase tracking-wider mb-3">
          Live Feed
        </h4>
        {stats.length === 0 ? (
          <p className="text-text-secondary text-sm">No stats recorded yet.</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {[...stats].reverse().map((stat) => (
              <div
                key={stat.id}
                className={`flex items-center justify-between bg-background rounded px-3 py-2 ${
                  stat.disputed ? 'border border-red-500/50' : ''
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className={`font-heading text-xs uppercase tracking-wider font-bold ${statColor(stat.stat_type)}`}>
                    {statLabel(stat.stat_type)}
                  </span>
                  <span className="text-text-primary text-sm font-body truncate">
                    {stat.player_name || 'Player'}
                  </span>
                  {stat.disputed && (
                    <span className="text-xs font-heading uppercase tracking-wider text-red-400">
                      Disputed
                    </span>
                  )}
                </div>
                {!stat.disputed && stat.recorded_by !== currentUserId && (
                  <button
                    onClick={() => handleDispute(stat.id)}
                    className="text-xs font-heading uppercase tracking-wider text-text-secondary hover:text-red-400 transition-colors px-2 py-1"
                    title="Dispute this stat"
                  >
                    ?
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
