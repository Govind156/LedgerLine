import api from './axios'
export const budgetApi = {
  // GET /api/budgets?month=&year=
  getAll: (month, year) =>
    api.get('/budgets', { params: { month, year } }).then((res) => res.data),

  // POST /api/budgets (creates or updates the budget for that category/month/year)
  createOrUpdate: (budget) =>
    api.post('/budgets', budget).then((res) => res.data),

  // DELETE /api/budgets/{id}
  remove: (id) =>
    api.delete(`/budgets/${id}`).then((res) => res.data),
}

export default budgetApi