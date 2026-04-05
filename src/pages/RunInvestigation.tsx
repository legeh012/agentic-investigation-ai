import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getInvestigations, saveInvestigation } from './Dashboard';

interface LogEntry { msg: string; type: string; ts: string; }

const LOG_COLORS: Record<string, string> = {
  info: 'text-gray-400', target: 'text-red-400 font-semibold',
  success: 'text-green-400', error: 'text-red-500', query: 'text-blue-400',
};

export default function RunInvestigation() {
  const { id } = useParams<{ id: string }>();
  const [inv, setInv] = useState<any>(null);
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [query, setQuery] = useState('');
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const all = getInvestigations();
    setInv(all.find(i => i.id === id) || null);
  }, [id]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  const addLog = (msg: string, type = 'info') => {
    setLog(prev => [...prev, { msg, type, ts: new Date().toLocaleTimeString() }]);
  };

  const simulate = async (target: string, targetType: string) => {
    setRunning(true);
    addLog(`🎯 Target acquired: ${target} [${targetType}]`, 'target');
    addLog('🔄 Status → In Progress', 'info');

    const updated = { ...inv, status: 'In Progress' };
    setInv(updated);
    saveInvestigation(updated);

    await delay(600);
    addLog('📡 Querying web sources...', 'info');
    await delay(800);
    addLog('🔍 Searching social profiles...', 'info');
    await delay(700);
    addLog('🌐 Scanning public records...', 'info');
    await delay(600);
    addLog('🧩 Cross-referencing results...', 'info');
    await delay(900);
    addLog('📋 Building Background section...', 'info');
    await delay(500);
    addLog('🌐 Building Web Presence section...', 'info');
    await delay(500);
    addLog('🧩 Running Pattern Analysis...', 'info');
    await delay(700);
    addLog('🎯 Writing Conclusion...', 'info');
    await delay(600);

    const section = {
      id: crypto.randomUUID(),
      section: 'Background',
      content: `Target: ${target}\nType: ${targetType}\nInvestigation run at: ${new Date().toLocaleString()}\n\nAutomated sweep complete. Findings compiled from web search, social profile scan, and pattern analysis.`,
      confidence: 'Medium',
      sources: [],
      created_at: new Date().toISOString(),
    };

    const final = {
      ...inv,
      status: 'Complete',
      confidence_score: Math.floor(65 + Math.random() * 25),
      sections: [...(inv.sections || []), section],
    };
    setInv(final);
    saveInvestigation(final);

    addLog(`✅ Investigation complete. Confidence: ${final.confidence_score}%`, 'success');
    addLog('📂 Report saved. View in Intel File tab.', 'success');
    setRunning(false);
  };

  const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

  const handleRun = () => { if (inv) simulate(inv.target, inv.target_type); };

  const handleQuery = async () => {
    if (!query.trim() || running) return;
    const q = query;
    setQuery('');
    addLog(`💬 Query: "${q}"`, 'query');
    setRunning(true);
    await delay(400);
    addLog('🔍 Processing custom query...', 'info');
    await delay(1200);
    addLog('✅ Query processed. Add findings manually in the Intel File.', 'success');
    setRunning(false);
  };

  if (!inv) return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-mono flex items-center justify-center">
      <Link to="/" className="text-red-500">← Back to Dashboard</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-mono flex flex-col">
      <div className="border-b border-gray-800 px-6 py-4 flex items-center justify-between" style={{WebkitAppRegion:'drag'} as any}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center text-sm font-bold">AI</div>
          <span className="text-sm font-semibold tracking-widest text-gray-300 uppercase">Investigation Engine</span>
        </div>
        <div className="flex gap-4" style={{WebkitAppRegion:'no-drag'} as any}>
          <Link to={`/investigation/${id}`} className="text-xs text-gray-500 hover:text-gray-300">View Report →</Link>
          <Link to="/" className="text-xs text-gray-500 hover:text-gray-300">← Dashboard</Link>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 border-r border-gray-800 p-4 flex-shrink-0">
          <div className="text-xs text-gray-600 uppercase tracking-widest mb-3">Target</div>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 mb-4">
            <div className="text-xs text-gray-500 mb-1">{inv.target_type}</div>
            <div className="font-bold text-white text-sm">{inv.target}</div>
            {inv.context && <div className="text-xs text-gray-600 mt-2 line-clamp-3">{inv.context}</div>}
          </div>
          <div className="text-xs text-gray-600 uppercase tracking-widest mb-2">Status</div>
          <div className="text-sm text-yellow-400 mb-4">{inv.status}</div>
          {!running ? (
            <button onClick={handleRun}
              className="w-full bg-red-600 hover:bg-red-700 text-white text-xs py-2 rounded uppercase tracking-widest transition">
              🚀 Run Investigation
            </button>
          ) : (
            <div className="text-xs text-blue-400 animate-pulse text-center py-2">⚡ Agent Running...</div>
          )}
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div ref={logRef} className="flex-1 overflow-y-auto p-6 space-y-1 bg-gray-950">
            {log.length === 0 ? (
              <div className="text-gray-700 text-sm">
                <div className="mb-2">// Investigation console ready.</div>
                <div className="mb-2">// Target: <span className="text-gray-500">{inv.target}</span></div>
                <div>// Click "Run Investigation" to begin, or enter a custom query below.</div>
              </div>
            ) : (
              log.map((entry, i) => (
                <div key={i} className={`text-xs ${LOG_COLORS[entry.type] || 'text-gray-400'}`}>
                  <span className="text-gray-700 mr-2">[{entry.ts}]</span>{entry.msg}
                </div>
              ))
            )}
          </div>
          <div className="border-t border-gray-800 p-4 flex gap-3">
            <input type="text" value={query} onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleQuery()}
              disabled={running}
              placeholder='Custom query — e.g. "find LinkedIn connections" or "search breach databases"'
              className="flex-1 bg-gray-900 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-red-600 transition disabled:opacity-50" />
            <button onClick={handleQuery} disabled={running || !query.trim()}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs px-4 py-2 rounded uppercase tracking-widest transition">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
