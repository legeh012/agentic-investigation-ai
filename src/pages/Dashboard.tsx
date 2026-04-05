import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const STATUS_COLORS: Record<string, string> = {
  'Queued': 'bg-yellow-900/40 text-yellow-400 border border-yellow-700',
  'In Progress': 'bg-blue-900/40 text-blue-400 border border-blue-700',
  'Complete': 'bg-green-900/40 text-green-400 border border-green-700',
  'Archived': 'bg-gray-800 text-gray-500 border border-gray-700',
};

const TYPE_ICONS: Record<string, string> = {
  'Person': '👤', 'Company': '🏢', 'Username': '🔗', 'Email': '📧', 'Other': '🎯',
};

interface Investigation {
  id: string;
  target: string;
  target_type: string;
  status: string;
  confidence_score?: number;
  summary?: string;
  tags?: string[];
  created_date: string;
}

const STORAGE_KEY = 'agentic_investigations';

export function getInvestigations(): Investigation[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}

export function saveInvestigation(inv: Investigation) {
  const all = getInvestigations();
  const idx = all.findIndex(i => i.id === inv.id);
  if (idx >= 0) all[idx] = inv; else all.unshift(inv);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export default function Dashboard() {
  const [investigations, setInvestigations] = useState<Investigation[]>([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => { setInvestigations(getInvestigations()); }, []);

  const filtered = filter === 'All' ? investigations : investigations.filter(i => i.status === filter);
  const stats = {
    total: investigations.length,
    active: investigations.filter(i => i.status === 'In Progress').length,
    complete: investigations.filter(i => i.status === 'Complete').length,
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-mono">
      <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between" style={{WebkitAppRegion:'drag'} as any}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center text-sm font-bold">AI</div>
          <span className="text-sm font-semibold tracking-widest text-gray-300 uppercase">Agentic Investigation System</span>
        </div>
        <Link to="/new" style={{WebkitAppRegion:'no-drag'} as any}
          className="bg-red-600 hover:bg-red-700 text-white text-xs px-4 py-2 rounded tracking-widest uppercase transition">
          + New Target
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.total, color: 'text-gray-300' },
            { label: 'Active', value: stats.active, color: 'text-blue-400' },
            { label: 'Complete', value: stats.complete, color: 'text-green-400' },
          ].map(s => (
            <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-1 uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-6">
          {['All', 'Queued', 'In Progress', 'Complete', 'Archived'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1 rounded uppercase tracking-widest transition border ${
                filter === f ? 'bg-red-600 border-red-600 text-white' : 'border-gray-700 text-gray-500 hover:border-gray-500'}`}>
              {f}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">🎯</div>
            <div className="text-gray-500 text-sm">No investigations yet.</div>
            <Link to="/new" className="text-red-500 text-sm hover:text-red-400 mt-2 inline-block">Start your first target →</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(inv => (
              <Link key={inv.id} to={`/investigation/${inv.id}`}
                className="block bg-gray-900 border border-gray-800 hover:border-red-800 rounded-lg p-4 transition group">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{TYPE_ICONS[inv.target_type] || '🎯'}</span>
                    <div>
                      <div className="font-semibold text-white group-hover:text-red-400 transition">{inv.target}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{inv.target_type} · {new Date(inv.created_date).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {inv.confidence_score && (
                      <span className="text-xs text-gray-500">Confidence: <span className="text-yellow-400">{inv.confidence_score}%</span></span>
                    )}
                    <span className={`text-xs px-2 py-1 rounded ${STATUS_COLORS[inv.status] || ''}`}>{inv.status}</span>
                  </div>
                </div>
                {inv.summary && <div className="mt-2 text-xs text-gray-500 line-clamp-2">{inv.summary}</div>}
                {inv.tags && inv.tags.length > 0 && (
                  <div className="mt-2 flex gap-1 flex-wrap">
                    {inv.tags.map(tag => <span key={tag} className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">{tag}</span>)}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
