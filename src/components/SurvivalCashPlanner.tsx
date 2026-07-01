import { ShieldCheck } from 'lucide-react';
import type { SurvivalPlan } from '../types';
import { getSurvivalSummary } from '../utils/calculations';
import { formatCurrency } from '../utils/format';
import type { AppState } from '../types';

interface SurvivalCashPlannerProps {
  state: AppState;
  onChange: (plan: SurvivalPlan) => void;
}

export function SurvivalCashPlanner({ state, onChange }: SurvivalCashPlannerProps) {
  const summary = getSurvivalSummary(state);
  const plan = state.survivalPlan;

  return (
    <section className="panel p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">Survival Cash Planner</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Protect basic cash before deciding EMI payments.</p>
        </div>
        <ShieldCheck className="text-green-600" size={22} />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label>
          <span className="label">Current bank balance</span>
          <input className="field mt-1" type="number" min={0} value={plan.currentBankBalance} onChange={(event) => onChange({ ...plan, currentBankBalance: Number(event.target.value) })} />
        </label>
        <label>
          <span className="label">Expected salary date</span>
          <input className="field mt-1" type="date" value={plan.expectedSalaryDate} onChange={(event) => onChange({ ...plan, expectedSalaryDate: event.target.value })} />
        </label>
        <label>
          <span className="label">Food buffer</span>
          <input className="field mt-1" type="number" min={0} value={plan.foodBuffer} onChange={(event) => onChange({ ...plan, foodBuffer: Number(event.target.value) })} />
        </label>
        <label>
          <span className="label">Transport buffer</span>
          <input className="field mt-1" type="number" min={0} value={plan.transportBuffer} onChange={(event) => onChange({ ...plan, transportBuffer: Number(event.target.value) })} />
        </label>
      </div>

      <label className="mt-3 block">
        <span className="label">Emergency buffer</span>
        <input className="field mt-1" type="number" min={0} value={plan.emergencyBuffer} onChange={(event) => onChange({ ...plan, emergencyBuffer: Number(event.target.value) })} />
      </label>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-950">
          <p className="label">Safe to pay</p>
          <p className="mt-1 font-bold text-green-600">{formatCurrency(summary.safeToPay)}</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-950">
          <p className="label">Must pay this week</p>
          <p className="mt-1 font-bold text-orange-600">{formatCurrency(summary.mustPayThisWeek)}</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-950">
          <p className="label">Week gap</p>
          <p className={`mt-1 font-bold ${summary.gap < 0 ? 'text-red-600' : 'text-green-600'}`}>{formatCurrency(summary.gap)}</p>
        </div>
      </div>
    </section>
  );
}
