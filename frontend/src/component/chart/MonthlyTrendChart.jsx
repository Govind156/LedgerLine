import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
}

function formatMonthLabel(monthStr) {
  const [year, month] = monthStr.split('-')
  const date = new Date(Number(year), Number(month) - 1, 1)
  return date.toLocaleDateString('en-US', { month: 'short' })
}

export default function MonthlyTrendChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="empty-state">
        <p>Not enough history yet to chart a trend.</p>
      </div>
    )
  }

  const chartData = data.map((d) => ({
    month: formatMonthLabel(d.month),
    income: Number(d.income),
    expense: Number(d.expense),
  }))

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--accent-teal)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="var(--accent-teal)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--accent-coral)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="var(--accent-coral)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--ink-muted)' }} axisLine={{ stroke: 'var(--line-strong)' }} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: 'var(--ink-muted)' }} axisLine={false} tickLine={false} tickFormatter={formatCurrency} width={64} />
        <Tooltip
          formatter={(value) => formatCurrency(value)}
          contentStyle={{
            background: 'var(--paper-raised)',
            border: '1px solid var(--line-strong)',
            borderRadius: 8,
            fontFamily: 'var(--font-body)',
            fontSize: 13,
          }}
        />
        <Area type="monotone" dataKey="income" stroke="var(--accent-teal)" fill="url(#incomeGradient)" strokeWidth={2} name="Income" />
        <Area type="monotone" dataKey="expense" stroke="var(--accent-coral)" fill="url(#expenseGradient)" strokeWidth={2} name="Expense" />
      </AreaChart>
    </ResponsiveContainer>
  )
}