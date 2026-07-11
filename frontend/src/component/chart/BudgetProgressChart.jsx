function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

export default function BudgetProgressChart({ budgets }) {
  if (!budgets || budgets.length === 0) {
    return (
      <div className="empty-state">
        <h3>No budgets set for this month</h3>
        <p>Set a monthly limit on a category to start tracking it here.</p>
      </div>
    )
  }

  return (
    <div>
      {budgets.map((b) => {
        const status = b.exceeded ? 'exceeded' : b.nearLimit ? 'near' : 'ok'
        const width = Math.min(b.percentageUsed, 100)
        return (
          <div className="budget-item" key={b.id}>
            <div className="budget-item-head">
              <span className="budget-cat-name">
                <span className="color-dot" style={{ background: b.categoryColor }} />
                {b.categoryName}
              </span>
              <span className="budget-figures">
                {formatCurrency(b.spentAmount)} / {formatCurrency(b.monthlyLimit)}
              </span>
            </div>
            <div className="progress-track">
              <div className={`progress-fill ${status}`} style={{ width: `${width}%` }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}