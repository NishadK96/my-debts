import type { AppState, Loan, MonthProjection, PaymentItem, Priority } from '../types';
import { formatMonth, getJuly2026Date } from './format';

const paidStatuses = new Set(['Paid']);

export const getActiveLoans = (loans: Loan[]) =>
  loans.filter((loan) => !paidStatuses.has(loan.status) && loan.emisLeft > 0);

export const getTotalMonthlyEmi = (loans: Loan[]) =>
  getActiveLoans(loans).reduce((sum, loan) => sum + loan.emi, 0);

export const getTotalRemainingEmis = (loans: Loan[]) =>
  getActiveLoans(loans).reduce((sum, loan) => sum + loan.emisLeft, 0);

export const getLoanRemainingPayable = (loan: Loan) => loan.emi * loan.emisLeft;

export const getTotalRemainingPayable = (loans: Loan[]) =>
  getActiveLoans(loans).reduce((sum, loan) => sum + getLoanRemainingPayable(loan), 0);

export const getJulyObligation = (state: AppState) =>
  getTotalMonthlyEmi(state.loans) + state.rent + state.friendsDebt + state.creditCard.minimumDue;

export const getDebtPressure = (gap: number): Priority => {
  if (gap < -20000) return 'Critical';
  if (gap < 0) return 'High';
  if (gap < 10000) return 'Medium';
  return 'Low';
};

export const getPaymentGroups = (state: AppState) => {
  const loanPayments: PaymentItem[] = getActiveLoans(state.loans).map((loan) => ({
    id: loan.id,
    type: 'Loan' as const,
    name: loan.name,
    amount: loan.emi,
    dueDay: loan.dueDay,
    status: loan.status,
    paid: state.paidLoanIds.includes(loan.id) || loan.status === 'Paid',
  }));

  const cardPayment: PaymentItem = {
    id: 'hdfc-card',
    type: 'Credit Card' as const,
    name: 'HDFC Credit Card minimum due',
    amount: state.creditCard.minimumDue + state.creditCard.extraPayment,
    dueDay: state.creditCard.dueDay,
    status: state.creditCard.paid ? 'Paid' : 'Pending',
    paid: state.creditCard.paid,
  };

  const groups = [...loanPayments, cardPayment].reduce<Record<number, PaymentItem[]>>(
    (acc, payment) => {
      acc[payment.dueDay] = [...(acc[payment.dueDay] ?? []), payment];
      return acc;
    },
    {},
  );

  return Object.entries(groups)
    .map(([day, payments]) => ({
      day: Number(day),
      date: getJuly2026Date(Number(day)),
      payments,
      total: payments.reduce((sum, payment) => sum + payment.amount, 0),
    }))
    .sort((a, b) => a.day - b.day);
};

export const getDueState = (day: number, today = new Date()) => {
  const dueDate = getJuly2026Date(day);
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diffDays = Math.ceil((dueDate.getTime() - start.getTime()) / 86_400_000);

  if (diffDays < 0) return 'overdue';
  if (diffDays <= 3) return 'soon';
  return 'later';
};

export const getRecoveryProjection = (state: AppState, months = 12): MonthProjection[] => {
  const loanBalances = state.loans.map((loan) => ({ ...loan }));
  let cardBalance = state.creditCard.outstanding;
  let friendsBalance = state.friendsDebt;

  return Array.from({ length: months }, (_, index) => {
    const date = new Date(2026, 6 + index, 1);
    const salary = index === 0 ? state.julySalary : state.regularSalary;
    const activeLoans = loanBalances
      .filter((loan) => loan.emisLeft > 0 && loan.status !== 'Paid')
      .sort((a, b) => a.emisLeft - b.emisLeft || b.emi - a.emi);

    const loanEmi = activeLoans.reduce((sum, loan) => sum + loan.emi, 0);
    const cardBasePayment = index === 0 ? state.creditCard.minimumDue + state.creditCard.extraPayment : 0;
    const cashAfterEssentials = salary - state.rent - loanEmi - cardBasePayment;
    const friendsPayment = cashAfterEssentials > 0 ? Math.min(friendsBalance, cashAfterEssentials) : 0;
    const cashAfterFriends = cashAfterEssentials - friendsPayment;
    const cardExtraAfterJuly = index > 0 && cashAfterFriends > 0 ? Math.min(cardBalance, cashAfterFriends) : 0;
    const cardPayment = Math.min(cardBalance, cardBasePayment + cardExtraAfterJuly);

    const completedLoans: string[] = [];
    activeLoans.forEach((loan) => {
      loan.emisLeft -= 1;
      if (loan.emisLeft === 0) completedLoans.push(loan.name);
    });

    cardBalance = Math.max(0, cardBalance - cardPayment);
    friendsBalance = Math.max(0, friendsBalance - friendsPayment);

    const totalObligation = state.rent + loanEmi + cardPayment + friendsPayment;

    return {
      month: formatMonth(date),
      salary,
      rent: state.rent,
      loanEmi,
      cardPayment,
      friendsPayment,
      totalObligation,
      remainingCash: salary - totalObligation,
      activeLoans: activeLoans.length,
      completedLoans,
      cardBalance,
      friendsBalance,
    };
  });
};

export const getInsights = (state: AppState) => {
  const activeLoans = getActiveLoans(state.loans);
  const shortLoans = activeLoans.filter((loan) => loan.emisLeft <= 2);
  const burdenAfterShortLoans = getTotalMonthlyEmi(
    activeLoans.filter((loan) => loan.emisLeft > 2),
  );
  const julyGap = state.julySalary - getJulyObligation(state);

  return [
    {
      title: 'Loans ending soon',
      tone: 'green' as const,
      body: shortLoans.length
        ? `${shortLoans.map((loan) => loan.name).join(', ')} can close within 1-2 EMIs.`
        : 'No loans are within two EMIs of closing.',
    },
    {
      title: 'High priority this month',
      tone: 'red' as const,
      body: julyGap < 0
        ? `July has a shortfall. Prioritize minimum dues and loans due before 10 July.`
        : 'July obligations fit within salary, but cash buffer is still tight.',
    },
    {
      title: 'Monthly burden after short loans finish',
      tone: 'blue' as const,
      body: `Loan EMI burden can reduce to ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(burdenAfterShortLoans)} after short loans are cleared.`,
    },
    {
      title: 'Avoid taking new app loans',
      tone: 'orange' as const,
      body: 'New short-term app loans will delay recovery and increase due-date pressure.',
    },
    {
      title: 'Ask extension early',
      tone: 'blue' as const,
      body: 'If cash is not ready, request extension before the due date instead of skipping silently.',
    },
  ];
};
