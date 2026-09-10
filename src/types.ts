export type LoanStatus = 'Pending' | 'Paid' | 'Skipped' | 'Extended';

export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';

export interface Loan {
  id: string;
  name: string;
  emi: number;
  dueDay: number;
  dueDate?: string;
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
  dueDate?: string;
  extraPayment: number;
  paid: boolean;
}

export interface OneTimeIncome {
  id: string;
  month: string;
  amount: number;
  notes: string;
}

export interface AppState {
  loans: Loan[];
  creditCard: CreditCardState;
  friendsDebt: number;
  rent: number;
  rentDueDay: number;
  julySalary: number;
  regularSalary: number;
  salaryDateDay: number;
  projectionStartMonth: string;
  oneTimeIncomes: OneTimeIncome[];
  paidLoanIds: string[];
  darkMode: boolean;
  survivalPlan: SurvivalPlan;
  emergencyPlan: EmergencyPlanInput;
  negotiations: NegotiationRecord[];
  collectionLogs: CollectionLog[];
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
  dueDate: string;
  status: LoanStatus;
  paid: boolean;
}

export interface SurvivalPlan {
  currentBankBalance: number;
  expectedSalaryDate: string;
  foodBuffer: number;
  transportBuffer: number;
  emergencyBuffer: number;
}

export interface EmergencyPlanInput {
  cashAvailable: number;
  daysUntilSalary: number;
  cashBuffer: number;
}

export interface NegotiationRecord {
  loanId: string;
  contact: string;
  requested: boolean;
  approved: boolean;
  newDueDate: string;
  penaltyAmount: number;
  promiseToPayDate: string;
  notes: string;
}

export type CollectionLogStatus = 'Open' | 'Reported' | 'Resolved';

export interface CollectionLog {
  id: string;
  dateTime: string;
  lender: string;
  callerNumber: string;
  summary: string;
  evidenceRef: string;
  status: CollectionLogStatus;
}

export interface PriorityPayment {
  id: string;
  name: string;
  amount: number;
  dueDay: number;
  dueDate: string;
  score: number;
  reasons: string[];
  closesLoan: boolean;
}
