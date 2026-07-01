import type { LoanStatus, Priority } from '../types';

type BadgeTone = LoanStatus | Priority | 'Overdue' | 'Upcoming' | 'Info';

interface StatusBadgeProps {
  label: BadgeTone;
}

const classes: Record<BadgeTone, string> = {
  Critical: 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300',
  High: 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300',
  Medium: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
  Low: 'bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-300',
  Pending: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
  Paid: 'bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-300',
  Skipped: 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300',
  Extended: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
  Overdue: 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300',
  Upcoming: 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300',
  Info: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
};

export function StatusBadge({ label }: StatusBadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${classes[label]}`}>
      {label}
    </span>
  );
}
