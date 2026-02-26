import { createContext, useContext, useState, useEffect } from 'react'
import { getMe } from '../services/authService'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      if (token) {
        try {
          const user = await getMe()
          setUser(user)
        } catch {
          localStorage.removeItem('token')
          sessionStorage.removeItem('token')
        }
      }
      setLoading(false)
    }
    init()
  }, [])

  const loginUser = (token, userData, remember = false) => {
    if (remember) {
      localStorage.setItem('token', token)
      localStorage.setItem('remember', 'true')
    } else {
      sessionStorage.setItem('token', token)
      localStorage.removeItem('token')
      localStorage.removeItem('remember')
    }
    setUser(userData)
  }

  const logoutUser = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('remember')
    sessionStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)