import type { AppState, Loan } from '../types';

export const sampleLoans: Loan[] = [
  { id: 'true-balance', name: 'True Balance', emi: 2318, dueDay: 4, dueDate: '2026-10-04', emisLeft: 2, priority: 'High', status: 'Pending', notes: 'Same EMI; 2 EMIs left' },
  { id: 'money-view', name: 'Money View', emi: 7200, dueDay: 5, dueDate: '2026-10-05', emisLeft: 17, priority: 'High', status: 'Pending', notes: 'Same EMI; long tenure' },
  { id: 'slice', name: 'Slice', emi: 1090, dueDay: 5, dueDate: '2026-10-05', emisLeft: 9, priority: 'Medium', status: 'Pending', notes: 'Same EMI' },
  { id: 'kreditbee', name: 'KreditBee', emi: 2798, dueDay: 4, dueDate: '2026-10-04', emisLeft: 4, priority: 'High', status: 'Pending', notes: 'Due 4th of every month' },
  { id: 'payrupik', name: 'PayRupik', emi: 7148, dueDay: 7, dueDate: '2026-10-07', emisLeft: 1, priority: 'Critical', status: 'Pending', notes: 'Final EMI in October' },
  { id: 'bike-emi', name: 'Bike EMI', emi: 6383, dueDay: 6, dueDate: '2026-10-06', emisLeft: 3, priority: 'High', status: 'Pending', notes: '3 EMIs left' },
  { id: 'new-bike-emi', name: 'New Bike EMI', emi: 5600, dueDay: 6, dueDate: '2026-10-06', emisLeft: 24, priority: 'Medium', status: 'Pending', notes: 'New bike EMI' },
  { id: 'pocket-mitra', name: 'Pocket Mitra', emi: 0, dueDay: 15, dueDate: '2026-09-15', emisLeft: 0, priority: 'Low', status: 'Paid', notes: 'Closed' },
  { id: 'pocketly', name: 'Pocketly', emi: 3534, dueDay: 15, dueDate: '2026-10-15', emisLeft: 3, priority: 'High', status: 'Pending', notes: 'Confirm if still active' },
  { id: 'ring', name: 'Ring', emi: 1949, dueDay: 15, dueDate: '2026-10-15', emisLeft: 17, priority: 'Medium', status: 'Pending', notes: '17 EMIs left' },
  { id: 'rupeedee', name: 'RupeeDee', emi: 3706, dueDay: 30, dueDate: '2026-09-30', emisLeft: 2, priority: 'Critical', status: 'Pending', notes: 'Next due 30 September' },
  { id: 'olyv', name: 'Olyv', emi: 0, dueDay: 27, dueDate: '2026-09-27', emisLeft: 0, priority: 'Low', status: 'Paid', notes: 'Closed' },
  { id: 'branch', name: 'Branch', emi: 2772, dueDay: 28, dueDate: '2026-10-28', emisLeft: 3, priority: 'High', status: 'Pending', notes: 'Same EMI' },
  { id: 'fatak-pay', name: 'Fatak Pay', emi: 7802, dueDay: 3, dueDate: '2026-10-03', emisLeft: 1, priority: 'Critical', status: 'Pending', notes: 'Final EMI due 3 October' },
  { id: 'mpokket', name: 'mPokket', emi: 2138, dueDay: 30, dueDate: '2026-09-30', emisLeft: 6, priority: 'High', status: 'Pending', notes: 'Next due 30 September' },
];

export const sampleState: AppState = {
  loans: sampleLoans,
  creditCard: {
    limit: 80000,
    outstanding: 45584,
    minimumDue: 45584,
    dueDay: 10,
    dueDate: '2026-09-10',
    extraPayment: 0,
    paid: false,
  },
  friendsDebt: 0,
  rent: 10000,
  rentDueDay: 19,
  julySalary: 57000,
  regularSalary: 57000,
  salaryDateDay: 6,
  projectionStartMonth: '2026-09',
  oneTimeIncomes: [
    { id: 'october-extra-income', month: '2026-10', amount: 12500, notes: 'One-time October income' },
  ],
  paidLoanIds: [],
  darkMode: false,
  survivalPlan: {
    currentBankBalance: 0,
    expectedSalaryDate: '2026-10-06',
    foodBuffer: 6000,
    transportBuffer: 2500,
    emergencyBuffer: 3000,
  },
  emergencyPlan: {
    cashAvailable: 0,
    daysUntilSalary: 7,
    cashBuffer: 3000,
  },
  negotiations: [],
  collectionLogs: [],
};

export const withDefaultAppState = (state: Partial<AppState> | null | undefined): AppState => ({
  ...sampleState,
  ...state,
  creditCard: { ...sampleState.creditCard, ...state?.creditCard },
  survivalPlan: { ...sampleState.survivalPlan, ...state?.survivalPlan },
  emergencyPlan: { ...sampleState.emergencyPlan, ...state?.emergencyPlan },
  loans: state?.loans ?? sampleState.loans,
  rentDueDay: state?.rentDueDay ?? sampleState.rentDueDay,
  salaryDateDay: state?.salaryDateDay ?? sampleState.salaryDateDay,
  projectionStartMonth: state?.projectionStartMonth ?? sampleState.projectionStartMonth,
  oneTimeIncomes: state?.oneTimeIncomes ?? sampleState.oneTimeIncomes,
  paidLoanIds: state?.paidLoanIds ?? [],
  negotiations: state?.negotiations ?? [],
  collectionLogs: state?.collectionLogs ?? [],
});
