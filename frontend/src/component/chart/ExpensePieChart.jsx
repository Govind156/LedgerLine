import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const PALETTE = [
  'var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)',
  'var(--chart-5)', 'var(--chart-6)', 'var(--chart-7)', 'var(--chart-8)',
]

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

export default function ExpensePieChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="empty-state">
        <p>No expenses recorded for this month yet.</p>
      </div>
    )
  }

  const chartData = data.map((d) => ({
    name: d.categoryName,
    value: Number(d.totalAmount),
  }))

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={62}
          outerRadius={98}
          paddingAngle={2}
        >
          {chartData.map((_, index) => (
            <Cell key={index} fill={PALETTE[index % PALETTE.length]} stroke="var(--paper-raised)" strokeWidth={2} />
          ))}
        </Pie>
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
        <Legend
          layout="vertical"
          verticalAlign="middle"
          align="right"
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 12.5, fontFamily: 'var(--font-body)', color: 'var(--ink-muted)' }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}