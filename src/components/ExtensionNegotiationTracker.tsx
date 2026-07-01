import type { AppState, NegotiationRecord } from '../types';
import { formatCurrency } from '../utils/format';

interface ExtensionNegotiationTrackerProps {
  state: AppState;
  onChange: (records: NegotiationRecord[]) => void;
}

export function ExtensionNegotiationTracker({ state, onChange }: ExtensionNegotiationTrackerProps) {
  const getRecord = (loanId: string): NegotiationRecord =>
    state.negotiations.find((record) => record.loanId === loanId) ?? {
      loanId,
      contact: '',
      requested: false,
      approved: false,
      newDueDate: '',
      penaltyAmount: 0,
      promiseToPayDate: '',
      notes: '',
    };

  const updateRecord = (record: NegotiationRecord) => {
    const exists = state.negotiations.some((item) => item.loanId === record.loanId);
    onChange(exists
      ? state.negotiations.map((item) => (item.loanId === record.loanId ? record : item))
      : [...state.negotiations, record]);
  };

  return (
    <section className="panel overflow-hidden">
      <div className="border-b border-slate-200 p-4 dark:border-slate-800">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">Extension / Negotiation Tracker</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Track requests before due dates and keep promise-to-pay notes in one place.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-950 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Loan</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Requested</th>
              <th className="px-4 py-3">Approved</th>
              <th className="px-4 py-3">New due</th>
              <th className="px-4 py-3">Penalty</th>
              <th className="px-4 py-3">Promise date</th>
              <th className="px-4 py-3">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {state.loans.map((loan) => {
              const record = getRecord(loan.id);
              return (
                <tr key={loan.id}>
                  <td className="px-4 py-3 font-semibold text-slate-950 dark:text-white">{loan.name}<span className="block text-xs font-normal text-slate-500">{formatCurrency(loan.emi)} due {loan.dueDay} July</span></td>
                  <td className="px-4 py-3"><input className="field min-w-40" value={record.contact} onChange={(event) => updateRecord({ ...record, contact: event.target.value })} /></td>
                  <td className="px-4 py-3"><input type="checkbox" checked={record.requested} onChange={(event) => updateRecord({ ...record, requested: event.target.checked })} /></td>
                  <td className="px-4 py-3"><input type="checkbox" checked={record.approved} onChange={(event) => updateRecord({ ...record, approved: event.target.checked })} /></td>
                  <td className="px-4 py-3"><input className="field min-w-36" type="date" value={record.newDueDate} onChange={(event) => updateRecord({ ...record, newDueDate: event.target.value })} /></td>
                  <td className="px-4 py-3"><input className="field min-w-28" type="number" min={0} value={record.penaltyAmount} onChange={(event) => updateRecord({ ...record, penaltyAmount: Number(event.target.value) })} /></td>
                  <td className="px-4 py-3"><input className="field min-w-36" type="date" value={record.promiseToPayDate} onChange={(event) => updateRecord({ ...record, promiseToPayDate: event.target.value })} /></td>
                  <td className="px-4 py-3"><input className="field min-w-52" value={record.notes} onChange={(event) => updateRecord({ ...record, notes: event.target.value })} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
