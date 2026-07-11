import { useState } from 'react'

export default function BudgetForm({ categories, month, year, onSubmit, onCancel, submitting }) {
  const [categoryId, setCategoryId] = useState('')
  const [monthlyLimit, setMonthlyLimit] = useState('')
  const [error, setError] = useState('')

  const expenseCategories = categories.filter((c) => c.type === 'EXPENSE')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!categoryId) {
      setError('Please choose a category.')
      return
    }
    if (!monthlyLimit || Number(monthlyLimit) <= 0) {
      setError('Enter a monthly limit greater than zero.')
      return
    }

    onSubmit({
      categoryId: Number(categoryId),
      monthlyLimit: Number(monthlyLimit),
      month,
      year,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="form-error-banner">{error}</div>}

      <div className="form-group">
        <label htmlFor="budgetCategory">Category</label>
        <select id="budgetCategory" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">Select an expense category</option>
          {expenseCategories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="limit">Monthly limit</label>
        <input
          id="limit"
          type="number"
          step="0.01"
          min="0.01"
          value={monthlyLimit}
          onChange={(e) => setMonthlyLimit(e.target.value)}
          placeholder="0.00"
          required
        />
      </div>

      <div className="form-row">
        <button type="button" className="btn btn-secondary btn-block" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Saving…' : 'Save budget'}
        </button>
      </div>
    </form>
  )
}