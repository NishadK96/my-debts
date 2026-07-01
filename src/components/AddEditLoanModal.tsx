import { FormEvent, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { Loan, LoanStatus, Priority } from '../types';

interface AddEditLoanModalProps {
  loan: Loan | null;
  open: boolean;
  onClose: () => void;
  onSave: (loan: Loan) => void;
}

const priorities: Priority[] = ['Critical', 'High', 'Medium', 'Low'];
const statuses: LoanStatus[] = ['Pending', 'Paid', 'Skipped', 'Extended'];

const emptyLoan: Loan = {
  id: '',
  name: '',
  emi: 0,
  dueDay: 1,
  emisLeft: 1,
  priority: 'Medium',
  status: 'Pending',
  notes: '',
};

export function AddEditLoanModal({ loan, open, onClose, onSave }: AddEditLoanModalProps) {
  const [draft, setDraft] = useState<Loan>(emptyLoan);

  useEffect(() => {
    if (open) setDraft(loan ?? { ...emptyLoan, id: crypto.randomUUID() });
  }, [loan, open]);

  if (!open) return null;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSave({
      ...draft,
      emi: Number(draft.emi),
      dueDay: Number(draft.dueDay),
      emisLeft: Number(draft.emisLeft),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-slate-950/60 p-3 sm:items-center sm:justify-center">
      <form onSubmit={submit} className="panel w-full max-w-2xl p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">{loan ? 'Edit Loan' : 'Add Loan'}</h2>
          <button type="button" onClick={onClose} className="rounded-md p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label>
            <span className="label">Loan/App name</span>
            <input className="field mt-1" required value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          </label>
          <label>
            <span className="label">Monthly EMI</span>
            <input className="field mt-1" required min={0} type="number" value={draft.emi} onChange={(e) => setDraft({ ...draft, emi: Number(e.target.value) })} />
          </label>
          <label>
            <span className="label">Due day</span>
            <input className="field mt-1" required min={1} max={31} type="number" value={draft.dueDay} onChange={(e) => setDraft({ ...draft, dueDay: Number(e.target.value) })} />
          </label>
          <label>
            <span className="label">EMIs left</span>
            <input className="field mt-1" required min={0} type="number" value={draft.emisLeft} onChange={(e) => setDraft({ ...draft, emisLeft: Number(e.target.value) })} />
          </label>
          <label>
            <span className="label">Priority</span>
            <select className="field mt-1" value={draft.priority} onChange={(e) => setDraft({ ...draft, priority: e.target.value as Priority })}>
              {priorities.map((priority) => <option key={priority}>{priority}</option>)}
            </select>
          </label>
          <label>
            <span className="label">Status</span>
            <select className="field mt-1" value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as LoanStatus })}>
              {statuses.map((status) => <option key={status}>{status}</option>)}
            </select>
          </label>
          <label className="sm:col-span-2">
            <span className="label">Notes</span>
            <textarea className="field mt-1 min-h-24" value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} />
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">
            Cancel
          </button>
          <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            Save loan
          </button>
        </div>
      </form>
    </div>
  );
}
