import type { MonthProjection } from '../types';
import { formatCurrency } from '../utils/format';

export function RecoveryPlanner({ projection }: { projection: MonthProjection[] }) {
  return (
    <section className="panel overflow-hidden">
      <div className="border-b border-slate-200 p-4 dark:border-slate-800">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">Recovery Planner</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Projection from July 2026 with short-tenure loans reducing first.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-950 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Month</th>
              <th className="px-4 py-3">Salary</th>
              <th className="px-4 py-3">Rent</th>
              <th className="px-4 py-3">Loan EMI</th>
              <th className="px-4 py-3">Card Pay</th>
              <th className="px-4 py-3">Friends Pay</th>
              <th className="px-4 py-3">Remaining Cash</th>
              <th className="px-4 py-3">Completed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {projection.map((month) => (
              <tr key={month.month} className="text-slate-700 dark:text-slate-200">
                <td className="px-4 py-3 font-semibold text-slate-950 dark:text-white">{month.month}</td>
                <td className="px-4 py-3">{formatCurrency(month.salary)}</td>
                <td className="px-4 py-3">{formatCurrency(month.rent)}</td>
                <td className="px-4 py-3">{formatCurrency(month.loanEmi)}</td>
                <td className="px-4 py-3">{formatCurrency(month.cardPayment)}</td>
                <td className="px-4 py-3">{formatCurrency(month.friendsPayment)}</td>
                <td className={`px-4 py-3 font-semibold ${month.remainingCash < 0 ? 'text-red-600' : 'text-green-600'}`}>{formatCurrency(month.remainingCash)}</td>
                <td className="max-w-72 px-4 py-3 text-slate-500 dark:text-slate-400">{month.completedLoans.join(', ') || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
