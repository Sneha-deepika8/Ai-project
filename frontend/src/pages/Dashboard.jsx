import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import StatCard from "../components/StatCard";
import TransactionCard from "../components/TransactionCard";
import GoalProgress from "../components/GoalProgress";
import CategoryChart from "../charts/CategoryChart";
import AIInsightCard from "../components/AIInsightCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { analyticsService } from "../services/apiService";
import { formatCurrency } from "../utils/format";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await analyticsService.getDashboard();
      setDashboard(response.data);
    } catch (err) {
      setError(err.friendlyMessage || "Unable to load your dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <AppLayout>
      <div className="page-header">
        <h1>Dashboard</h1>
        <Link to="/transactions/new" className="btn btn-primary">
          + Add Transaction
        </Link>
      </div>

      {loading && <LoadingSpinner label="Loading your dashboard..." />}
      <ErrorMessage message={error} />

      {!loading && dashboard && (
        <>
          <div className="stat-grid">
            <StatCard
              label="Total Income"
              value={formatCurrency(dashboard.totalIncome)}
              icon="💰"
              tone="income"
            />
            <StatCard
              label="Total Expenses"
              value={formatCurrency(dashboard.totalExpense)}
              icon="💸"
              tone="expense"
            />
            <StatCard
              label="Current Balance"
              value={formatCurrency(dashboard.balance)}
              icon="🏦"
              tone="balance"
            />
            <StatCard
              label="Savings Progress"
              value={
                dashboard.goals?.length
                  ? `${dashboard.goals[0].percentageCompleted}%`
                  : "No goals yet"
              }
              icon="🎯"
              tone="goal"
            />
          </div>

          <div className="dashboard-grid">
            <div className="card">
              <h3>Expense by Category</h3>
              <CategoryChart data={dashboard.categoryBreakdown} />
            </div>

            <div className="card">
              <h3>Goal Progress</h3>
              {dashboard.goals && dashboard.goals.length > 0 ? (
                dashboard.goals.slice(0, 3).map((goal) => (
                  <div key={goal.id} className="dashboard-goal-item">
                    <div className="dashboard-goal-header">
                      <span>{goal.name}</span>
                      <span className="muted small">
                        {goal.percentageCompleted}%
                      </span>
                    </div>
                    <GoalProgress
                      percentage={goal.percentageCompleted}
                      completed={goal.status === "COMPLETED"}
                    />
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  No goals yet.{" "}
                  <Link to="/goals/new">Create your first goal</Link>.
                </div>
              )}
            </div>
          </div>

          <AIInsightCard />

          <div className="card">
            <div className="card-header-row">
              <h3>Recent Transactions</h3>
              <Link to="/transactions">View all</Link>
            </div>
            {dashboard.recentTransactions &&
            dashboard.recentTransactions.length > 0 ? (
              <div className="transaction-list">
                {dashboard.recentTransactions.map((t) => (
                  <TransactionCard key={t.id} transaction={t} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                No transactions yet.{" "}
                <Link to="/transactions/new">Add your first transaction</Link>.
              </div>
            )}
          </div>
        </>
      )}
    </AppLayout>
  );
}
