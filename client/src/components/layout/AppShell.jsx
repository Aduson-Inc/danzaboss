import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import BottomNav from './BottomNav';

export default function AppShell({ children }) {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Retro Scoreboard Header */}
      <header className="bg-surface border-b-4 border-primary sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center border-2 border-accent shadow-lg shadow-primary/30">
                <span className="font-heading font-bold text-white text-sm">GP</span>
              </div>
            </div>
            <h1 className="font-heading text-2xl font-bold text-accent uppercase tracking-widest">
              Goal Posts
            </h1>
          </Link>

          <button
            onClick={logout}
            className="font-heading text-sm uppercase tracking-wider text-text-secondary hover:text-primary transition-colors"
          >
            Logout
          </button>
        </div>
        {/* Retro accent stripe */}
        <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 pb-24 md:pb-6">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <BottomNav />
    </div>
  );
}
