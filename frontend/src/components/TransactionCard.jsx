import { formatCurrency, formatDate, categoryLabel } from "../utils/format";

export default function TransactionCard({ transaction, onEdit, onDelete }) {
  const isIncome = transaction.type === "INCOME";
  return (
    <div className={`transaction-row ${isIncome ? "income" : "expense"}`}>
      <div className="transaction-main">
        <div
          className={`transaction-type-badge ${isIncome ? "badge-income" : "badge-expense"}`}
        >
          {isIncome ? "↑" : "↓"}
        </div>
        <div>
          <p className="transaction-desc">
            {transaction.description || categoryLabel(transaction.category)}
          </p>
          <p className="transaction-meta">
            {categoryLabel(transaction.category)} ·{" "}
            {formatDate(transaction.transactionDate)}
          </p>
        </div>
      </div>
      <div className="transaction-right">
        <span
          className={`transaction-amount ${isIncome ? "text-income" : "text-expense"}`}
        >
          {isIncome ? "+" : "-"}
          {formatCurrency(transaction.amount)}
        </span>
        {(onEdit || onDelete) && (
          <div className="transaction-actions">
            {onEdit && (
              <button
                className="icon-btn"
                onClick={() => onEdit(transaction)}
                aria-label="Edit"
              >
                ✏️
              </button>
            )}
            {onDelete && (
              <button
                className="icon-btn"
                onClick={() => onDelete(transaction)}
                aria-label="Delete"
              >
                🗑️
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
