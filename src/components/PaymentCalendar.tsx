import { CalendarDays, CheckCircle2 } from 'lucide-react';
import type { AppState } from '../types';
import { getDueState, getPaymentGroups } from '../utils/calculations';
import { formatCurrency } from '../utils/format';
import { StatusBadge } from './StatusBadge';

interface PaymentCalendarProps {
  state: AppState;
  onToggleLoanPaid: (id: string) => void;
  onToggleCardPaid: () => void;
}

export function PaymentCalendar({ state, onToggleLoanPaid, onToggleCardPaid }: PaymentCalendarProps) {
  const groups = getPaymentGroups(state);

  return (
    <section className="panel p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">Payment Calendar</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">July 2026 payments grouped by due date.</p>
        </div>
        <CalendarDays className="text-blue-600" size={22} />
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {groups.map((group) => {
          const dueState = getDueState(group.day);
          const paid = group.payments.every((payment) => payment.paid);

          return (
            <article key={group.day} className={`rounded-lg border p-4 ${dueState === 'overdue' ? 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30' : dueState === 'soon' ? 'border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/30' : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950'}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{group.day} July</p>
                  <p className="mt-1 text-xl font-bold text-slate-950 dark:text-white">{formatCurrency(group.total)}</p>
                </div>
                {paid ? <StatusBadge label="Paid" /> : dueState === 'overdue' ? <StatusBadge label="Overdue" /> : dueState === 'soon' ? <StatusBadge label="Upcoming" /> : <StatusBadge label="Info" />}
              </div>
              <div className="mt-4 space-y-2">
                {group.payments.map((payment) => (
                  <label key={payment.id} className="flex cursor-pointer items-center justify-between gap-3 rounded-md bg-white/70 p-2 text-sm dark:bg-slate-900/70">
                    <span>
                      <span className="font-semibold text-slate-800 dark:text-slate-100">{payment.name}</span>
                      <span className="block text-xs text-slate-500">{formatCurrency(payment.amount)}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => payment.type === 'Credit Card' ? onToggleCardPaid() : onToggleLoanPaid(payment.id)}
                      className={`rounded-full p-1 ${payment.paid ? 'text-green-600' : 'text-slate-400 hover:text-green-600'}`}
                      aria-label={`Mark ${payment.name} as paid`}
                    >
                      <CheckCircle2 size={22} />
                    </button>
                  </label>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
