import { useMemo, useState } from 'react';
import { AlertTriangle, ClipboardList, LayoutDashboard, LogOut, Moon, RefreshCcw, Sun, WalletCards, Landmark, TrendingDown } from 'lucide-react';
import { AddEditLoanModal } from './components/AddEditLoanModal';
import { AuthPanel } from './components/AuthPanel';
import { CollectionHarassmentLog } from './components/CollectionHarassmentLog';
import { CreditCardPlanner } from './components/CreditCardPlanner';
import { DashboardCard } from './components/DashboardCard';
import { DashboardCharts } from './components/Charts';
import { EmergencyDecisionAssistant } from './components/EmergencyDecisionAssistant';
import { ExtensionNegotiationTracker } from './components/ExtensionNegotiationTracker';
import { InsightCard } from './components/InsightCard';
import { LoanTable } from './components/LoanTable';
import { PaymentCalendar } from './components/PaymentCalendar';
import { PriorityPaymentEngine } from './components/PriorityPaymentEngine';
import { RecoveryPlanner } from './components/RecoveryPlanner';
import { StatusBadge } from './components/StatusBadge';
import { SurvivalCashPlanner } from './components/SurvivalCashPlanner';
import { sampleState } from './data/sampleData';
import { useSupabaseAppState } from './hooks/useSupabaseAppState';
import type { AppState, Loan, LoanStatus } from './types';
import {
  getDebtPressure,
  getInsights,
  getJulyObligation,
  getRecoveryProjection,
  getTotalMonthlyEmi,
  getTotalRemainingEmis,
  getTotalRemainingPayable,
} from './utils/calculations';
import { formatCurrency } from './utils/format';

export function App() {
  const { state, setState, user, loading, saving, error, signIn, signUp, signOut } = useSupabaseAppState();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'decisions' | 'loans' | 'planning' | 'records'>('overview');

  const totals = useMemo(() => {
    const monthlyEmi = getTotalMonthlyEmi(state.loans);
    const remainingEmis = getTotalRemainingEmis(state.loans);
    const remainingPayable = getTotalRemainingPayable(state.loans);
    const julyObligation = getJulyObligation(state);
    const gap = state.julySalary - julyObligation;
    const pressure = getDebtPressure(gap);
    const projection = getRecoveryProjection(state);
    const insights = getInsights(state);

    return { monthlyEmi, remainingEmis, remainingPayable, julyObligation, gap, pressure, projection, insights };
  }, [state]);

  const updateLoan = (loan: Loan) => {
    setState({
      ...state,
      loans: state.loans.some((item) => item.id === loan.id)
        ? state.loans.map((item) => (item.id === loan.id ? loan : item))
        : [...state.loans, loan],
    });
    setModalOpen(false);
    setSelectedLoan(null);
  };

  const updateLoanStatus = (id: string, status: LoanStatus) => {
    setState({
      ...state,
      loans: state.loans.map((loan) => (loan.id === id ? { ...loan, status } : loan)),
      paidLoanIds: status === 'Paid'
        ? Array.from(new Set([...state.paidLoanIds, id]))
        : state.paidLoanIds.filter((loanId) => loanId !== id),
    });
  };

  const openAddModal = () => {
    setSelectedLoan(null);
    setModalOpen(true);
  };

  const openEditModal = (loan: Loan) => {
    setSelectedLoan(loan);
    setModalOpen(true);
  };

  const resetSampleData = () => setState(sampleState);

  const toggleDarkMode = () => setState({ ...state, darkMode: !state.darkMode });

  if (!user) {
    return <AuthPanel error={error} onSignIn={signIn} onSignUp={signUp} />;
  }

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: LayoutDashboard },
    { id: 'decisions' as const, label: 'Decisions', icon: AlertTriangle },
    { id: 'loans' as const, label: 'Loans', icon: WalletCards },
    { id: 'planning' as const, label: 'Planning', icon: TrendingDown },
    { id: 'records' as const, label: 'Records', icon: ClipboardList },
  ];

  return (
    <main className={state.darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
        <header className="border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="label">Personal finance control room</p>
              <h1 className="mt-1 text-2xl font-bold tracking-normal text-slate-950 dark:text-white sm:text-3xl">Debt Recovery Dashboard</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                Track EMIs, July pressure, HDFC card balance, friends debt, rent, and recovery progress from July 2026.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="inline-flex items-center rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300">
                {loading ? 'Loading live data' : saving ? 'Saving live data' : 'Live data saved'}
              </div>
              <button onClick={toggleDarkMode} className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900">
                {state.darkMode ? <Sun size={16} /> : <Moon size={16} />} {state.darkMode ? 'Light' : 'Dark'}
              </button>
              <button onClick={resetSampleData} className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900">
                <RefreshCcw size={16} /> Reset sample data
              </button>
              <button onClick={() => void signOut()} className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900">
                <LogOut size={16} /> Sign out
              </button>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
              {error}
            </div>
          ) : null}

          <nav className="sticky top-0 z-30 -mx-4 border-y border-slate-200 bg-slate-50/95 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 sm:-mx-6 sm:px-6">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const selected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition ${selected ? 'bg-blue-600 text-white' : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'}`}
                  >
                    <Icon size={16} /> {tab.label}
                  </button>
                );
              })}
            </div>
          </nav>

          {activeTab === 'overview' ? (
            <>
              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <DashboardCard title="Total Monthly EMI" value={formatCurrency(totals.monthlyEmi)} subtitle={`${totals.remainingEmis} EMIs remaining across active loans`} icon={<WalletCards size={20} />} tone="blue" />
                <DashboardCard title="July Salary" value={formatCurrency(state.julySalary)} subtitle={`August onward salary: ${formatCurrency(state.regularSalary)}`} icon={<Landmark size={20} />} tone="green" />
                <DashboardCard title="Total Monthly Obligation" value={formatCurrency(totals.julyObligation)} subtitle={`Includes rent, friends debt, loans, and card minimum`} icon={<TrendingDown size={20} />} tone={totals.gap < 0 ? 'red' : 'green'} />
                <DashboardCard title="Salary Gap" value={formatCurrency(totals.gap)} subtitle="July salary minus total obligation" icon={<AlertTriangle size={20} />} tone={totals.gap < 0 ? 'red' : 'green'} />
              </section>

              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="panel p-4">
                  <p className="label">Debt pressure</p>
                  <div className="mt-2 flex items-center gap-2">
                    <StatusBadge label={totals.pressure} />
                    <span className="text-sm text-slate-500 dark:text-slate-400">{totals.pressure === 'Critical' ? 'Immediate action needed' : totals.pressure === 'High' ? 'Shortfall risk' : 'Track closely'}</span>
                  </div>
                </div>
                <DashboardCard title="Rent" value={formatCurrency(state.rent)} subtitle="Monthly fixed cost" tone="slate" />
                <DashboardCard title="Friends Debt" value={formatCurrency(state.friendsDebt)} subtitle="Planned repayment in projection" tone="orange" />
                <DashboardCard title="Remaining Payable" value={formatCurrency(totals.remainingPayable)} subtitle="Active loans only" tone="blue" />
              </section>

              <section>
                <h2 className="mb-3 text-lg font-bold text-slate-950 dark:text-white">Insights</h2>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                  {totals.insights.map((insight) => <InsightCard key={insight.title} {...insight} />)}
                </div>
              </section>
            </>
          ) : null}

          {activeTab === 'decisions' ? (
            <>
              <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
                <SurvivalCashPlanner state={state} onChange={(survivalPlan) => setState({ ...state, survivalPlan })} />
                <PriorityPaymentEngine state={state} />
              </div>
              <EmergencyDecisionAssistant state={state} onChange={(emergencyPlan) => setState({ ...state, emergencyPlan })} />
            </>
          ) : null}

          {activeTab === 'loans' ? (
            <>
              <LoanTable
                loans={state.loans}
                onAdd={openAddModal}
                onEdit={openEditModal}
                onDelete={(id) => setState({ ...state, loans: state.loans.filter((loan) => loan.id !== id), paidLoanIds: state.paidLoanIds.filter((loanId) => loanId !== id) })}
                onStatusChange={updateLoanStatus}
              />
              <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                <PaymentCalendar
                  state={state}
                  onToggleLoanPaid={(id) => updateLoanStatus(id, state.paidLoanIds.includes(id) ? 'Pending' : 'Paid')}
                  onToggleCardPaid={() => setState({ ...state, creditCard: { ...state.creditCard, paid: !state.creditCard.paid } })}
                />
                <CreditCardPlanner card={state.creditCard} onChange={(creditCard) => setState({ ...state, creditCard })} />
              </div>
            </>
          ) : null}

          {activeTab === 'planning' ? (
            <>
              <RecoveryPlanner projection={totals.projection} />
              <DashboardCharts loans={state.loans} projection={totals.projection} state={state} />
            </>
          ) : null}

          {activeTab === 'records' ? (
            <>
              <ExtensionNegotiationTracker state={state} onChange={(negotiations) => setState({ ...state, negotiations })} />
              <CollectionHarassmentLog logs={state.collectionLogs} onChange={(collectionLogs) => setState({ ...state, collectionLogs })} />
            </>
          ) : null}
        </div>

        <AddEditLoanModal loan={selectedLoan} open={modalOpen} onClose={() => setModalOpen(false)} onSave={updateLoan} />
      </div>
    </main>
  );
}
