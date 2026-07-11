import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <div className="brand">
          <span className="brand-mark">L</span>
          Ledgerline
        </div>

        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Dashboard
          </NavLink>
          <NavLink to="/transactions" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Transactions
          </NavLink>
          <NavLink to="/budgets" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Budgets
          </NavLink>
          <NavLink to="/categories" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Categories
          </NavLink>
        </nav>

        <div className="nav-user">
          <span className="nav-user-name">{user?.fullName}</span>
          <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
}