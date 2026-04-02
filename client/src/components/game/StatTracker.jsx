import { useState } from 'react';
import useGame from '../../hooks/useGame';
import useAuth from '../../hooks/useAuth';

export default function StatTracker({ isCommissioner }) {
  const { user } = useAuth();
  const {
    currentSession,
    players,
    stats,
    recordStat,
    endSession,
    loading,
  } = useGame();
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [recording, setRecording] = useState(false);

  const currentUserId = user?.id || user?._id;
  const isCreator = currentSession?.created_by === currentUserId;
  const canControl = isCreator || isCommissioner;

  const handleRecord = async (statType) => {
    if (!selectedPlayer || !currentSession) return;
    setRecording(true);
    try {
      await recordStat(currentSession.id, selectedPlayer, statType);
    } catch (err) {
      console.error('Failed to record stat:', err);
    } finally {
      setRecording(false);
    }
  };

  const handleEndGame = async () => {
    if (!currentSession) return;
    try {
      await endSession(currentSession.id);
    } catch (err) {
      console.error('Failed to end session:', err);
    }
  };

  // Build per-player stat counts from current stats
  const playerStats = {};
  stats.forEach((s) => {
    if (s.disputed) return; // Don't count disputed stats
    const uid = s.user_id || s.userId;
    if (!playerStats[uid]) {
      playerStats[uid] = { goals: 0, assists: 0, penalties: 0 };
    }
    if (s.stat_type === 'goal') playerStats[uid].goals++;
    else if (s.stat_type === 'assist') playerStats[uid].assists++;
    else if (s.stat_type === 'penalty') playerStats[uid].penalties++;
  });

  return (
    <div className="space-y-4">
      {/* Active Session Header */}
      <div className="card border-t-4 border-t-primary">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-heading text-lg text-text-primary uppercase tracking-wider">
            Live Game
          </h3>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
            <span className="text-xs font-heading uppercase tracking-wider text-primary">
              Active
            </span>
          </div>
        </div>
        {canControl && (
          <button
            onClick={handleEndGame}
            disabled={loading}
            className="mt-2 w-full bg-surface-light hover:bg-surface text-text-secondary font-heading font-semibold uppercase tracking-wider px-4 py-2 rounded transition-all text-sm"
          >
            End Game
          </button>
        )}
      </div>

      {/* Player Select + Stat Buttons */}
      <div className="card">
        <h4 className="font-heading text-sm text-text-secondary uppercase tracking-wider mb-3">
          Record Stat
        </h4>

        {/* Player grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {players.map((p) => {
            const pid = p.user_id || p.userId || p.id;
            const isSelected = selectedPlayer === pid;
            return (
              <button
                key={pid}
                onClick={() => setSelectedPlayer(pid)}
                className={`flex items-center gap-2 px-3 py-2 rounded border transition-all text-left ${
                  isSelected
                    ? 'bg-primary/20 border-primary text-text-primary'
                    : 'bg-background border-surface-light text-text-secondary hover:border-accent/50'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-heading font-bold ${
                    isSelected ? 'bg-primary text-white' : 'bg-surface-light text-text-secondary'
                  }`}
                >
                  {(p.display_name || 'P').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-body truncate block">
                    {p.display_name || 'Player'}
                  </span>
                  {p.position && (
                    <span className="text-xs font-scoreboard text-accent">
                      {p.position}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Stat type buttons */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handleRecord('goal')}
            disabled={!selectedPlayer || recording}
            className="flex flex-col items-center gap-1 bg-primary/20 hover:bg-primary/30 border border-primary text-primary font-heading uppercase tracking-wider py-4 rounded transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" />
              <path strokeLinecap="round" d="M12 8v8M8 12h8" />
            </svg>
            <span className="text-xs">Goal</span>
          </button>

          <button
            onClick={() => handleRecord('assist')}
            disabled={!selectedPlayer || recording}
            className="flex flex-col items-center gap-1 bg-accent/20 hover:bg-accent/30 border border-accent text-accent font-heading uppercase tracking-wider py-4 rounded transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
            <span className="text-xs">Assist</span>
          </button>

          <button
            onClick={() => handleRecord('penalty')}
            disabled={!selectedPlayer || recording}
            className="flex flex-col items-center gap-1 bg-red-900/20 hover:bg-red-900/30 border border-red-500 text-red-400 font-heading uppercase tracking-wider py-4 rounded transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs">Penalty</span>
          </button>
        </div>
      </div>

      {/* Live Scoreboard */}
      <div className="card">
        <h4 className="font-heading text-sm text-text-secondary uppercase tracking-wider mb-3">
          Scoreboard
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-light">
                <th className="text-left font-heading text-text-secondary uppercase tracking-wider py-2 px-2">
                  Player
                </th>
                <th className="text-center font-scoreboard text-primary py-2 px-2">G</th>
                <th className="text-center font-scoreboard text-accent py-2 px-2">A</th>
                <th className="text-center font-scoreboard text-red-400 py-2 px-2">PIM</th>
              </tr>
            </thead>
            <tbody>
              {players.map((p) => {
                const pid = p.user_id || p.userId || p.id;
                const ps = playerStats[pid] || { goals: 0, assists: 0, penalties: 0 };
                return (
                  <tr key={pid} className="border-b border-surface-light/50">
                    <td className="py-2 px-2">
                      <div className="flex items-center gap-2">
                        <span className="text-text-primary font-body">
                          {p.display_name || 'Player'}
                        </span>
                        {p.position && (
                          <span className="text-xs font-scoreboard text-accent">
                            {p.position}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="text-center font-scoreboard text-text-primary py-2 px-2">
                      {ps.goals}
                    </td>
                    <td className="text-center font-scoreboard text-text-primary py-2 px-2">
                      {ps.assists}
                    </td>
                    <td className="text-center font-scoreboard text-text-primary py-2 px-2">
                      {ps.penalties}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
