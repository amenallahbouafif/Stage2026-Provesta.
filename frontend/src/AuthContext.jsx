import { createContext, useEffect, useState } from 'react'
import { setAuthToken } from './api.js'

const AuthContext = createContext({
  user: null,
  authenticated: false,
  login: () => {},
  logout: () => {},
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setAuthToken(token)
    }
  }, [])

  useEffect(() => {
    const handleLogout = () => {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setAuthToken(null)
      setUser(null)
    }

    window.addEventListener('logout', handleLogout)
    return () => window.removeEventListener('logout', handleLogout)
  }, [])

  const login = ({ token, user: userData }) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setAuthToken(token)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setAuthToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        authenticated: Boolean(user),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
