import api from './axios'
export const authApi = {
  signup: (fullName, email, password) =>
    api.post('/auth/signup', { fullName, email, password }).then((res) => res.data),

  login: (email, password) =>
    api.post('/auth/login', { email, password }).then((res) => res.data),
}

export default authApi