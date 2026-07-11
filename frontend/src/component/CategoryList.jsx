export default function CategoryList({ categories, onEdit, onDelete }) {
  if (!categories || categories.length === 0) {
    return (
      <div className="empty-state">
        <h3>No categories yet</h3>
        <p>Add a category to start organizing your transactions and budgets.</p>
      </div>
    )
  }

  const expenseCategories = categories.filter((c) => c.type === 'EXPENSE')
  const incomeCategories = categories.filter((c) => c.type === 'INCOME')

  const renderGroup = (title, items) => (
    <div style={{ marginBottom: 24 }}>
      <div className="card-eyebrow">{title}</div>
      <div className="table-wrap">
        <table>
          <tbody>
            {items.map((c) => (
              <tr key={c.id}>
                <td style={{ width: '60%' }}>
                  <span className="budget-cat-name">
                    <span className="color-dot" style={{ background: c.color }} />
                    {c.name}
                  </span>
                </td>
                <td>
                  <div className="row-actions">
                    <button className="btn btn-secondary btn-sm" onClick={() => onEdit(c)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => onDelete(c)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td style={{ color: 'var(--ink-muted)' }}>No {title.toLowerCase()} yet.</td>
                <td></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <div>
      {renderGroup('Expense categories', expenseCategories)}
      {renderGroup('Income categories', incomeCategories)}
    </div>
  )
}