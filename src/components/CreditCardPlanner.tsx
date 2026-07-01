import { CreditCard } from 'lucide-react';
import type { CreditCardState } from '../types';
import { formatCurrency } from '../utils/format';

interface CreditCardPlannerProps {
  card: CreditCardState;
  onChange: (card: CreditCardState) => void;
}

export function CreditCardPlanner({ card, onChange }: CreditCardPlannerProps) {
  const payment = Math.min(card.outstanding, card.minimumDue + card.extraPayment);
  const remaining = Math.max(0, card.outstanding - payment);
  const utilization = Math.min(100, (card.outstanding / card.limit) * 100);

  return (
    <section className="panel p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">HDFC Credit Card Planner</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Due 10 July, limit {formatCurrency(card.limit)}</p>
        </div>
        <CreditCard className="text-blue-600" size={22} />
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div>
          <p className="label">Outstanding</p>
          <p className="mt-1 text-xl font-bold text-slate-950 dark:text-white">{formatCurrency(card.outstanding)}</p>
        </div>
        <div>
          <p className="label">Minimum due</p>
          <p className="mt-1 text-xl font-bold text-orange-600">{formatCurrency(card.minimumDue)}</p>
        </div>
        <div>
          <p className="label">After payment</p>
          <p className="mt-1 text-xl font-bold text-slate-950 dark:text-white">{formatCurrency(remaining)}</p>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Card utilization</span>
          <span>{Math.round(utilization)}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div className="h-full rounded-full bg-red-500" style={{ width: `${utilization}%` }} />
        </div>
      </div>

      <label className="mt-5 block">
        <span className="label">Extra payment this month</span>
        <input className="field mt-1" type="number" min={0} value={card.extraPayment} onChange={(e) => onChange({ ...card, extraPayment: Number(e.target.value) })} />
      </label>

      {card.extraPayment <= 0 ? (
        <div className="mt-4 rounded-lg border border-orange-200 bg-orange-50 p-3 text-sm text-orange-800 dark:border-orange-900 dark:bg-orange-950/30 dark:text-orange-200">
          Warning: paying only the minimum keeps {formatCurrency(remaining)} on the card and may keep interest pressure high.
        </div>
      ) : (
        <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800 dark:border-green-900 dark:bg-green-950/30 dark:text-green-200">
          Extra payment reduces card balance by {formatCurrency(card.extraPayment)} beyond the minimum due.
        </div>
      )}
    </section>
  );
}
