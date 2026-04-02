import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useTeam from '../hooks/useTeam';
import AppShell from '../components/layout/AppShell';
import TeamRoster from '../components/team/TeamRoster';
import InvitePlayer from '../components/team/InvitePlayer';

export default function TeamPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { currentTeam, fetchTeam, loading } = useTeam();

  useEffect(() => {
    fetchTeam(id);
  }, [id, fetchTeam]);

  if (loading || !currentTeam) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="font-heading text-text-secondary text-sm uppercase tracking-wider">
              Loading team...
            </p>
          </div>
        </div>
      </AppShell>
    );
  }

  const teamData = currentTeam.team || currentTeam;
  const teamName = teamData.name || 'Team';
  const members = currentTeam.roster || currentTeam.members || [];
  const teamId = teamData.id || teamData._id || id;

  const isCommissioner = members.some(
    (m) => {
      const memberId = m.userId?._id || m.userId || m.user?._id || m.user_id;
      const currentUserId = user?._id || user?.id;
      return memberId === currentUserId && m.role === 'commissioner';
    }
  );

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Back button */}
        <Link
          to="/"
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
          Back to Dashboard
        </Link>

        {/* Team Header */}
        <div className="card border-t-4 border-t-primary">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary rounded-lg flex items-center justify-center border-2 border-accent shadow-lg shadow-primary/20 flex-shrink-0">
              <span className="font-heading font-bold text-white text-xl">
                {teamName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary uppercase tracking-wider">
                {teamName}
              </h2>
              <p className="text-text-secondary text-sm font-scoreboard mt-0.5">
                {members.length} {members.length === 1 ? 'PLAYER' : 'PLAYERS'}
              </p>
            </div>
          </div>
        </div>

        {/* Invite Players (commissioner only) */}
        {isCommissioner && <InvitePlayer teamId={teamId} />}

        {/* Roster */}
        <TeamRoster team={{ ...currentTeam, _id: teamId, members }} />
      </div>
    </AppShell>
  );
}
