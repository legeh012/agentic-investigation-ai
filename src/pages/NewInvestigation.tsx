import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { saveInvestigation } from './Dashboard';

const TARGET_TYPES = ['Person', 'Company', 'Username', 'Email', 'Other'];
const EXAMPLES: Record<string, string> = {
  Person: 'John Doe, Jane Smith',
  Company: 'Acme Corp, Tesla Inc',
  Username: '@elonmusk, ghostuser42',
  Email: 'target@domain.com',
  Other: 'IP address, phone number, crypto wallet',
};

export default function NewInvestigation() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ target: '', target_type: 'Person', context: '', tags: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.target.trim()) { setError('Target is required.'); return; }
    const inv = {
      id: crypto.randomUUID(),
      target: form.target.trim(),
      target_type: form.target_type,
      context: form.context.trim(),
      status: 'Queued',
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      created_date: new Date().toISOString(),
      sections: [],
    };
    saveInvestigation(inv as any);
    navigate(`/investigation/${inv.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-mono">
      <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between" style={{WebkitAppRegion:'drag'} as any}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center text-sm font-bold">AI</div>
          <span className="text-sm font-semibold tracking-widest text-gray-300 uppercase">New Investigation</span>
        </div>
        <Link to="/" style={{WebkitAppRegion:'no-drag'} as any} className="text-xs text-gray-500 hover:text-gray-300">← Dashboard</Link>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-widest mb-3">Target Type</label>
            <div className="flex gap-2 flex-wrap">
              {TARGET_TYPES.map(type => (
                <button key={type} type="button" onClick={() => setForm(f => ({ ...f, target_type: type }))}
                  className={`text-xs px-4 py-2 rounded uppercase tracking-widest transition border ${
                    form.target_type === type ? 'bg-red-600 border-red-600 text-white' : 'border-gray-700 text-gray-500 hover:border-gray-500'}`}>
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">Target</label>
            <input type="text" value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value }))}
              placeholder={`e.g. ${EXAMPLES[form.target_type]}`}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-600 text-sm" />
          </div>

          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">Context / Mission Brief</label>
            <textarea value={form.context} onChange={e => setForm(f => ({ ...f, context: e.target.value }))}
              placeholder="Why are you investigating? What are you looking for? Known aliases, locations, connections?"
              rows={4} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-600 text-sm resize-none" />
          </div>

          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-widest mb-2">Tags (comma separated)</label>
            <input type="text" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
              placeholder="fraud, social-media, corporate"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-600 text-sm" />
          </div>

          {error && <div className="text-red-500 text-xs">{error}</div>}

          <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg uppercase tracking-widest text-sm font-semibold transition">
            🎯 Launch Investigation
          </button>
        </form>
      </div>
    </div>
  );
}
