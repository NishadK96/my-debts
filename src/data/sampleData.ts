import type { AppState, Loan } from '../types';

export const sampleLoans: Loan[] = [
  { id: 'true-balance', name: 'True Balance', emi: 2318, dueDay: 4, emisLeft: 5, priority: 'High', status: 'Pending', notes: 'Due 4 July' },
  { id: 'money-view', name: 'Money View', emi: 7200, dueDay: 5, emisLeft: 20, priority: 'High', status: 'Pending', notes: 'Long tenure' },
  { id: 'slice', name: 'Slice', emi: 1090, dueDay: 5, emisLeft: 12, priority: 'Medium', status: 'Pending', notes: '' },
  { id: 'kreditbee', name: 'KreditBee', emi: 6146, dueDay: 5, emisLeft: 2, priority: 'Critical', status: 'Pending', notes: 'Ends soon' },
  { id: 'payrupik', name: 'PayRupik', emi: 6614, dueDay: 6, emisLeft: 2, priority: 'Critical', status: 'Pending', notes: 'Ends soon' },
  { id: 'bike-emi', name: 'Bike EMI', emi: 6383, dueDay: 6, emisLeft: 7, priority: 'High', status: 'Pending', notes: '' },
  { id: 'pocket-mitra', name: 'Pocket Mitra', emi: 3947, dueDay: 15, emisLeft: 1, priority: 'Critical', status: 'Pending', notes: 'Final EMI' },
  { id: 'pocketly', name: 'Pocketly', emi: 3534, dueDay: 15, emisLeft: 3, priority: 'High', status: 'Pending', notes: 'Short loan' },
  { id: 'ring', name: 'Ring', emi: 1949, dueDay: 15, emisLeft: 20, priority: 'Medium', status: 'Pending', notes: 'Long tenure' },
  { id: 'rupeedee', name: 'RupeeDee', emi: 4670, dueDay: 25, emisLeft: 2, priority: 'Critical', status: 'Pending', notes: 'Ends soon' },
  { id: 'olyv', name: 'Olyv', emi: 7832, dueDay: 27, emisLeft: 2, priority: 'Critical', status: 'Pending', notes: 'Ends soon' },
  { id: 'branch', name: 'Branch', emi: 2772, dueDay: 28, emisLeft: 5, priority: 'High', status: 'Pending', notes: '' },
];

export const sampleState: AppState = {
  loans: sampleLoans,
  creditCard: {
    limit: 80000,
    outstanding: 71000,
    minimumDue: 15000,
    dueDay: 10,
    extraPayment: 0,
    paid: false,
  },
  friendsDebt: 12000,
  rent: 10000,
  julySalary: 40000,
  regularSalary: 60000,
  paidLoanIds: [],
  darkMode: false,
};
