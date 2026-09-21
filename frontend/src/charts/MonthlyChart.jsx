import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { formatCurrency } from "../utils/format";

export default function MonthlyChart({ transactions }) {
  const grouped = {};
  (transactions || []).forEach((t) => {
    const month = new Date(t.transactionDate).toLocaleDateString("en-IN", {
      month: "short",
      year: "2-digit",
    });
    if (!grouped[month]) grouped[month] = { month, income: 0, expense: 0 };
    if (t.type === "INCOME") grouped[month].income += Number(t.amount);
    else grouped[month].expense += Number(t.amount);
  });

  const data = Object.values(grouped);

  if (data.length === 0) {
    return (
      <div className="empty-state">
        No transactions yet to chart monthly trends.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value) => formatCurrency(value)} />
        <Legend />
        <Bar
          dataKey="income"
          fill="#22c55e"
          radius={[6, 6, 0, 0]}
          name="Income"
        />
        <Bar
          dataKey="expense"
          fill="#ef4444"
          radius={[6, 6, 0, 0]}
          name="Expense"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
