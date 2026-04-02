import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function RegisterForm() {
  const { register } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      await register(email, password, displayName);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-primary/20 border border-primary text-sm rounded px-4 py-3 font-body">
          <span className="text-goal-light">{error}</span>
        </div>
      )}

      <div>
        <label className="block font-heading text-sm uppercase tracking-wider text-text-secondary mb-2">
          Display Name
        </label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="input-field"
          placeholder="Gretzky99"
          required
        />
      </div>

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
          placeholder="Min. 8 characters"
          required
          autoComplete="new-password"
        />
      </div>

      <div>
        <label className="block font-heading text-sm uppercase tracking-wider text-text-secondary mb-2">
          Confirm Password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="input-field"
          placeholder="Re-enter password"
          required
          autoComplete="new-password"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? 'Creating Account...' : 'Register'}
      </button>

      <p className="text-center text-text-secondary text-sm">
        Already have an account?{' '}
        <Link to="/login" className="text-accent hover:text-yellow-400 font-semibold transition-colors">
          Sign In
        </Link>
      </p>
    </form>
  );
}
