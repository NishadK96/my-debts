import { BadgeAlert } from 'lucide-react';
import type { AppState, EmergencyPlanInput } from '../types';
import { getEmergencyPlan } from '../utils/calculations';
import { formatCurrency } from '../utils/format';

interface EmergencyDecisionAssistantProps {
  state: AppState;
  onChange: (input: EmergencyPlanInput) => void;
}

export function EmergencyDecisionAssistant({ state, onChange }: EmergencyDecisionAssistantProps) {
  const input = state.emergencyPlan;
  const plan = getEmergencyPlan(state);

  return (
    <section className="panel p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">Emergency Decision Assistant</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Enter available cash and get a pay-first list.</p>
        </div>
        <BadgeAlert className="text-orange-600" size={22} />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <label>
          <span className="label">Cash available</span>
          <input className="field mt-1" type="number" min={0} value={input.cashAvailable} onChange={(event) => onChange({ ...input, cashAvailable: Number(event.target.value) })} />
        </label>
        <label>
          <span className="label">Days until salary</span>
          <input className="field mt-1" type="number" min={0} value={input.daysUntilSalary} onChange={(event) => onChange({ ...input, daysUntilSalary: Number(event.target.value) })} />
        </label>
        <label>
          <span className="label">Keep cash buffer</span>
          <input className="field mt-1" type="number" min={0} value={input.cashBuffer} onChange={(event) => onChange({ ...input, cashBuffer: Number(event.target.value) })} />
        </label>
      </div>

      <div className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-900 dark:bg-blue-950/30 dark:text-blue-100">
        Spendable after buffer: <strong>{formatCurrency(plan.spendable)}</strong>. Remaining cash after recommended payments: <strong>{formatCurrency(plan.remainingCash)}</strong>.
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div>
          <h3 className="font-semibold text-green-700 dark:text-green-300">Pay first</h3>
          <div className="mt-2 space-y-2">
            {plan.selected.length ? plan.selected.map((payment) => (
              <div key={payment.id} className="rounded-md bg-green-50 p-2 text-sm dark:bg-green-950/30">
                <span className="font-semibold">{payment.name}</span> • {formatCurrency(payment.amount)}
              </div>
            )) : <p className="text-sm text-slate-500">No payment fits after your buffer.</p>}
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-orange-700 dark:text-orange-300">Ask extension / delay</h3>
          <div className="mt-2 space-y-2">
            {plan.deferred.slice(0, 6).map((payment) => (
              <div key={payment.id} className="rounded-md bg-orange-50 p-2 text-sm dark:bg-orange-950/30">
                <span className="font-semibold">{payment.name}</span> • {formatCurrency(payment.amount)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
