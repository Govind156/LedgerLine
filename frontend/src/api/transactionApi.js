import api from './axios'


export const transactionApi = {
  // GET /api/transactions?page=&size=
  getAll: (page = 0, size = 20) =>
    api.get('/transactions', { params: { page, size } }).then((res) => res.data),

  // POST /api/transactions
  create: (transaction) =>
    api.post('/transactions', transaction).then((res) => res.data),

  // PUT /api/transactions/{id}
  update: (id, transaction) =>
    api.put(`/transactions/${id}`, transaction).then((res) => res.data),

  // DELETE /api/transactions/{id}
  remove: (id) =>
    api.delete(`/transactions/${id}`).then((res) => res.data),
}

export default transactionApi