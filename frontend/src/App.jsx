import { useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Produits from './pages/Produits.jsx'
import Commandes from './pages/Commandes.jsx'
import CommandeDetail from './pages/CommandeDetail.jsx'
import Fournisseurs from './pages/Fournisseurs.jsx'
import Stocks from './pages/Stocks.jsx'
import Utilisateurs from './pages/Utilisateurs.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { logout as apiLogout } from './api.js'
import AuthContext from './AuthContext.jsx'

function App() {
  const { authenticated, login, logout } = useContext(AuthContext)

  const handleLogin = ({ token, user }) => {
    login({ token, user })
  }

  const handleLogout = async () => {
    try {
      await apiLogout()
    } catch (error) {
      // ignore network or server issues during logout
    }

    logout()
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            authenticated ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute authenticated={authenticated}>
              <Layout onLogout={handleLogout} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="produits" element={<Produits />} />
          <Route path="commandes" element={<Commandes />} />
          <Route path="commandes/:id" element={<CommandeDetail />} />
          <Route path="fournisseurs" element={<Fournisseurs />} />
          <Route path="stocks" element={<Stocks />} />
          <Route path="utilisateurs" element={<Utilisateurs />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>

        <Route
          path="*"
          element={
            authenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
