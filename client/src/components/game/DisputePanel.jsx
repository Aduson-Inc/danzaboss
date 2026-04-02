import useGame from '../../hooks/useGame';
import useAuth from '../../hooks/useAuth';

export default function DisputePanel({ isCommissioner }) {
  const { user } = useAuth();
  const { disputes, castVote, commissionerResolve } = useGame();

  const currentUserId = user?.id || user?._id;

  // Only show open disputes
  const openDisputes = disputes.filter((d) => d.status === 'open');

  if (openDisputes.length === 0) return null;

  const handleVote = async (disputeId, vote) => {
    try {
      await castVote(disputeId, vote);
    } catch (err) {
      console.error('Failed to vote:', err);
    }
  };

  const handleCommissionerResolve = async (disputeId, resolution) => {
    try {
      await commissionerResolve(disputeId, resolution);
    } catch (err) {
      console.error('Failed to resolve dispute:', err);
    }
  };

  return (
    <div className="card border-t-4 border-t-red-500">
      <h4 className="font-heading text-sm text-red-400 uppercase tracking-wider mb-3">
        Active Disputes ({openDisputes.length})
      </h4>
      <div className="space-y-3">
        {openDisputes.map((dispute) => (
          <div key={dispute.id} className="bg-background rounded p-3 border border-red-500/30">
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="text-text-primary text-sm font-body">
                  {dispute.stat_player_name || 'Player'}'s{' '}
                  <span className="font-heading uppercase text-primary">
                    {dispute.stat_type}
                  </span>
                </span>
                <p className="text-text-secondary text-xs mt-0.5">
                  Disputed by {dispute.disputed_by_name || 'someone'}
                  {dispute.reason && ` - "${dispute.reason}"`}
                </p>
              </div>
            </div>

            {/* Vote counts if available */}
            {dispute._voteCounts && (
              <div className="flex gap-4 text-xs font-scoreboard text-text-secondary mb-2">
                <span>Uphold: {dispute._voteCounts.uphold}</span>
                <span>Overturn: {dispute._voteCounts.overturn}</span>
                {dispute._totalVotes !== undefined && (
                  <span>
                    ({dispute._totalVotes}/{dispute._totalPlayers} voted)
                  </span>
                )}
              </div>
            )}

            {/* Commissioner tiebreaker */}
            {dispute._tied && isCommissioner ? (
              <div className="space-y-2">
                <p className="text-xs font-heading uppercase tracking-wider text-accent">
                  Vote tied - Commissioner decides
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCommissionerResolve(dispute.id, 'upheld')}
                    className="flex-1 bg-secondary/30 hover:bg-secondary/50 border border-secondary text-secondary font-heading uppercase tracking-wider text-xs px-3 py-2 rounded transition-all"
                  >
                    Uphold Stat
                  </button>
                  <button
                    onClick={() => handleCommissionerResolve(dispute.id, 'overturned')}
                    className="flex-1 bg-red-900/30 hover:bg-red-900/50 border border-red-500 text-red-400 font-heading uppercase tracking-wider text-xs px-3 py-2 rounded transition-all"
                  >
                    Overturn
                  </button>
                </div>
              </div>
            ) : dispute._tied && !isCommissioner ? (
              <p className="text-xs font-heading uppercase tracking-wider text-accent">
                Vote tied - Waiting for commissioner...
              </p>
            ) : (
              /* Regular voting buttons */
              <div className="flex gap-2">
                <button
                  onClick={() => handleVote(dispute.id, 'uphold')}
                  className="flex-1 bg-secondary/20 hover:bg-secondary/30 border border-secondary text-text-secondary hover:text-secondary font-heading uppercase tracking-wider text-xs px-3 py-2 rounded transition-all"
                >
                  Uphold
                </button>
                <button
                  onClick={() => handleVote(dispute.id, 'overturn')}
                  className="flex-1 bg-red-900/20 hover:bg-red-900/30 border border-red-500/50 text-text-secondary hover:text-red-400 font-heading uppercase tracking-wider text-xs px-3 py-2 rounded transition-all"
                >
                  Overturn
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
