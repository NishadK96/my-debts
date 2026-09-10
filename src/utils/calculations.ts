import type { AppState, Loan, MonthProjection, PaymentItem, Priority, PriorityPayment } from '../types';
import { formatMonth, getLoanDueDate, parseDateInput, toDateInputValue } from './format';

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

export const getCurrentSalary = (state: AppState) =>
  state.regularSalary || state.julySalary;

export const getCurrentObligation = (state: AppState) =>
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
    dueDate: toDateInputValue(getLoanDueDate(loan.dueDay, loan.dueDate)),
    status: loan.status,
    paid: state.paidLoanIds.includes(loan.id) || loan.status === 'Paid',
  }));

  const cardPayment: PaymentItem = {
    id: 'hdfc-card',
    type: 'Credit Card' as const,
    name: 'HDFC Credit Card minimum due',
    amount: state.creditCard.minimumDue + state.creditCard.extraPayment,
    dueDay: state.creditCard.dueDay,
    dueDate: toDateInputValue(getLoanDueDate(state.creditCard.dueDay, state.creditCard.dueDate)),
    status: state.creditCard.paid ? 'Paid' : 'Pending',
    paid: state.creditCard.paid,
  };

  const groups = [...loanPayments, cardPayment].reduce<Record<string, PaymentItem[]>>(
    (acc, payment) => {
      acc[payment.dueDate] = [...(acc[payment.dueDate] ?? []), payment];
      return acc;
    },
    {},
  );

  return Object.entries(groups)
    .map(([dueDate, payments]) => ({
      day: parseDateInput(dueDate.slice(0, 10)).getDate(),
      date: parseDateInput(dueDate.slice(0, 10)),
      payments,
      total: payments.reduce((sum, payment) => sum + payment.amount, 0),
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
};

export const getDueState = (dueDate: string | Date, today = new Date()) => {
  const date = typeof dueDate === 'string' ? parseDateInput(dueDate.slice(0, 10)) : dueDate;
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diffDays = Math.ceil((date.getTime() - start.getTime()) / 86_400_000);

  if (diffDays < 0) return 'overdue';
  if (diffDays <= 3) return 'soon';
  return 'later';
};

export const getDaysUntilDueDate = (dueDate: string | Date, today = new Date()) => {
  const date = typeof dueDate === 'string' ? parseDateInput(dueDate.slice(0, 10)) : dueDate;
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.ceil((date.getTime() - start.getTime()) / 86_400_000);
};

export const getPriorityPayments = (state: AppState, today = new Date()): PriorityPayment[] =>
  getActiveLoans(state.loans)
    .filter((loan) => !state.paidLoanIds.includes(loan.id))
    .map((loan) => {
      const dueDate = getLoanDueDate(loan.dueDay, loan.dueDate, today);
      const daysUntilDue = getDaysUntilDueDate(dueDate, today);
      const reasons: string[] = [];
      let score = 0;

      if (daysUntilDue < 0) {
        score += 80;
        reasons.push('Overdue');
      } else if (daysUntilDue <= 3) {
        score += 60;
        reasons.push('Due within 3 days');
      } else if (daysUntilDue <= 7) {
        score += 35;
        reasons.push('Due this week');
      }

      if (loan.emisLeft <= 1) {
        score += 45;
        reasons.push('This payment closes the loan');
      } else if (loan.emisLeft <= 2) {
        score += 30;
        reasons.push('Only 2 EMIs left');
      } else if (loan.emisLeft <= 5) {
        score += 15;
        reasons.push('Short remaining tenure');
      }

      if (loan.priority === 'Critical') {
        score += 30;
        reasons.push('Marked critical');
      } else if (loan.priority === 'High') {
        score += 18;
        reasons.push('Marked high priority');
      }

      if (loan.status === 'Extended') {
        score -= 15;
        reasons.push('Extension already marked');
      }

      return {
        id: loan.id,
        name: loan.name,
        amount: loan.emi,
        dueDay: loan.dueDay,
        dueDate: toDateInputValue(dueDate),
        score,
        reasons: reasons.length ? reasons : ['Lower immediate risk'],
        closesLoan: loan.emisLeft === 1,
      };
    })
    .sort((a, b) => b.score - a.score || a.dueDay - b.dueDay || b.amount - a.amount);

export const getSurvivalSummary = (state: AppState, today = new Date()) => {
  const priorityPayments = getPriorityPayments(state, today);
  const mustPayThisWeek = priorityPayments
    .filter((payment) => getDaysUntilDueDate(payment.dueDate, today) <= 7)
    .reduce((sum, payment) => sum + payment.amount, 0);
  const requiredBuffer =
    state.survivalPlan.foodBuffer +
    state.survivalPlan.transportBuffer +
    state.survivalPlan.emergencyBuffer;
  const safeToPay = Math.max(0, state.survivalPlan.currentBankBalance - requiredBuffer);

  return {
    mustPayThisWeek,
    requiredBuffer,
    safeToPay,
    gap: safeToPay - mustPayThisWeek,
  };
};

export const getEmergencyPlan = (state: AppState) => {
  const spendable = Math.max(0, state.emergencyPlan.cashAvailable - state.emergencyPlan.cashBuffer);
  const priorityPayments = getPriorityPayments(state);
  const selected: PriorityPayment[] = [];
  const deferred: PriorityPayment[] = [];
  let remaining = spendable;

  priorityPayments.forEach((payment) => {
    if (payment.amount <= remaining) {
      selected.push(payment);
      remaining -= payment.amount;
    } else {
      deferred.push(payment);
    }
  });

  return {
    spendable,
    selected,
    deferred,
    remainingCash: state.emergencyPlan.cashAvailable - selected.reduce((sum, payment) => sum + payment.amount, 0),
  };
};

export const getRecoveryProjection = (state: AppState, months = 12): MonthProjection[] => {
  const loanBalances = state.loans.map((loan) => ({ ...loan }));
  let cardBalance = state.creditCard.outstanding;
  let friendsBalance = state.friendsDebt;
  const [startYear, startMonth] = state.projectionStartMonth.split('-').map(Number);

  return Array.from({ length: months }, (_, index) => {
    const date = new Date(startYear, startMonth - 1 + index, 1);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const extraIncome = state.oneTimeIncomes
      .filter((income) => income.month === monthKey)
      .reduce((sum, income) => sum + income.amount, 0);
    const salary = state.regularSalary + extraIncome;
    const activeLoans = loanBalances
      .filter((loan) => loan.emisLeft > 0 && loan.status !== 'Paid')
      .sort((a, b) => a.emisLeft - b.emisLeft || b.emi - a.emi);

    const loanEmi = activeLoans.reduce((sum, loan) => sum + loan.emi, 0);
    const cardBasePayment = index === 0 ? state.creditCard.minimumDue + state.creditCard.extraPayment : 0;
    const cashAfterEssentials = salary - state.rent - loanEmi - cardBasePayment;
    const friendsPayment = cashAfterEssentials > 0 ? Math.min(friendsBalance, cashAfterEssentials) : 0;
    const cashAfterFriends = cashAfterEssentials - friendsPayment;
    const cardExtraAfterStartMonth = index > 0 && cashAfterFriends > 0 ? Math.min(cardBalance, cashAfterFriends) : 0;
    const cardPayment = Math.min(cardBalance, cardBasePayment + cardExtraAfterStartMonth);

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
  const currentGap = getCurrentSalary(state) - getCurrentObligation(state);

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
      body: currentGap < 0
        ? `This month has a shortfall. Prioritize minimum dues and nearest loan dates first.`
        : 'This month fits within salary, but cash buffer is still tight.',
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
