export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

export const formatMonth = (date: Date) =>
  date.toLocaleString('en-IN', { month: 'short', year: 'numeric' });

export const formatDate = (date: Date) =>
  date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export const toDateInputValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const parseDateInput = (value: string) => {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const getCurrentCycleDueDate = (day: number, today = new Date()) => {
  const candidate = new Date(today.getFullYear(), today.getMonth(), day);
  if (candidate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
    return new Date(today.getFullYear(), today.getMonth() + 1, day);
  }
  return candidate;
};

export const getLoanDueDate = (dueDay: number, dueDate?: string, today = new Date()) =>
  dueDate ? parseDateInput(dueDate) : getCurrentCycleDueDate(dueDay, today);
