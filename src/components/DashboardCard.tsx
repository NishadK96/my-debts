import type { ReactNode } from 'react';

interface DashboardCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: ReactNode;
  tone?: 'red' | 'orange' | 'green' | 'blue' | 'slate';
}

const toneClasses = {
  red: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300',
  orange: 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300',
  green: 'bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-300',
  blue: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
  slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
};

export function DashboardCard({ title, value, subtitle, icon, tone = 'slate' }: DashboardCardProps) {
  return (
    <section className="panel p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="label">{title}</p>
          <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">{value}</p>
        </div>
        {icon ? <div className={`rounded-lg p-2 ${toneClasses[tone]}`}>{icon}</div> : null}
      </div>
      {subtitle ? <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p> : null}
    </section>
  );
}
