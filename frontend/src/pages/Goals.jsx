import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import GoalCard from '../components/GoalCard'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import ConfirmDialog from '../components/ConfirmDialog'
import Toast, { useToast } from '../components/Toast'
import { goalService } from '../services/apiService'

export default function Goals() {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const { toast, showToast } = useToast()
  const navigate = useNavigate()

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await goalService.getAll()
      setGoals(response.data)
    } catch (err) {
      setError(err.friendlyMessage || 'Unable to load goals.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleContribute = async (goalId, amount) => {
    try {
      const response = await goalService.contribute(goalId, amount)
      setGoals((prev) => prev.map((g) => (g.id === goalId ? response.data : g)))
      showToast(response.data.status === 'COMPLETED' ? 'Goal completed! 🎉' : 'Contribution added')
    } catch (err) {
      showToast(err.friendlyMessage || 'Unable to add contribution.', 'error')
    }
  }

  const handleDelete = async () => {
    if (!toDelete) return
    try {
      await goalService.delete(toDelete.id)
      setGoals((prev) => prev.filter((g) => g.id !== toDelete.id))
      showToast('Goal deleted')
    } catch (err) {
      showToast(err.friendlyMessage || 'Unable to delete goal.', 'error')
    } finally {
      setToDelete(null)
    }
  }

  return (
    <AppLayout>
      <div className="page-header">
        <h1>Savings Goals</h1>
        <Link to="/goals/new" className="btn btn-primary">+ Create New Goal</Link>
      </div>

      {loading && <LoadingSpinner label="Loading goals..." />}
      <ErrorMessage message={error} />

      {!loading && goals.length === 0 && (
        <div className="empty-state">No goals yet. <Link to="/goals/new">Create your first goal</Link>.</div>
      )}

      <div className="goal-grid">
        {goals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onContribute={handleContribute}
            onEdit={(g) => navigate(`/goals/${g.id}/edit`)}
            onDelete={(g) => setToDelete(g)}
          />
        ))}
      </div>

      <ConfirmDialog
        open={!!toDelete}
        title="Delete goal?"
        message="This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
      <Toast toast={toast} />
    </AppLayout>
  )
}