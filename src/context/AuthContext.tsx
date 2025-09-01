
import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { User } from '../types'

interface AuthContextType {
  user: User | null
  login: (code: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.get('/api/auth/me')
        setUser(data)
        if (!data.onboarded && window.location.pathname !== '/onboarding') {
          navigate('/onboarding')
        }
      } catch (error) {
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [navigate])

  const login = async (code: string) => {
    try {
      const { data } = await axios.post('/api/auth/github', { code })
      setUser(data.user)
      if (!data.user.onboarded) {
        navigate('/onboarding')
      } else {
        navigate('/')
      }
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout')
      setUser(null)
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
  