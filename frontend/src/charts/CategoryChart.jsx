import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  CATEGORY_COLORS,
  categoryLabel,
  formatCurrency,
} from "../utils/format";

export default function CategoryChart({ data }) {
  const chartData = Object.entries(data || {})
    .filter(([, value]) => Number(value) > 0)
    .map(([category, value]) => ({
      name: categoryLabel(category),
      key: category,
      value: Number(value),
    }));

  if (chartData.length === 0) {
    return (
      <div className="empty-state">
        No expense data yet. Add a transaction to see the breakdown.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          outerRadius={95}
          paddingAngle={2}
        >
          {chartData.map((entry) => (
            <Cell
              key={entry.key}
              fill={CATEGORY_COLORS[entry.key] || "#94a3b8"}
            />
          ))}
        </Pie>
        <Tooltip formatter={(value) => formatCurrency(value)} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
