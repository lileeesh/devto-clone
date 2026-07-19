import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (sessionStorage.getItem('token')) {
      navigate('/dashboard')
    }
  }, [navigate])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const url = isLogin ? '/api/auth/login' : '/api/auth/register'
      const payload = isLogin
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password }
      const res = await axios.post(url, payload)

      sessionStorage.setItem('token', res.data.token)
      sessionStorage.setItem('user', JSON.stringify(res.data.user))

      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm mt-10">
      <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">
        {isLogin ? 'Welcome Back' : 'Join the DEV Community'}
      </h1>
      <p className="text-center text-gray-500 mb-6">
        {isLogin ? 'Login to continue' : 'Create your account'}
      </p>

      {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              name="name"
              placeholder="Your name"
              className="w-full border p-2 rounded-md outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              onChange={handleChange}
              value={form.name}
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            name="email"
            placeholder="you@example.com"
            type="email"
            className="w-full border p-2 rounded-md outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            onChange={handleChange}
            value={form.email}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            name="password"
            placeholder="Min 6 characters"
            type="password"
            className="w-full border p-2 rounded-md outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            onChange={handleChange}
            value={form.password}
            required
            minLength={6}
          />
        </div>

        <button
          disabled={loading}
          className="bg-purple-600 text-white py-2 rounded-md font-semibold hover:bg-purple-700 disabled:bg-gray-400 transition"
        >
          {loading ? 'Please wait...' : isLogin ? 'Log in' : 'Create account'}
        </button>
      </form>

      <p
        className="text-center mt-4 text-sm cursor-pointer text-purple-600 hover:underline"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? 'New to DEV? Create account' : 'Already have an account? Log in'}
      </p>
    </div>
  )
}