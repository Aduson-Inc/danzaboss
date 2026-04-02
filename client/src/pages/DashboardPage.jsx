import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useTeam from '../hooks/useTeam';
import AppShell from '../components/layout/AppShell';

export default function DashboardPage() {
  const { user } = useAuth();
  const { teams, fetchTeams, loading } = useTeam();

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div>
          <h2 className="font-heading text-2xl font-bold text-text-primary uppercase tracking-wider">
            Welcome, <span className="text-accent">{user?.displayName || user?.display_name || 'Player'}</span>
          </h2>
          <p className="text-text-secondary text-sm font-scoreboard mt-1 uppercase tracking-wider">
            Ready to Play
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Link
            to="/teams/create"
            className="btn-primary flex-1 text-center text-base"
          >
            Create Team
          </Link>
          <Link
            to="/teams/join"
            className="btn-secondary flex-1 text-center text-base"
          >
            Join Team
          </Link>
        </div>

        {/* Teams List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="font-heading text-text-secondary text-sm uppercase tracking-wider">
                Loading teams...
              </p>
            </div>
          </div>
        ) : teams.length === 0 ? (
          <div className="card text-center py-10 border-t-4 border-t-surface-light">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-16 h-16 mx-auto text-surface-light mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <p className="font-heading text-text-primary text-lg uppercase tracking-wider mb-2">
              No Teams Yet
            </p>
            <p className="text-text-secondary text-sm mb-6">
              Create a new team or join one with an invite code to get started.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/teams/create" className="btn-accent">
                Create Your First Team
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="font-heading text-lg text-text-secondary uppercase tracking-wider mb-3">
              Your Teams
            </h3>
            <div className="space-y-3">
              {teams.map((team) => (
                <Link
                  key={team._id || team.id}
                  to={`/teams/${team._id || team.id}`}
                  className="block card hover:border-accent/50 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-heading text-lg text-text-primary group-hover:text-accent transition-colors">
                        {team.name}
                      </span>
                      {team.role && (
                        <span
                          className={`ml-3 text-xs font-heading uppercase tracking-wider px-2 py-0.5 rounded border ${
                            team.role === 'commissioner'
                              ? 'bg-primary/20 text-primary border-primary'
                              : team.role === 'captain'
                              ? 'bg-accent/20 text-accent border-accent'
                              : 'bg-surface-light/50 text-text-secondary border-surface-light'
                          }`}
                        >
                          {team.role}
                        </span>
                      )}
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-text-secondary group-hover:text-accent transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  {team.memberCount !== undefined && (
                    <p className="text-text-secondary text-xs font-scoreboard mt-1">
                      {team.memberCount} {team.memberCount === 1 ? 'PLAYER' : 'PLAYERS'}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
