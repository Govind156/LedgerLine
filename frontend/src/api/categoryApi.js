import api from './axios'
export const categoryApi = {
  // GET /api/categories?type=INCOME|EXPENSE
  getAll: (type) =>
    api.get('/categories', { params: type ? { type } : {} }).then((res) => res.data),

  // POST /api/categories
  create: (category) =>
    api.post('/categories', category).then((res) => res.data),

  // PUT /api/categories/{id}
  update: (id, category) =>
    api.put(`/categories/${id}`, category).then((res) => res.data),

  // DELETE /api/categories/{id}
  remove: (id) =>
    api.delete(`/categories/${id}`).then((res) => res.data),
}

export default categoryApi