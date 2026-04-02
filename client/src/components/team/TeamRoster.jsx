import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import useTeam from '../../hooks/useTeam';

const ROLES = ['commissioner', 'captain', 'goalie', 'player'];
const POSITIONS = ['LW', 'C', 'RW', 'LD', 'RD', 'G'];

const roleBadgeStyles = {
  commissioner: 'bg-primary/20 text-primary border-primary',
  captain: 'bg-accent/20 text-accent border-accent',
  goalie: 'bg-secondary/20 text-blue-400 border-secondary',
  player: 'bg-surface-light/50 text-text-secondary border-surface-light',
};

const positionBadgeStyles = 'bg-boards/60 text-ice border-boards';

export default function TeamRoster({ team }) {
  const { user } = useAuth();
  const { updateMemberRole, updateMemberPosition, removeMember } = useTeam();
  const [actionLoading, setActionLoading] = useState(null);

  if (!team || !team.members) return null;

  const isCommissioner = team.members.some(
    (m) =>
      (m.userId === user?._id || m.userId?._id === user?._id || m.user?._id === user?._id) &&
      m.role === 'commissioner'
  );

  const getMemberId = (member) =>
    member.userId?._id || member.userId || member.user?._id || member._id;

  const getMemberName = (member) =>
    member.userId?.displayName ||
    member.user?.displayName ||
    member.displayName ||
    'Unknown Player';

  const handleRoleChange = async (member, newRole) => {
    const id = getMemberId(member);
    setActionLoading(id);
    try {
      await updateMemberRole(team._id || team.id, id, newRole);
    } catch (err) {
      console.error('Failed to update role:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handlePositionChange = async (member, newPosition) => {
    const id = getMemberId(member);
    setActionLoading(id);
    try {
      await updateMemberPosition(team._id || team.id, id, newPosition);
    } catch (err) {
      console.error('Failed to update position:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemove = async (member) => {
    const id = getMemberId(member);
    if (!window.confirm(`Remove ${getMemberName(member)} from the team?`)) return;
    setActionLoading(id);
    try {
      await removeMember(team._id || team.id, id);
    } catch (err) {
      console.error('Failed to remove member:', err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="card border-t-4 border-t-secondary">
      <h3 className="font-heading text-xl font-bold text-accent uppercase tracking-wider mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Roster
        <span className="font-scoreboard text-sm text-text-secondary ml-auto">
          {team.members.length} {team.members.length === 1 ? 'player' : 'players'}
        </span>
      </h3>

      <div className="space-y-3">
        {team.members.map((member) => {
          const memberId = getMemberId(member);
          const memberName = getMemberName(member);
          const isSelf =
            memberId === user?._id ||
            member.userId === user?._id ||
            member.userId?._id === user?._id;
          const isMemberCommissioner = member.role === 'commissioner';
          const loading = actionLoading === memberId;

          return (
            <div
              key={memberId}
              className={`flex flex-wrap items-center gap-3 p-3 rounded-lg bg-background/50 border border-surface-light transition-colors ${
                loading ? 'opacity-50' : ''
              }`}
            >
              {/* Player icon */}
              <div className="w-10 h-10 rounded-full bg-surface-light flex items-center justify-center flex-shrink-0 border-2 border-surface-light">
                <span className="font-heading font-bold text-text-secondary text-sm">
                  {memberName.charAt(0).toUpperCase()}
                </span>
              </div>

              {/* Name & badges */}
              <div className="flex-1 min-w-0">
                <p className="font-heading text-text-primary font-semibold truncate">
                  {memberName}
                  {isSelf && (
                    <span className="text-text-secondary text-xs ml-2">(you)</span>
                  )}
                </p>
                <div className="flex gap-2 mt-1 flex-wrap">
                  <span
                    className={`inline-block text-xs font-heading uppercase tracking-wider px-2 py-0.5 rounded border ${
                      roleBadgeStyles[member.role] || roleBadgeStyles.player
                    }`}
                  >
                    {member.role || 'player'}
                  </span>
                  {member.position && (
                    <span
                      className={`inline-block text-xs font-scoreboard px-2 py-0.5 rounded border ${positionBadgeStyles}`}
                    >
                      {member.position}
                    </span>
                  )}
                </div>
              </div>

              {/* Commissioner controls */}
              {isCommissioner && !isMemberCommissioner && !isSelf && (
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                  <select
                    value={member.role || 'player'}
                    onChange={(e) => handleRoleChange(member, e.target.value)}
                    disabled={loading}
                    className="bg-background border border-surface-light text-text-primary text-xs font-heading uppercase rounded px-2 py-1.5 focus:outline-none focus:border-accent"
                  >
                    {ROLES.filter((r) => r !== 'commissioner').map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>

                  <select
                    value={member.position || ''}
                    onChange={(e) => handlePositionChange(member, e.target.value)}
                    disabled={loading}
                    className="bg-background border border-surface-light text-text-primary text-xs font-heading uppercase rounded px-2 py-1.5 focus:outline-none focus:border-accent"
                  >
                    <option value="">Pos</option>
                    {POSITIONS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => handleRemove(member)}
                    disabled={loading}
                    className="text-primary hover:text-goal-light transition-colors p-1.5 rounded hover:bg-primary/10"
                    title="Remove player"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
