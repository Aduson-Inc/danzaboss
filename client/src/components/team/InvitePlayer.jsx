import { useState } from 'react';
import useTeam from '../../hooks/useTeam';

export default function InvitePlayer({ teamId }) {
  const { generateInvite } = useTeam();
  const [inviteCode, setInviteCode] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setError('');
    setLoading(true);
    setCopied(false);
    try {
      const data = await generateInvite(teamId);
      setInviteCode(data.code || data.inviteCode);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate invite code.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!inviteCode) return;
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = inviteCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="card border-t-4 border-t-accent">
      <h3 className="font-heading text-xl font-bold text-accent uppercase tracking-wider mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
        Invite Players
      </h3>

      {error && (
        <div className="bg-primary/20 border border-primary text-sm rounded px-4 py-3 mb-4">
          <span className="text-goal-light">{error}</span>
        </div>
      )}

      {inviteCode ? (
        <div className="space-y-3">
          <p className="text-text-secondary text-sm">
            Share this code with players to invite them:
          </p>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-background border-2 border-accent rounded px-4 py-3 text-center">
              <span className="font-scoreboard text-2xl text-accent tracking-widest">
                {inviteCode}
              </span>
            </div>
            <button
              onClick={handleCopy}
              className={`px-4 py-3 rounded font-heading text-sm uppercase tracking-wider transition-all ${
                copied
                  ? 'bg-green-600 text-white'
                  : 'bg-accent text-background hover:bg-yellow-500'
              }`}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="text-text-secondary text-sm hover:text-accent transition-colors font-heading uppercase tracking-wider"
          >
            Generate New Code
          </button>
        </div>
      ) : (
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="btn-accent w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Generating...' : 'Generate Invite Code'}
        </button>
      )}
    </div>
  );
}
