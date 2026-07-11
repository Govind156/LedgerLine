import api from './axios'
export const dashboardApi = {
  // GET /api/dashboard/summary?month=&year=
  getSummary: (month, year) =>
    api.get('/dashboard/summary', { params: { month, year } }).then((res) => res.data),
}

export default dashboardApi