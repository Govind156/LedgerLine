import { useEffect, useState } from 'react'

const todayISO = () => new Date().toISOString().slice(0, 10)

export default function TransactionForm({ categories, initialData, onSubmit, onCancel, submitting }) {
  const [type, setType] = useState(initialData?.type || 'EXPENSE')
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || '')
  const [amount, setAmount] = useState(initialData?.amount ?? '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [transactionDate, setTransactionDate] = useState(initialData?.transactionDate || todayISO())
  const [error, setError] = useState('')

  const filteredCategories = categories.filter((c) => c.type === type)

  useEffect(() => {
    // If the type changes and the previously selected category no longer matches, clear it.
    if (categoryId && !filteredCategories.some((c) => c.id === Number(categoryId))) {
      setCategoryId('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!categoryId) {
      setError('Please choose a category.')
      return
    }
    if (!amount || Number(amount) <= 0) {
      setError('Enter an amount greater than zero.')
      return
    }

    onSubmit({
      categoryId: Number(categoryId),
      type,
      amount: Number(amount),
      description: description.trim() || null,
      transactionDate,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="form-error-banner">{error}</div>}

      <div className="form-group">
        <label>Type</label>
        <div className="form-row">
          <button
            type="button"
            className={`btn ${type === 'EXPENSE' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setType('EXPENSE')}
          >
            Expense
          </button>
          <button
            type="button"
            className={`btn ${type === 'INCOME' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setType('INCOME')}
          >
            Income
          </button>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">Select a category</option>
          {filteredCategories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            value={transactionDate}
            onChange={(e) => setTransactionDate(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="description">Description (optional)</label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Weekly grocery run"
        />
      </div>

      <div className="form-row">
        <button type="button" className="btn btn-secondary btn-block" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Saving…' : initialData ? 'Save changes' : 'Add transaction'}
        </button>
      </div>
    </form>
  )
}