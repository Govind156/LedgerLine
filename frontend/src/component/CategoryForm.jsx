import { useState } from 'react'

const SWATCHES = [
  '#2A6F77', '#B8860B', '#C1543C', '#6B5B95',
  '#4F7942', '#A0522D', '#3E6990', '#8C6E4A',
]

export default function CategoryForm({ initialData, onSubmit, onCancel, submitting }) {
  const [name, setName] = useState(initialData?.name || '')
  const [type, setType] = useState(initialData?.type || 'EXPENSE')
  const [color, setColor] = useState(initialData?.color || SWATCHES[0])
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Category name is required.')
      return
    }

    onSubmit({ name: name.trim(), type, color })
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="form-error-banner">{error}</div>}

      <div className="form-group">
        <label htmlFor="catName">Name</label>
        <input
          id="catName"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Subscriptions"
          required
          autoFocus
        />
      </div>

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
        <label>Color</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {SWATCHES.map((swatch) => (
            <button
              type="button"
              key={swatch}
              onClick={() => setColor(swatch)}
              aria-label={`Choose color ${swatch}`}
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: swatch,
                border: color === swatch ? '3px solid var(--ink)' : '1px solid var(--line-strong)',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>
      </div>

      <div className="form-row">
        <button type="button" className="btn btn-secondary btn-block" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Saving…' : initialData ? 'Save changes' : 'Add category'}
        </button>
      </div>
    </form>
  )
}