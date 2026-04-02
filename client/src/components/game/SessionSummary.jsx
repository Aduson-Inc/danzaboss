import { useEffect, useState } from 'react';
import apiClient from '../../api/client';

export default function SessionSummary({ sessionId }) {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) return;
    setLoading(true);
    apiClient
      .get(`/stats/session/${sessionId}/summary`)
      .then((res) => setSummary(res.data.summary))
      .catch((err) => console.error('Failed to fetch summary:', err))
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (summary.length === 0) {
    return (
      <div className="card">
        <h4 className="font-heading text-sm text-text-secondary uppercase tracking-wider mb-3">
          Game Summary
        </h4>
        <p className="text-text-secondary text-sm">No stats recorded this game.</p>
      </div>
    );
  }

  return (
    <div className="card border-t-4 border-t-accent">
      <h4 className="font-heading text-lg text-text-primary uppercase tracking-wider mb-4">
        Game Summary
      </h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-accent/30">
              <th className="text-left font-heading text-text-secondary uppercase tracking-wider py-2 px-2">
                Player
              </th>
              <th className="text-center font-scoreboard text-primary py-2 px-2">G</th>
              <th className="text-center font-scoreboard text-accent py-2 px-2">A</th>
              <th className="text-center font-scoreboard text-text-primary py-2 px-2">PTS</th>
              <th className="text-center font-scoreboard text-red-400 py-2 px-2">PIM</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((row, i) => (
              <tr
                key={row.user_id}
                className={`border-b border-surface-light/50 ${
                  i === 0 ? 'bg-accent/5' : ''
                }`}
              >
                <td className="py-2 px-2">
                  <span className="text-text-primary font-body">
                    {row.display_name}
                  </span>
                  {i === 0 && parseInt(row.goals) > 0 && (
                    <span className="ml-2 text-xs font-heading text-accent uppercase">
                      Star
                    </span>
                  )}
                </td>
                <td className="text-center font-scoreboard text-text-primary py-2 px-2">
                  {row.goals}
                </td>
                <td className="text-center font-scoreboard text-text-primary py-2 px-2">
                  {row.assists}
                </td>
                <td className="text-center font-scoreboard text-accent font-bold py-2 px-2">
                  {parseInt(row.goals) + parseInt(row.assists)}
                </td>
                <td className="text-center font-scoreboard text-text-primary py-2 px-2">
                  {row.penalties}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
