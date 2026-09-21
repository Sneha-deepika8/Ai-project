export function formatCurrency(amount) {
  const value = Number(amount) || 0;

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(dateStr) {
  if (!dateStr) return "";

  const date = new Date(dateStr);

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Converts values like OTHER_INCOME → Other Income
export function categoryLabel(category) {
  if (!category) return "";

  return category
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}

// Income categories
export const INCOME_CATEGORIES = ["SALARY", "BONUS", "OTHER_INCOME"];

// Expense categories
export const EXPENSE_CATEGORIES = [
  "FOOD",
  "TRANSPORT",
  "SHOPPING",
  "ENTERTAINMENT",
  "BILLS",
  "HEALTH",
  "EDUCATION",
  "HOUSING",
  "OTHERS",
];

// All categories
export const CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

// Category colors
export const CATEGORY_COLORS = {
  FOOD: "#f97316",
  TRANSPORT: "#3b82f6",
  SHOPPING: "#ec4899",
  ENTERTAINMENT: "#a855f7",
  BILLS: "#ef4444",
  HEALTH: "#10b981",
  EDUCATION: "#6366f1",
  HOUSING: "#f59e0b",
  OTHERS: "#94a3b8",

  SALARY: "#22c55e",
  BONUS: "#16a34a",
  OTHER_INCOME: "#84cc16",
};
