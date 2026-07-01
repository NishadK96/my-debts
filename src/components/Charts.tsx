import type { Loan, MonthProjection } from '../types';
import { getLoanRemainingPayable, getPaymentGroups } from '../utils/calculations';
import { formatCurrency } from '../utils/format';
import type { AppState } from '../types';

interface BarChartProps {
  title: string;
  rows: { label: string; value: number; secondaryValue?: number }[];
  valueLabel?: (value: number) => string;
}

function BarChart({ title, rows, valueLabel = formatCurrency }: BarChartProps) {
  const max = Math.max(...rows.flatMap((row) => [row.value, row.secondaryValue ?? 0]), 1);

  return (
    <section className="panel p-4">
      <h3 className="font-bold text-slate-950 dark:text-white">{title}</h3>
      <div className="mt-4 space-y-3">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="mb-1 flex items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="truncate">{row.label}</span>
              <span>{valueLabel(row.value)}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div className="h-full rounded-full bg-blue-600" style={{ width: `${(row.value / max) * 100}%` }} />
            </div>
            {row.secondaryValue !== undefined ? (
              <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-full rounded-full bg-orange-500" style={{ width: `${(row.secondaryValue / max) * 100}%` }} />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

export function DashboardCharts({ loans, projection, state }: { loans: Loan[]; projection: MonthProjection[]; state: AppState }) {
  const loanRows = loans
    .map((loan) => ({ label: loan.name, value: getLoanRemainingPayable(loan) }))
    .sort((a, b) => b.value - a.value);

  const paymentRows = getPaymentGroups(state).map((group) => ({
    label: `${group.day} July`,
    value: group.total,
  }));

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <BarChart
        title="Monthly EMI Burden Reduction"
        rows={projection.slice(0, 8).map((month) => ({ label: month.month, value: month.loanEmi }))}
      />
      <BarChart
        title="Salary vs Obligations"
        rows={projection.slice(0, 6).map((month) => ({ label: month.month, value: month.salary, secondaryValue: month.totalObligation }))}
      />
      <BarChart title="Loan Remaining Payable By Lender" rows={loanRows} />
      <BarChart title="Due-Date Wise Payment Load" rows={paymentRows} />
    </div>
  );
}
