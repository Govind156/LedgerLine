import { useCallback, useEffect, useState } from 'react'
import categoryApi from '../api/categoryApi'
import budgetApi from '../api/budgetApi'
import BudgetForm from '../component/BudgetForm.jsx'
import BudgetProgressChart from '../component/chart/BudgetProgressChart.jsx'
import Modal from '../component/Modal.jsx'

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export default function Budgets() {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())

  const [budgets, setBudgets] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const loadCategories = useCallback(async () => {
    const data = await categoryApi.getAll('EXPENSE')
    setCategories(data)
  }, [])

  const loadBudgets = useCallback(async (m, y) => {
    setLoading(true)
    setError('')
    try {
      const data = await budgetApi.getAll(m, y)
      setBudgets(data)
    } catch (err) {
      setError('Could not load budgets. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  useEffect(() => {
    loadBudgets(month, year)
  }, [month, year, loadBudgets])

  const shiftMonth = (delta) => {
    let m = month + delta
    let y = year
    if (m < 1) { m = 12; y -= 1 }
    if (m > 12) { m = 1; y += 1 }
    setMonth(m)
    setYear(y)
  }

  const handleSubmit = async (payload) => {
    setSubmitting(true)
    try {
      await budgetApi.createOrUpdate(payload)
      setModalOpen(false)
      await loadBudgets(month, year)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save this budget.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (budget) => {
    if (!window.confirm(`Remove the budget for ${budget.categoryName}?`)) return
    try {
      await budgetApi.remove(budget.id)
      await loadBudgets(month, year)
    } catch (err) {
      setError('Could not delete this budget.')
    }
  }

  const exceededCount = budgets.filter((b) => b.exceeded).length
  const nearCount = budgets.filter((b) => b.nearLimit).length

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Budgets</h1>
          <p>Set a monthly limit per category and watch it in real time.</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div className="month-picker">
            <button className="icon-btn" onClick={() => shiftMonth(-1)} aria-label="Previous month">‹</button>
            <span>{MONTH_NAMES[month - 1]} {year}</span>
            <button className="icon-btn" onClick={() => shiftMonth(1)} aria-label="Next month">›</button>
          </div>
          <button className="btn btn-primary" onClick={() => setModalOpen(true)}>+ Set budget</button>
        </div>
      </div>

      {error && <div className="form-error-banner">{error}</div>}

      {(exceededCount > 0 || nearCount > 0) && (
        <div style={{ marginBottom: 16 }}>
          {exceededCount > 0 && (
            <div className="alert-banner exceeded">
              ⚠ {exceededCount} {exceededCount === 1 ? 'category has' : 'categories have'} gone over budget this month.
            </div>
          )}
          {nearCount > 0 && (
            <div className="alert-banner near">
              ◐ {nearCount} {nearCount === 1 ? 'category is' : 'categories are'} nearing its limit (80%+ spent).
            </div>
          )}
        </div>
      )}

      <div className="card">
        {loading ? (
          <div className="empty-state"><p>Loading budgets…</p></div>
        ) : (
          <>
            <BudgetProgressChart budgets={budgets} />
            {budgets.length > 0 && (
              <div style={{ marginTop: 18, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {budgets.map((b) => (
                  <button
                    key={b.id}
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(b)}
                    title={`Remove budget for ${b.categoryName}`}
                  >
                    Remove {b.categoryName}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {modalOpen && (
        <Modal title="Set a monthly budget" onClose={() => setModalOpen(false)}>
          <BudgetForm
            categories={categories}
            month={month}
            year={year}
            onSubmit={handleSubmit}
            onCancel={() => setModalOpen(false)}
            submitting={submitting}
          />
        </Modal>
      )}
    </div>
  )
}