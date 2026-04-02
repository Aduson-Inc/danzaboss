import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useTeam from '../../hooks/useTeam';

export default function CreateTeam() {
  const { createTeam } = useTeam();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Team name is required.');
      return;
    }

    setSubmitting(true);
    try {
      const team = await createTeam(name.trim());
      navigate(`/teams/${team._id || team.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create team.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card max-w-md mx-auto border-t-4 border-t-accent">
      <h2 className="font-heading text-2xl font-bold text-accent uppercase tracking-wider mb-6">
        Create New Team
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-primary/20 border border-primary text-sm rounded px-4 py-3">
            <span className="text-goal-light">{error}</span>
          </div>
        )}

        <div>
          <label className="block font-heading text-sm uppercase tracking-wider text-text-secondary mb-2">
            Team Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
            placeholder="e.g. Mighty Ducks"
            required
            maxLength={50}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Creating...' : 'Create Team'}
        </button>
      </form>
    </div>
  );
}
