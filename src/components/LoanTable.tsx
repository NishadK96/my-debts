import { Edit2, Plus, Trash2 } from 'lucide-react';
import type { Loan, LoanStatus } from '../types';
import { formatCurrency, formatDate, getLoanDueDate } from '../utils/format';
import { getLoanRemainingPayable } from '../utils/calculations';
import { StatusBadge } from './StatusBadge';

interface LoanTableProps {
  loans: Loan[];
  onAdd: () => void;
  onEdit: (loan: Loan) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: LoanStatus) => void;
}

const statuses: LoanStatus[] = ['Pending', 'Paid', 'Skipped', 'Extended'];

export function LoanTable({ loans, onAdd, onEdit, onDelete, onStatusChange }: LoanTableProps) {
  return (
    <section className="panel overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-slate-200 p-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">Loan Tracker</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Edit loans and statuses; totals update automatically.</p>
        </div>
        <button onClick={onAdd} className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          <Plus size={16} /> Add loan
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-950 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Loan/App</th>
              <th className="px-4 py-3">EMI</th>
              <th className="px-4 py-3">Due date</th>
              <th className="px-4 py-3">EMIs left</th>
              <th className="px-4 py-3">Remaining</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Notes</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {loans.map((loan) => (
              <tr key={loan.id} className="text-slate-700 dark:text-slate-200">
                <td className="px-4 py-3 font-semibold text-slate-950 dark:text-white">{loan.name}</td>
                <td className="px-4 py-3">{formatCurrency(loan.emi)}</td>
                <td className="px-4 py-3">{formatDate(getLoanDueDate(loan.dueDay, loan.dueDate))}</td>
                <td className="px-4 py-3">{loan.emisLeft}</td>
                <td className="px-4 py-3">{formatCurrency(getLoanRemainingPayable(loan))}</td>
                <td className="px-4 py-3"><StatusBadge label={loan.priority} /></td>
                <td className="px-4 py-3">
                  <select className="field min-w-28 py-1.5" value={loan.status} onChange={(e) => onStatusChange(loan.id, e.target.value as LoanStatus)}>
                    {statuses.map((status) => <option key={status}>{status}</option>)}
                  </select>
                </td>
                <td className="max-w-52 px-4 py-3 text-slate-500 dark:text-slate-400">{loan.notes || '-'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => onEdit(loan)} className="rounded-md p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40" aria-label={`Edit ${loan.name}`}>
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => onDelete(loan.id)} className="rounded-md p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40" aria-label={`Delete ${loan.name}`}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
