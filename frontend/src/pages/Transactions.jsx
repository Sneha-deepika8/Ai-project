import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import TransactionCard from '../components/TransactionCard'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import ConfirmDialog from '../components/ConfirmDialog'
import Toast, { useToast } from '../components/Toast'
import { transactionService } from '../services/apiService'

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('ALL')
  const [toDelete, setToDelete] = useState(null)
  const { toast, showToast } = useToast()
  const navigate = useNavigate()

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await transactionService.getAll()
      setTransactions(response.data)
    } catch (err) {
      setError(err.friendlyMessage || 'Unable to load transactions.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleDelete = async () => {
    if (!toDelete) return
    try {
      await transactionService.delete(toDelete.id)
      setTransactions((prev) => prev.filter((t) => t.id !== toDelete.id))
      showToast('Transaction deleted')
    } catch (err) {
      showToast(err.friendlyMessage || 'Unable to delete transaction.', 'error')
    } finally {
      setToDelete(null)
    }
  }

  const filtered = transactions.filter((t) => filter === 'ALL' || t.type === filter)

  return (
    <AppLayout>
      <div className="page-header">
        <h1>Transactions</h1>
        <Link to="/transactions/new" className="btn btn-primary">+ Add Transaction</Link>
      </div>

      <div className="filter-bar">
        {['ALL', 'INCOME', 'EXPENSE'].map((f) => (
          <button key={f} className={filter === f ? 'chip active' : 'chip'} onClick={() => setFilter(f)}>
            {f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {loading && <LoadingSpinner label="Loading transactions..." />}
      <ErrorMessage message={error} />

      {!loading && filtered.length === 0 && (
        <div className="empty-state">No transactions found. <Link to="/transactions/new">Add one now</Link>.</div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="card">
          <div className="transaction-list">
            {filtered.map((t) => (
              <TransactionCard
                key={t.id}
                transaction={t}
                onEdit={(tx) => navigate(`/transactions/${tx.id}/edit`)}
                onDelete={(tx) => setToDelete(tx)}
              />
            ))}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Delete transaction?"
        message="This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
      <Toast toast={toast} />
    </AppLayout>
  )
}