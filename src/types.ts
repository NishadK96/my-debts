export type LoanStatus = 'Pending' | 'Paid' | 'Skipped' | 'Extended';

export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';

export interface Loan {
  id: string;
  name: string;
  emi: number;
  dueDay: number;
  emisLeft: number;
  priority: Priority;
  status: LoanStatus;
  notes: string;
}

export interface CreditCardState {
  limit: number;
  outstanding: number;
  minimumDue: number;
  dueDay: number;
  extraPayment: number;
  paid: boolean;
}

export interface AppState {
  loans: Loan[];
  creditCard: CreditCardState;
  friendsDebt: number;
  rent: number;
  julySalary: number;
  regularSalary: number;
  paidLoanIds: string[];
  darkMode: boolean;
}

export interface MonthProjection {
  month: string;
  salary: number;
  rent: number;
  loanEmi: number;
  cardPayment: number;
  friendsPayment: number;
  totalObligation: number;
  remainingCash: number;
  activeLoans: number;
  completedLoans: string[];
  cardBalance: number;
  friendsBalance: number;
}

export interface PaymentItem {
  id: string;
  type: 'Loan' | 'Credit Card';
  name: string;
  amount: number;
  dueDay: number;
  status: LoanStatus;
  paid: boolean;
}
