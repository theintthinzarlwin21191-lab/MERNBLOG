import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BookOpen, Sparkles } from 'lucide-react'
import API from '../lib/api'
import useThemeStore from '../stores/themeStore'

function Register() {
  const navigate = useNavigate()
  const darkMode = useThemeStore((state) => state.darkMode)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.password2) {
      setError('Passwords do not match.')
      return
    }

    try {
      setLoading(true)
      await API.post('/users/register', formData)
      alert('Registration successful! Please login.')
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  const pageBgStyle = {
    backgroundImage: darkMode
      ? 'radial-linear(rgba(244, 114, 182, 0.14) 1px, transparent 1px), radial-linear(circle at 15% 10%, rgba(168, 85, 247, 0.22), transparent 40%), radial-linear(circle at 85% 20%, rgba(244, 63, 94, 0.2), transparent 42%), linear-linear(180deg, #0d0814 0%, #140b1d 55%, #0c0912 100%)'
      : 'radial-linear(rgba(219, 39, 119, 0.14) 1px, transparent 1px), radial-linear(circle at 12% 12%, rgba(251, 113, 133, 0.28), transparent 38%), radial-linear(circle at 88% 18%, rgba(167, 139, 250, 0.26), transparent 40%), linear-linear(180deg, #fff1f5 0%, #faf5ff 50%, #fff7ed 100%)',
    backgroundSize: '24px 24px, 100% 100%, 100% 100%, 100% 100%',
  }

  const inputStyle = `w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition ${
    darkMode
      ? 'border-fuchsia-400/20 bg-[#140a20] text-white placeholder:text-purple-200/40 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/15'
      : 'border-rose-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-rose-400 focus:ring-2 focus:ring-rose-300/30'
  }`

  const labelStyle = `mb-2 block text-sm font-semibold ${
    darkMode ? 'text-purple-100' : 'text-slate-800'
  }`

  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12"
      style={pageBgStyle}
    >
      <div
        className={`pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full blur-3xl ${
          darkMode ? 'bg-fuchsia-600/20' : 'bg-rose-400/25'
        }`}
      />
      <div
        className={`pointer-events-none absolute -right-24 bottom-20 h-80 w-80 rounded-full blur-3xl ${
          darkMode ? 'bg-rose-500/20' : 'bg-violet-400/25'
        }`}
      />

      <form
        onSubmit={handleSubmit}
        className={`relative w-full max-w-md rounded-4xl border p-8 transition-all duration-300 ${
          darkMode
            ? 'border-fuchsia-400/20 bg-[#1b0f29]/90 text-white shadow-2xl shadow-black/40 backdrop-blur-md'
            : 'border-rose-200/85 bg-white/95 text-slate-900 shadow-xl shadow-rose-500/10 backdrop-blur-md'
        }`}
      >
        <div
          className={`relative mb-8 overflow-hidden rounded-2xl border px-6 py-7 text-center ${
            darkMode
              ? 'border-fuchsia-400/25 bg-linear-to-br from-[#281138] via-[#1d102b] to-[#331126] text-white'
              : 'border-rose-200/90 bg-linear-to-br from-rose-500 via-pink-500 to-purple-600 text-white shadow-md shadow-rose-500/15'
          }`}
        >
          <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-amber-300/20 blur-xl" />

          <div className="relative mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-xs">
            <BookOpen size={21} />
          </div>

          <div className="relative mb-2 flex justify-center">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
              <Sparkles size={11} className="text-amber-200" />
              Commonplace
            </span>
          </div>

          <h1 className="relative font-serif text-3xl font-bold tracking-tight text-white">
            Create{' '}
            <span
              className={`italic ${
                darkMode
                  ? 'bg-linear-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text text-transparent'
                  : 'text-amber-200'
              }`}
            >
              Account
            </span>
          </h1>
          <p className="relative mt-2 text-sm text-white/90">
            Join our blogging community
          </p>
        </div>

        {error && (
          <p className="mb-5 rounded-xl border border-red-300/60 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        <div className="mb-4">
          <label className={labelStyle}>Name</label>
          <input
            className={inputStyle}
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="mb-4">
          <label className={labelStyle}>Email</label>
          <input
            className={inputStyle}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="mb-4">
          <label className={labelStyle}>Password</label>
          <input
            className={inputStyle}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            required
          />
        </div>

        <div className="mb-6">
          <label className={labelStyle}>Confirm Password</label>
          <input
            className={inputStyle}
            type="password"
            name="password2"
            value={formData.password2}
            onChange={handleChange}
            placeholder="Confirm your password"
            required
          />
        </div>

        <button
          className="w-full rounded-xl bg-linear-to-r from-rose-500 to-purple-600 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm shadow-rose-500/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>

        <p
          className={`mt-6 text-center text-sm ${
            darkMode ? 'text-purple-200/70' : 'text-slate-600'
          }`}
        >
          Already have an account?{' '}
          <Link
            to="/login"
            className={`font-bold transition ${
              darkMode
                ? 'text-pink-300 hover:text-amber-200'
                : 'text-rose-600 hover:text-purple-700'
            }`}
          >
            Login
          </Link>
        </p>
      </form>
    </main>
  )
}

export default Register