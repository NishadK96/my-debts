import { ArrowDownUp } from 'lucide-react';
import type { AppState } from '../types';
import { getPriorityPayments } from '../utils/calculations';
import { formatCurrency, formatDate, parseDateInput } from '../utils/format';
import { StatusBadge } from './StatusBadge';

export function PriorityPaymentEngine({ state }: { state: AppState }) {
  const payments = getPriorityPayments(state).slice(0, 8);

  return (
    <section className="panel p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">Priority Payment Engine</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Ranked by due date, short tenure, and priority.</p>
        </div>
        <ArrowDownUp className="text-blue-600" size={22} />
      </div>
      <div className="mt-4 space-y-3">
        {payments.map((payment, index) => (
          <article key={payment.id} className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-slate-950 dark:text-white">{index + 1}. {payment.name}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Due {formatDate(parseDateInput(payment.dueDate.slice(0, 10)))} • {formatCurrency(payment.amount)}</p>
              </div>
              {payment.closesLoan ? <StatusBadge label="Critical" /> : <StatusBadge label="High" />}
            </div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{payment.reasons.join(' • ')}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
