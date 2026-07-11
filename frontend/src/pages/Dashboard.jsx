import { useCallback, useEffect, useState } from 'react'
import dashboardApi from '../api/dashboardApi'
import ExpensePieChart from '../component/chart/ExpensePieChart.jsx'
import MonthlyTrendChart from '../component/chart/MonthlyTrendChart.jsx'
import BudgetProgressChart from '../component/chart/BudgetProgressChart.jsx'
import { useAuth } from '../context/AuthContext.jsx'

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export default function Dashboard() {
  const { user } = useAuth()
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadSummary = useCallback(async (m, y) => {
    setLoading(true)
    setError('')
    try {
      const data = await dashboardApi.getSummary(m, y)
      setSummary(data)
    } catch (err) {
      setError('Could not load your dashboard. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSummary(month, year)
  }, [month, year, loadSummary])

  const shiftMonth = (delta) => {
    let m = month + delta
    let y = year
    if (m < 1) { m = 12; y -= 1 }
    if (m > 12) { m = 1; y += 1 }
    setMonth(m)
    setYear(y)
  }

  if (loading && !summary) {
    return <div className="empty-state"><p>Loading your dashboard…</p></div>
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Hello, {user?.fullName?.split(' ')[0]}</h1>
          <p>Here's how {MONTH_NAMES[month - 1]} {year} looks so far.</p>
        </div>
        <div className="month-picker">
          <button className="icon-btn" onClick={() => shiftMonth(-1)} aria-label="Previous month">‹</button>
          <span>{MONTH_NAMES[month - 1]} {year}</span>
          <button className="icon-btn" onClick={() => shiftMonth(1)} aria-label="Next month">›</button>
        </div>
      </div>

      {error && <div className="form-error-banner">{error}</div>}

      {summary && (
        <>
          {summary.budgetAlerts.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              {summary.budgetAlerts.map((b) => (
                <div key={b.id} className={`alert-banner ${b.exceeded ? 'exceeded' : 'near'}`}>
                  {b.exceeded ? '⚠' : '◐'} {b.categoryName}: {formatCurrency(b.spentAmount)} of {formatCurrency(b.monthlyLimit)} spent
                  {b.exceeded ? ' — over budget.' : ' — approaching your limit.'}
                </div>
              ))}
            </div>
          )}

          <div className="stat-grid">
            <div className="stat-tile income">
              <div className="stat-label">Total income</div>
              <div className="stat-value positive">{formatCurrency(summary.totalIncome)}</div>
            </div>
            <div className="stat-tile expense">
              <div className="stat-label">Total expenses</div>
              <div className="stat-value negative">{formatCurrency(summary.totalExpense)}</div>
            </div>
            <div className="stat-tile balance">
              <div className="stat-label">Net balance</div>
              <div className={`stat-value ${summary.netBalance >= 0 ? 'positive' : 'negative'}`}>
                {formatCurrency(summary.netBalance)}
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-eyebrow">Trend</div>
                  <h3>Income vs. expenses</h3>
                </div>
              </div>
              <MonthlyTrendChart data={summary.monthlyTrend} />
            </div>

            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-eyebrow">Breakdown</div>
                  <h3>Spending by category</h3>
                </div>
              </div>
              <ExpensePieChart data={summary.expensesByCategory} />
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-eyebrow">Analytics</div>
                <h3>Categories needing attention</h3>
              </div>
            </div>
            {summary.budgetAlerts.length > 0 ? (
              <BudgetProgressChart budgets={summary.budgetAlerts} />
            ) : (
              <div className="empty-state">
                <p>All budgeted categories are comfortably under their limit. Nice work.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}