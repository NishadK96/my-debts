interface InsightCardProps {
  title: string;
  body: string;
  tone: 'red' | 'orange' | 'green' | 'blue';
}

const tones = {
  red: 'border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950/30 dark:text-red-100',
  orange: 'border-orange-200 bg-orange-50 text-orange-900 dark:border-orange-900 dark:bg-orange-950/30 dark:text-orange-100',
  green: 'border-green-200 bg-green-50 text-green-900 dark:border-green-900 dark:bg-green-950/30 dark:text-green-100',
  blue: 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-100',
};

export function InsightCard({ title, body, tone }: InsightCardProps) {
  return (
    <article className={`rounded-lg border p-4 ${tones[tone]}`}>
      <h3 className="font-bold">{title}</h3>
      <p className="mt-2 text-sm leading-6 opacity-85">{body}</p>
    </article>
  );
}
