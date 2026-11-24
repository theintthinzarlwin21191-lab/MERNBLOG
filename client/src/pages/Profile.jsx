import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  UserRound,
  Camera,
  Save,
  LockKeyhole,
  Mail,
  User,
  ArrowLeft,
  Sparkles,
} from 'lucide-react'
import API from '../lib/api'
import useAuthStore from '../stores/authStore'
import useThemeStore from '../stores/themeStore'

function Profile() {
  const navigate = useNavigate()
  const currentUser = useAuthStore((state) => state.currentUser)
  const darkMode = useThemeStore((state) => state.darkMode)

  const [user, setUser] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  let userId = currentUser?.id

  try {
    const token = sessionStorage.getItem('token')

    if (!userId && token) {
      const payload = JSON.parse(
        atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
      )

      userId = payload.id
    }
  } catch (err) {
    console.error('Token error:', err)
  }

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        setError('Please login to view your profile.')
        setLoading(false)
        return
      }

      try {
        const response = await API.get(`/users/${userId}`)
        const profile = response.data

        setUser(profile)
        setName(profile.name || '')
        setEmail(profile.email || '')
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile.')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [userId])

  const handleAvatarChange = async (e) => {
    const selectedFile = e.target.files[0]

    if (!selectedFile) return

    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select an image file.')
      return
    }

    if (selectedFile.size > 500000) {
      setError('Profile picture must be smaller than 500KB.')
      return
    }

    const formData = new FormData()
    formData.append('avatar', selectedFile)

    try {
      setUploading(true)
      setError('')
      setSuccess('')

      const response = await API.post('/users/change-avatar', formData)

      setUser(response.data)
      setSuccess('Profile picture updated successfully!')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload avatar.')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError('Please fill in all password fields.')
      return
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.')
      return
    }

    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match.')
      return
    }

    try {
      setSaving(true)

      const response = await API.patch('/users/edit-user', {
        name,
        email,
        currentPassword,
        newPassword,
        confirmNewPassword,
      })

      setUser((previous) => ({
        ...previous,
        ...response.data,
      }))

      setName(response.data.name)
      setEmail(response.data.email)

      setCurrentPassword('')
      setNewPassword('')
      setConfirmNewPassword('')

      setSuccess('Profile updated successfully!')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  const pageBgStyle = {
    backgroundImage: darkMode
      ? 'radial-linear(rgba(244, 114, 182, 0.14) 1px, transparent 1px), radial-linear(circle at 15% 10%, rgba(168, 85, 247, 0.22), transparent 40%), radial-linear(circle at 85% 20%, rgba(244, 63, 94, 0.2), transparent 42%), linear-linear(180deg, #0d0814 0%, #140b1d 55%, #0c0912 100%)'
      : 'radial-linear(rgba(219, 39, 119, 0.14) 1px, transparent 1px), radial-linear(circle at 12% 12%, rgba(251, 113, 133, 0.28), transparent 38%), radial-linear(circle at 88% 18%, rgba(167, 139, 250, 0.26), transparent 40%), linear-linear(180deg, #fff1f5 0%, #faf5ff 50%, #fff7ed 100%)',
    backgroundSize: '24px 24px, 100% 100%, 100% 100%, 100% 100%',
  }

  const inputStyle = `w-full rounded-xl border py-2.5 pl-11 pr-4 text-sm outline-none transition ${
    darkMode
      ? 'border-fuchsia-400/20 bg-[#140a20] text-white placeholder:text-purple-200/40 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/15'
      : 'border-rose-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-rose-400 focus:ring-2 focus:ring-rose-300/30'
  }`

  const plainInputStyle = `w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition ${
    darkMode
      ? 'border-fuchsia-400/20 bg-[#140a20] text-white placeholder:text-purple-200/40 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/15'
      : 'border-rose-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-rose-400 focus:ring-2 focus:ring-rose-300/30'
  }`

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={pageBgStyle}
      >
        <div className="text-center">
          <div
            className={`mx-auto mb-3 h-9 w-9 animate-spin rounded-full border-4 ${
              darkMode
                ? 'border-fuchsia-500/20 border-t-pink-400'
                : 'border-rose-200 border-t-rose-500'
            }`}
          />
          <p
            className={`text-sm font-medium ${
              darkMode ? 'text-purple-200/70' : 'text-slate-600'
            }`}
          >
            Loading your profile...
          </p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center px-5 text-center"
        style={pageBgStyle}
      >
        <div
          className={`max-w-md rounded-3xl border p-8 ${
            darkMode
              ? 'border-fuchsia-400/20 bg-[#1b0f29]/90 text-white'
              : 'border-rose-200/85 bg-white/95 text-slate-900 shadow-lg shadow-rose-500/10'
          }`}
        >
          <UserRound
            size={42}
            className={`mx-auto mb-4 ${
              darkMode ? 'text-pink-400' : 'text-rose-500'
            }`}
          />

          <h2 className="mb-2 font-serif text-2xl font-bold">
            Profile unavailable
          </h2>

          <p className="mb-6 text-sm text-red-400">{error}</p>

          <button
            onClick={() => navigate('/login')}
            className="rounded-full bg-linear-to-r from-rose-500 to-purple-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm shadow-rose-500/25 transition hover:brightness-110"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <main
      className="relative min-h-screen overflow-hidden px-4 py-10 md:px-6 md:py-14"
      style={pageBgStyle}
    >
      <div
        className={`pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full blur-3xl ${
          darkMode ? 'bg-fuchsia-600/20' : 'bg-rose-400/25'
        }`}
      />
      <div
        className={`pointer-events-none absolute -right-24 top-64 h-80 w-80 rounded-full blur-3xl ${
          darkMode ? 'bg-rose-500/20' : 'bg-violet-400/25'
        }`}
      />

      <div className="relative mx-auto max-w-4xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className={`mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition ${
            darkMode
              ? 'border-fuchsia-400/20 bg-[#1b0f29]/85 text-purple-100 hover:border-pink-400/40 hover:text-pink-300'
              : 'border-rose-200/85 bg-white/90 text-slate-700 shadow-2xs hover:border-rose-300 hover:text-rose-600'
          }`}
        >
          <ArrowLeft size={15} />
          Back
        </button>

        {/* Top Banner Box */}
        <div
          className={`relative overflow-hidden rounded-4px border px-6 py-9 transition-all duration-300 md:px-10 ${
            darkMode
              ? 'border-fuchsia-400/25 bg-linear-to-br from-[#281138]/95 via-[#1d102b]/95 to-[#331126]/95 text-white shadow-2xl shadow-black/40'
              : 'border-rose-200/90 bg-linear-to-br from-rose-500 via-pink-500 to-purple-600 text-white shadow-xl shadow-rose-500/20'
          }`}
        >
          <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-amber-300/20 blur-2xl" />

          <div className="relative inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-xs">
            <Sparkles size={12} className="text-amber-200" />
            Your account
          </div>

          <h1 className="relative mt-3 font-serif text-3xl font-bold tracking-tight text-white md:text-4xl">
            My{' '}
            <span
              className={`italic ${
                darkMode
                  ? 'bg-linear-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text text-transparent'
                  : 'text-amber-200'
              }`}
            >
              Profile
            </span>
          </h1>

          <p className="relative mt-2 text-sm text-white/90">
            Manage your personal information and account settings.
          </p>
        </div>

        <div
          className={`mt-8 rounded-3xl border p-6 transition-colors duration-300 md:p-10 ${
            darkMode
              ? 'border-fuchsia-400/20 bg-[#1b0f29]/90 text-white shadow-xl shadow-black/35 backdrop-blur-md'
              : 'border-rose-200/85 bg-white/95 text-slate-900 shadow-lg shadow-rose-500/10 backdrop-blur-md'
          }`}
        >
          {error && (
            <div className="mb-6 rounded-xl border border-red-300/60 bg-red-500/10 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div
              className={`mb-6 rounded-xl border p-4 text-sm font-medium ${
                darkMode
                  ? 'border-pink-400/30 bg-pink-500/15 text-pink-200'
                  : 'border-rose-200 bg-rose-50 text-rose-700'
              }`}
            >
              {success}
            </div>
          )}

          <section
            className={`mb-10 flex flex-col items-center gap-5 border-b pb-9 sm:flex-row ${
              darkMode ? 'border-white/10' : 'border-rose-100'
            }`}
          >
            <div className="relative">
              <div
                className={`flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 shadow-md ${
                  darkMode
                    ? 'border-pink-400/30 bg-pink-500/15 text-pink-300'
                    : 'border-rose-100 bg-linear-to-br from-rose-50 to-purple-50 text-rose-600'
                }`}
              >
                {user.avatar ? (
                  <img
                    src={`http://localhost:5000/uploads/${user.avatar}`}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound size={48} />
                )}
              </div>

              <label
                className={`absolute bottom-0 right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 bg-linear-to-r from-rose-500 to-purple-600 text-white shadow-sm transition hover:brightness-110 ${
                  darkMode ? 'border-[#1b0f29]' : 'border-white'
                }`}
              >
                <Camera size={17} />

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>

            <div className="text-center sm:text-left">
              <h2 className="font-serif text-2xl font-bold">{user.name}</h2>

              <p
                className={`mt-1 text-sm ${
                  darkMode ? 'text-purple-200/70' : 'text-slate-500'
                }`}
              >
                {user.email}
              </p>

              <p
                className={`mt-3 text-xs ${
                  darkMode ? 'text-purple-200/75' : 'text-slate-600'
                }`}
              >
                {uploading
                  ? 'Uploading picture...'
                  : 'Click the camera icon to change your photo.'}
              </p>

              <p
                className={`mt-1 text-xs ${
                  darkMode ? 'text-purple-200/50' : 'text-slate-400'
                }`}
              >
                Maximum image size: 500KB
              </p>
            </div>
          </section>

          <form onSubmit={handleSubmit} className="space-y-7">
            <div>
              <h2 className="mb-5 font-serif text-2xl font-bold">
                Personal Information
              </h2>

              <div className="space-y-5">
                <div>
                  <label
                    className={`mb-2 block text-sm font-semibold ${
                      darkMode ? 'text-purple-100' : 'text-slate-800'
                    }`}
                  >
                    Full Name
                  </label>

                  <div className="relative">
                    <User
                      size={18}
                      className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                        darkMode ? 'text-pink-300/70' : 'text-slate-400'
                      }`}
                    />

                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      required
                      className={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className={`mb-2 block text-sm font-semibold ${
                      darkMode ? 'text-purple-100' : 'text-slate-800'
                    }`}
                  >
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                        darkMode ? 'text-pink-300/70' : 'text-slate-400'
                      }`}
                    />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email"
                      required
                      className={inputStyle}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`border-t pt-7 ${
                darkMode ? 'border-white/10' : 'border-rose-100'
              }`}
            >
              <h2 className="font-serif text-2xl font-bold">Change Password</h2>

              <p
                className={`mb-5 mt-1.5 text-sm ${
                  darkMode ? 'text-purple-200/70' : 'text-slate-500'
                }`}
              >
                Enter your current password and choose a new password.
              </p>

              <div className="space-y-5">
                <div>
                  <label
                    className={`mb-2 block text-sm font-semibold ${
                      darkMode ? 'text-purple-100' : 'text-slate-800'
                    }`}
                  >
                    Current Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                        darkMode ? 'text-pink-300/70' : 'text-slate-400'
                      }`}
                    />

                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      required
                      className={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className={`mb-2 block text-sm font-semibold ${
                      darkMode ? 'text-purple-100' : 'text-slate-800'
                    }`}
                  >
                    New Password
                  </label>

                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    minLength={6}
                    className={plainInputStyle}
                  />
                </div>

                <div>
                  <label
                    className={`mb-2 block text-sm font-semibold ${
                      darkMode ? 'text-purple-100' : 'text-slate-800'
                    }`}
                  >
                    Confirm New Password
                  </label>

                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    minLength={6}
                    className={plainInputStyle}
                  />
                </div>
              </div>
            </div>

            <div
              className={`border-t pt-6 ${
                darkMode ? 'border-white/10' : 'border-rose-100'
              }`}
            >
              <button
                type="submit"
                disabled={saving}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-rose-500 to-purple-600 px-7 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm shadow-rose-500/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                <Save size={16} />
                {saving ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}

export default Profile