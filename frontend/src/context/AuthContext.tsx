import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { User } from '../types'
import api from '../lib/api'

interface AuthContextValue {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  signup: (payload: { name: string; email: string; password: string }) => Promise<void>
  signin: (payload: { email: string; password: string }) => Promise<void>
  signout: () => void
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') {
      return null
    }
    return window.localStorage.getItem('ecom-token')
  })
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    if (token) {
      window.localStorage.setItem('ecom-token', token)
    } else {
      window.localStorage.removeItem('ecom-token')
    }
  }, [token])

  const fetchProfile = useCallback(async () => {
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      const { data } = await api.get('/auth/me')
      setUser(data.data)
    } catch (error) {
      console.error(error)
      setToken(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [token, setToken])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const persistAuth = (payload: { token: string; user: User }) => {
    setToken(payload.token)
    setUser(payload.user)
  }

  const signup = async ({ name, email, password }: { name: string; email: string; password: string }) => {
    const { data } = await api.post('/auth/register', { name, email, password })
    persistAuth(data.data)
  }

  const signin = async ({ email, password }: { email: string; password: string }) => {
    const { data } = await api.post('/auth/login', { email, password })
    persistAuth(data.data)
  }

  const signout = () => {
    setToken(null)
    setUser(null)
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: !!user && !!token,
      loading,
      signup,
      signin,
      signout,
      refreshProfile: fetchProfile,
    }),
    [user, token, loading, fetchProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}

