import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-primary/20 border border-primary text-primary-dark text-sm rounded px-4 py-3 font-body">
          <span className="text-goal-light">{error}</span>
        </div>
      )}

      <div>
        <label className="block font-heading text-sm uppercase tracking-wider text-text-secondary mb-2">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
          placeholder="player@example.com"
          required
          autoComplete="email"
        />
      </div>

      <div>
        <label className="block font-heading text-sm uppercase tracking-wider text-text-secondary mb-2">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
          placeholder="Enter your password"
          required
          autoComplete="current-password"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? 'Signing In...' : 'Sign In'}
      </button>

      <p className="text-center text-text-secondary text-sm">
        Don't have an account?{' '}
        <Link to="/register" className="text-accent hover:text-yellow-400 font-semibold transition-colors">
          Register
        </Link>
      </p>
    </form>
  );
}
