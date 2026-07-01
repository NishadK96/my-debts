import { Plus, Trash2 } from 'lucide-react';
import type { CollectionLog, CollectionLogStatus } from '../types';

interface CollectionHarassmentLogProps {
  logs: CollectionLog[];
  onChange: (logs: CollectionLog[]) => void;
}

const statuses: CollectionLogStatus[] = ['Open', 'Reported', 'Resolved'];

export function CollectionHarassmentLog({ logs, onChange }: CollectionHarassmentLogProps) {
  const addLog = () => {
    onChange([
      {
        id: crypto.randomUUID(),
        dateTime: new Date().toISOString().slice(0, 16),
        lender: '',
        callerNumber: '',
        summary: '',
        evidenceRef: '',
        status: 'Open',
      },
      ...logs,
    ]);
  };

  const updateLog = (log: CollectionLog) => {
    onChange(logs.map((item) => (item.id === log.id ? log : item)));
  };

  return (
    <section className="panel p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">Collection / Harassment Log</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Record aggressive calls, threats, and complaint follow-ups.</p>
        </div>
        <button onClick={addLog} className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          <Plus size={16} /> Add log
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {logs.length ? logs.map((log) => (
          <article key={log.id} className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              <label>
                <span className="label">Date/time</span>
                <input className="field mt-1" type="datetime-local" value={log.dateTime} onChange={(event) => updateLog({ ...log, dateTime: event.target.value })} />
              </label>
              <label>
                <span className="label">Lender/app</span>
                <input className="field mt-1" value={log.lender} onChange={(event) => updateLog({ ...log, lender: event.target.value })} />
              </label>
              <label>
                <span className="label">Caller number</span>
                <input className="field mt-1" value={log.callerNumber} onChange={(event) => updateLog({ ...log, callerNumber: event.target.value })} />
              </label>
              <label>
                <span className="label">Evidence ref</span>
                <input className="field mt-1" value={log.evidenceRef} onChange={(event) => updateLog({ ...log, evidenceRef: event.target.value })} />
              </label>
              <label>
                <span className="label">Status</span>
                <select className="field mt-1" value={log.status} onChange={(event) => updateLog({ ...log, status: event.target.value as CollectionLogStatus })}>
                  {statuses.map((status) => <option key={status}>{status}</option>)}
                </select>
              </label>
            </div>
            <label className="mt-3 block">
              <span className="label">What happened</span>
              <textarea className="field mt-1 min-h-20" value={log.summary} onChange={(event) => updateLog({ ...log, summary: event.target.value })} />
            </label>
            <button onClick={() => onChange(logs.filter((item) => item.id !== log.id))} className="mt-3 inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
              <Trash2 size={16} /> Delete
            </button>
          </article>
        )) : (
          <div className="rounded-lg border border-dashed border-slate-300 p-5 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            No logs yet. Add entries if any lender or recovery agent crosses boundaries.
          </div>
        )}
      </div>
    </section>
  );
}
