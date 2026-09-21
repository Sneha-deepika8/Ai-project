import { useEffect, useMemo, useState } from "react";
import AppLayout from "../layouts/AppLayout";
import StatCard from "../components/StatCard";
import CategoryChart from "../charts/CategoryChart";
import MonthlyChart from "../charts/MonthlyChart";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { analyticsService, transactionService } from "../services/apiService";
import { formatCurrency, categoryLabel } from "../utils/format";

const FILTERS = [
  "This Month",
  "Last Month",
  "Last 3 Months",
  "This Year",
  "All Time",
];

function filterTransactions(transactions, filter) {
  const now = new Date();
  return transactions.filter((t) => {
    const date = new Date(t.transactionDate);
    switch (filter) {
      case "This Month":
        return (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      case "Last Month": {
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        return (
          date.getMonth() === lastMonth.getMonth() &&
          date.getFullYear() === lastMonth.getFullYear()
        );
      }
      case "Last 3 Months": {
        const threeMonthsAgo = new Date(
          now.getFullYear(),
          now.getMonth() - 3,
          1,
        );
        return date >= threeMonthsAgo;
      }
      case "This Year":
        return date.getFullYear() === now.getFullYear();
      default:
        return true;
    }
  });
}

export default function Analytics() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [filter, setFilter] = useState("This Month");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [txRes, summaryRes] = await Promise.all([
          transactionService.getAll(),
          analyticsService.getSummary(),
        ]);
        setTransactions(txRes.data);
        setSummary(summaryRes.data);
      } catch (err) {
        setError(err.friendlyMessage || "Unable to load analytics.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredTransactions = useMemo(
    () => filterTransactions(transactions, filter),
    [transactions, filter],
  );

  const stats = useMemo(() => {
    const income = filteredTransactions
      .filter((t) => t.type === "INCOME")
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const expense = filteredTransactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const categoryTotals = {};
    filteredTransactions
      .filter((t) => t.type === "EXPENSE")
      .forEach((t) => {
        categoryTotals[t.category] =
          (categoryTotals[t.category] || 0) + Number(t.amount);
      });
    const topCategory = Object.entries(categoryTotals).sort(
      (a, b) => b[1] - a[1],
    )[0];
    const expenseCount = filteredTransactions.filter(
      (t) => t.type === "EXPENSE",
    ).length;
    const avgExpense = expenseCount > 0 ? expense / expenseCount : 0;

    return {
      income,
      expense,
      savings: income - expense,
      categoryTotals,
      topCategory,
      avgExpense,
    };
  }, [filteredTransactions]);

  return (
    <AppLayout>
      <div className="page-header">
        <h1>Analytics</h1>
      </div>

      <div className="filter-bar">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={filter === f ? "chip active" : "chip"}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {loading && <LoadingSpinner label="Crunching your numbers..." />}
      <ErrorMessage message={error} />

      {!loading && (
        <>
          <div className="stat-grid">
            <StatCard
              label="Total Income"
              value={formatCurrency(stats.income)}
              icon="💰"
              tone="income"
            />
            <StatCard
              label="Total Expenses"
              value={formatCurrency(stats.expense)}
              icon="💸"
              tone="expense"
            />
            <StatCard
              label="Savings"
              value={formatCurrency(stats.savings)}
              icon="🏦"
              tone="balance"
            />
            <StatCard
              label="Top Category"
              value={
                stats.topCategory ? categoryLabel(stats.topCategory[0]) : "—"
              }
              icon="🏷️"
              tone="goal"
            />
          </div>

          <div className="dashboard-grid">
            <div className="card">
              <h3>Category Distribution</h3>
              <CategoryChart data={stats.categoryTotals} />
            </div>
            <div className="card">
              <h3>Monthly Trend</h3>
              <MonthlyChart transactions={filteredTransactions} />
            </div>
          </div>

          <div className="card">
            <h3>Average Expense per Transaction</h3>
            <p className="stat-card-value">
              {formatCurrency(stats.avgExpense)}
            </p>
          </div>
        </>
      )}
    </AppLayout>
  );
}
