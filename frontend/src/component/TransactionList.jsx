function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function TransactionList({ transactions, onEdit, onDelete }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="empty-state">
        <h3>No transactions yet</h3>
        <p>Add your first income or expense to start building your ledger.</p>
      </div>
    )
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Description</th>
            <th>Type</th>
            <th style={{ textAlign: 'right' }}>Amount</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td className="mono">{formatDate(t.transactionDate)}</td>
              <td>
                <span className="budget-cat-name">
                  <span className="color-dot" style={{ background: t.categoryColor }} />
                  {t.categoryName}
                </span>
              </td>
              <td>{t.description || <span style={{ color: 'var(--ink-muted)' }}>—</span>}</td>
              <td>
                <span className={`badge ${t.type === 'INCOME' ? 'income' : 'expense'}`}>
                  {t.type === 'INCOME' ? 'Income' : 'Expense'}
                </span>
              </td>
              <td className="amount" style={{ textAlign: 'right', color: t.type === 'INCOME' ? 'var(--success)' : 'var(--accent-coral)' }}>
                {t.type === 'INCOME' ? '+' : '−'}{formatCurrency(t.amount)}
              </td>
              <td>
                <div className="row-actions">
                  <button className="btn btn-secondary btn-sm" onClick={() => onEdit(t)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => onDelete(t)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}