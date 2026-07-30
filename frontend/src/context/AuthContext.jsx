import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import authApi from '../api/authApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('ft_token')
    const storedUser = localStorage.getItem('ft_user')
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem('ft_token')
        localStorage.removeItem('ft_user')
      }
    }
    setLoading(false)
  }, [])

  const persistSession = (data) => {
    const sessionUser = { userId: data.userId, fullName: data.fullName, email: data.email }
    localStorage.setItem('ft_token', data.token)
    localStorage.setItem('ft_user', JSON.stringify(sessionUser))
    setUser(sessionUser)
  }

  const login = useCallback(async (email, password) => {
    const data = await authApi.login(email, password)
    persistSession(data)
    return data
  }, [])

  const signup = useCallback(async (fullName, email, password) => {
    const data = await authApi.signup(fullName, email, password)
    persistSession(data)
    return data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('ft_token')
    localStorage.removeItem('ft_user')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}