import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useTeam from '../../hooks/useTeam';

export default function JoinTeam() {
  const { joinTeam } = useTeam();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!code.trim()) {
      setError('Please enter an invite code.');
      return;
    }

    setSubmitting(true);
    try {
      const team = await joinTeam(code.trim().toUpperCase());
      navigate(`/teams/${team._id || team.id}`);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Invalid or expired invite code.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card max-w-md mx-auto border-t-4 border-t-accent">
      <h2 className="font-heading text-2xl font-bold text-accent uppercase tracking-wider mb-6">
        Join a Team
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-primary/20 border border-primary text-sm rounded px-4 py-3">
            <span className="text-goal-light">{error}</span>
          </div>
        )}

        <div>
          <label className="block font-heading text-sm uppercase tracking-wider text-text-secondary mb-2">
            Invite Code
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="input-field font-scoreboard text-center text-xl tracking-widest uppercase"
            placeholder="ABCD1234"
            required
            maxLength={12}
          />
          <p className="text-text-secondary text-xs mt-2">
            Enter the 8-character code from your team commissioner.
          </p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Joining...' : 'Join Team'}
        </button>
      </form>
    </div>
  );
}
