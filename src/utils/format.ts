export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

export const formatMonth = (date: Date) =>
  date.toLocaleString('en-IN', { month: 'short', year: 'numeric' });

export const getJuly2026Date = (day: number) => new Date(2026, 6, day);
