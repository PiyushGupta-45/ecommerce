import { useState } from 'react'
import axios from 'axios'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function Auth() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { signin, signup } = useAuth()
  const navigate = useNavigate()

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin')
    setForm({ name: '', email: '', password: '' })
    setError(null)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (mode === 'signin') {
        await signin({ email: form.email, password: form.password })
      } else {
        await signup({ name: form.name, email: form.email, password: form.password })
      }
      navigate('/')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? 'Unable to authenticate. Please try again.')
      } else {
        setError(err instanceof Error ? err.message : 'Something went wrong.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <section className="auth-card">
        <p className="eyebrow">{mode === 'signin' ? 'Welcome back' : 'Create account'}</p>
        <h2>{mode === 'signin' ? 'Sign in to continue' : 'Join NovaCommerce'}</h2>

        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <label>
              Full name
              <input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                required
              />
            </label>
          )}
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
            />
          </label>
          <button className="primary-btn full" disabled={loading}>
            {loading ? 'Submitting…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
          {error && <p className="error">{error}</p>}
        </form>

        <p className="muted">
          {mode === 'signin' ? "Don't have an account?" : 'Already registered?'}{' '}
          <button className="link-btn" onClick={switchMode}>
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </section>
    </div>
  )
}

