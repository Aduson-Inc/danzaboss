import { NavLink } from 'react-router-dom';

export default function BottomNav() {
  const linkClass = ({ isActive }) =>
    `flex flex-col items-center gap-1 px-4 py-2 text-xs font-heading uppercase tracking-wider transition-colors ${
      isActive
        ? 'text-primary'
        : 'text-text-secondary hover:text-text-primary'
    }`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-surface-light md:hidden z-50">
      <div className="flex justify-around items-center h-16 max-w-4xl mx-auto">
        <NavLink to="/" end className={linkClass}>
          {({ isActive }) => (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z"
                />
              </svg>
              <span>Dashboard</span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t" />
              )}
            </>
          )}
        </NavLink>

        <NavLink to="/teams/create" className={linkClass}>
          {({ isActive }) => (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>My Teams</span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t" />
              )}
            </>
          )}
        </NavLink>
      </div>
    </nav>
  );
}
