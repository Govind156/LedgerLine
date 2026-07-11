import { Routes, Route } from 'react-router-dom'
import Navbar from './component/Navbar.jsx'
import PrivateRoute from './component/PrivateRoute.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Transactions from './pages/Transactions.jsx'
import Budgets from './pages/Budgets.jsx'
import Categories from './pages/Categories.jsx'

function AppShell({ children }) {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="page">
        <div className="container">{children}</div>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <AppShell>
              <Dashboard />
            </AppShell>
          </PrivateRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <PrivateRoute>
            <AppShell>
              <Transactions />
            </AppShell>
          </PrivateRoute>
        }
      />
      <Route
        path="/budgets"
        element={
          <PrivateRoute>
            <AppShell>
              <Budgets />
            </AppShell>
          </PrivateRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <PrivateRoute>
            <AppShell>
              <Categories />
            </AppShell>
          </PrivateRoute>
        }
      />
      
    </Routes>
  )
}