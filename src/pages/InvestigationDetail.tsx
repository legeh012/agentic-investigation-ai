import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getInvestigations, saveInvestigation } from './Dashboard';

const STATUS_COLORS: Record<string, string> = {
  'Queued': 'bg-yellow-900/40 text-yellow-400 border border-yellow-700',
  'In Progress': 'bg-blue-900/40 text-blue-400 border border-blue-700',
  'Complete': 'bg-green-900/40 text-green-400 border border-green-700',
  'Archived': 'bg-gray-800 text-gray-500 border border-gray-700',
};

const CONFIDENCE_COLORS: Record<string, string> = {
  'High': 'text-green-400', 'Medium': 'text-yellow-400', 'Low': 'text-orange-400', 'Unverified': 'text-gray-500',
};

const SECTION_ICONS: Record<string, string> = {
  'Background': '📋', 'Web Presence': '🌐', 'Social Profiles': '👥', 'Affiliations': '🔗',
  'News & Media': '📰', 'Legal & Financial': '⚖️', 'Pattern Analysis': '🧩',
  'Follow-up Questions': '❓', 'Conclusion': '🎯',
};

export default function InvestigationDetail() {
  const { id } = useParams<{ id: string }>();
  const [inv, setInv] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('report');
  const [addingNote, setAddingNote] = useState(false);
  const [noteForm, setNoteForm] = useState({ section: 'Background', content: '', confidence: 'Medium', sources: '' });

  useEffect(() => {
    const all = getInvestigations();
    setInv(all.find(i => i.id === id) || null);
  }, [id]);

  const updateStatus = (status: string) => {
    const updated = { ...inv, status };
    setInv(updated);
    saveInvestigation(updated);
  };

  const saveNote = () => {
    const section = {
      id: crypto.randomUUID(),
      section: noteForm.section,
      content: noteForm.content,
      confidence: noteForm.confidence,
      sources: noteForm.sources ? noteForm.sources.split(',').map(s => s.trim()).filter(Boolean) : [],
      created_at: new Date().toISOString(),
    };
    const updated = { ...inv, sections: [...(inv.sections || []), section] };
    setInv(updated);
    saveInvestigation(updated);
    setNoteForm({ section: 'Background', content: '', confidence: 'Medium', sources: '' });
    setAddingNote(false);
  };

  const deleteSection = (sectionId: string) => {
    const updated = { ...inv, sections: (inv.sections || []).filter((s: any) => s.id !== sectionId) };
    setInv(updated);
    saveInvestigation(updated);
  };

  if (!inv) return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-mono flex items-center justify-center">
      <div className="text-gray-600">Investigation not found. <Link to="/" className="text-red-500">← Back</Link></div>
    </div>
  );

  const sections = inv.sections || [];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-mono">
      <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between" style={{WebkitAppRegion:'drag'} as any}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center text-sm font-bold">AI</div>
          <span className="text-sm font-semibold tracking-widest text-gray-300 uppercase">Intel File</span>
        </div>
        <div className="flex gap-4" style={{WebkitAppRegion:'no-drag'} as any}>
          <Link to={`/investigation/${id}/run`} className="text-xs text-red-400 hover:text-red-300">⚡ Run Agent</Link>
          <Link to="/" className="text-xs text-gray-500 hover:text-gray-300">← Dashboard</Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-xs px-2 py-1 rounded ${STATUS_COLORS[inv.status] || ''}`}>{inv.status}</span>
                <span className="text-xs text-gray-500 uppercase tracking-widest">{inv.target_type}</span>
              </div>
              <h1 className="text-3xl font-bold text-white">{inv.target}</h1>
              {inv.context && <p className="text-gray-400 text-sm mt-2 max-w-2xl">{inv.context}</p>}
              {inv.tags?.length > 0 && (
                <div className="flex gap-1 flex-wrap mt-3">
                  {inv.tags.map((tag: string) => <span key={tag} className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">{tag}</span>)}
                </div>
              )}
            </div>
            {inv.confidence_score && (
              <div className="text-right">
                <div className="text-3xl font-bold text-yellow-400">{inv.confidence_score}%</div>
                <div className="text-xs text-gray-500">Confidence</div>
              </div>
            )}
          </div>
          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-800">
            <span className="text-xs text-gray-500 self-center">Status:</span>
            {['Queued', 'In Progress', 'Complete', 'Archived'].map(s => (
              <button key={s} onClick={() => updateStatus(s)} disabled={inv.status === s}
                className={`text-xs px-3 py-1 rounded uppercase tracking-widest transition border ${
                  inv.status === s ? 'opacity-40 cursor-not-allowed border-gray-700 text-gray-500' : 'border-gray-700 text-gray-500 hover:border-gray-500'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-1 mb-6 border-b border-gray-800">
          {[{ id: 'report', label: `Intel Report (${sections.length})` }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`text-xs px-4 py-2 uppercase tracking-widest transition border-b-2 ${
                activeTab === tab.id ? 'border-red-600 text-red-400' : 'border-transparent text-gray-500'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {sections.length === 0 && !addingNote ? (
          <div className="text-center py-16 text-gray-600">
            <div className="text-3xl mb-3">📂</div>
            <div className="text-sm">No intel sections yet.</div>
            <button onClick={() => setAddingNote(true)} className="text-red-500 text-sm mt-2 hover:text-red-400">Add first finding →</button>
          </div>
        ) : (
          <div className="space-y-4">
            {sections.map((s: any) => (
              <div key={s.id} className="bg-gray-900 border border-gray-800 rounded-lg p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span>{SECTION_ICONS[s.section] || '📌'}</span>
                    <span className="text-sm font-semibold text-white uppercase tracking-widest">{s.section}</span>
                    <span className={`text-xs ${CONFIDENCE_COLORS[s.confidence] || 'text-gray-500'}`}>[{s.confidence}]</span>
                  </div>
                  <button onClick={() => deleteSection(s.id)} className="text-gray-700 hover:text-red-500 text-xs transition">✕</button>
                </div>
                <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">{s.content}</p>
                {s.sources?.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-800">
                    <span className="text-xs text-gray-600">Sources: </span>
                    {s.sources.map((src: string, i: number) => (
                      <a key={i} href={src} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:text-blue-400 mr-2">{src}</a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {addingNote ? (
          <div className="mt-4 bg-gray-900 border border-red-800 rounded-lg p-5">
            <div className="text-xs text-red-400 uppercase tracking-widest mb-4">Add Intel Section</div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Section</label>
                <select value={noteForm.section} onChange={e => setNoteForm(f => ({ ...f, section: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm">
                  {Object.keys(SECTION_ICONS).map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Confidence</label>
                <select value={noteForm.confidence} onChange={e => setNoteForm(f => ({ ...f, confidence: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm">
                  {['High', 'Medium', 'Low', 'Unverified'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-xs text-gray-500 mb-1">Content</label>
              <textarea value={noteForm.content} onChange={e => setNoteForm(f => ({ ...f, content: e.target.value }))}
                rows={5} placeholder="Enter your findings..."
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm resize-none" />
            </div>
            <div className="mb-4">
              <label className="block text-xs text-gray-500 mb-1">Sources (comma separated)</label>
              <input type="text" value={noteForm.sources} onChange={e => setNoteForm(f => ({ ...f, sources: e.target.value }))}
                placeholder="https://source1.com, https://source2.com"
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm" />
            </div>
            <div className="flex gap-2">
              <button onClick={saveNote} disabled={!noteForm.content}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs px-4 py-2 rounded uppercase tracking-widest transition">
                Save Section
              </button>
              <button onClick={() => setAddingNote(false)}
                className="border border-gray-700 text-gray-500 hover:text-gray-300 text-xs px-4 py-2 rounded uppercase tracking-widest transition">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setAddingNote(true)}
            className="mt-4 w-full border border-dashed border-gray-700 hover:border-red-700 text-gray-600 hover:text-red-400 text-xs py-3 rounded-lg uppercase tracking-widest transition">
            + Add Intel Section
          </button>
        )}
      </div>
    </div>
  );
}
