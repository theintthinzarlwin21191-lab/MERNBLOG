import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Pencil,
  ImagePlus,
  ArrowLeft,
  Save,
  X,
  Image as ImageIcon,
} from 'lucide-react'
import API from '../lib/api'
import useThemeStore from '../stores/themeStore'

const CATEGORIES = [
  'Agriculture',
  'Business',
  'Education',
  'Entertainment',
  'Art',
  'Investment',
  'Uncategorized',
  'Weather',
]

function EditPost() {
  const { id } = useParams()
  const navigate = useNavigate()
  const darkMode = useThemeStore((state) => state.darkMode)

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Uncategorized')
  const [description, setDescription] = useState('')
  const [thumbnail, setThumbnail] = useState(null)
  const [currentThumbnail, setCurrentThumbnail] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const preview = useMemo(() => {
    if (!thumbnail) return null
    return URL.createObjectURL(thumbnail)
  }, [thumbnail])

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await API.get(`/posts/${id}`)
        const post = response.data

        setTitle(post.title || '')
        setCategory(post.category || 'Uncategorized')
        setDescription(post.description || '')
        setCurrentThumbnail(post.thumbnail || '')
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to load story.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id])

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.')
      e.target.value = ''
      return
    }

    setError('')
    setThumbnail(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const formData = new FormData()
    formData.append('title', title)
    formData.append('category', category)
    formData.append('description', description)

    if (thumbnail) {
      formData.append('thumbnail', thumbnail)
    }

    try {
      setSaving(true)

      await API.patch(`/posts/${id}`, formData)

      alert('Story updated successfully!')
      navigate('/my-stories')
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to update story.'
      )
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

  const inputStyle = `w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition ${
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
            Loading your story...
          </p>
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

      <div className="relative mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() => navigate('/my-stories')}
          className={`mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition ${
            darkMode
              ? 'border-fuchsia-400/20 bg-[#1b0f29]/85 text-purple-100 hover:border-pink-400/40 hover:text-pink-300'
              : 'border-rose-200/85 bg-white/90 text-slate-700 shadow-2xs hover:border-rose-300 hover:text-rose-600'
          }`}
        >
          <ArrowLeft size={15} />
          Back to My Stories
        </button>

        {/* Top Banner Box */}
        <div
          className={`relative overflow-hidden rounded-4xl border px-6 py-8 text-center transition-all duration-300 md:px-10 ${
            darkMode
              ? 'border-fuchsia-400/25 bg-linear-to-br from-[#281138]/95 via-[#1d102b]/95 to-[#331126]/95 text-white shadow-2xl shadow-black/40'
              : 'border-rose-200/90 bg-linear-to-br from-rose-500 via-pink-500 to-purple-600 text-white shadow-xl shadow-rose-500/20'
          }`}
        >
          <div className="relative mx-auto mb-3 inline-flex rounded-2xl bg-white/20 p-3 text-amber-200 backdrop-blur-xs">
            <Pencil size={24} />
          </div>

          <h1 className="relative font-serif text-3xl font-bold tracking-tight text-white md:text-4xl">
            Edit{' '}
            <span
              className={`italic ${
                darkMode
                  ? 'bg-linear-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text text-transparent'
                  : 'text-amber-200'
              }`}
            >
              Story
            </span>
          </h1>

          <p className="relative mt-2 text-sm text-white/90">
            Make changes to your story and share your updated version.
          </p>
        </div>

        <div
          className={`mt-8 rounded-3xl border p-6 transition-colors duration-300 md:p-8 ${
            darkMode
              ? 'border-fuchsia-400/20 bg-[#1b0f29]/90 text-white shadow-xl shadow-black/35 backdrop-blur-md'
              : 'border-rose-200/85 bg-white/95 text-slate-900 shadow-lg shadow-rose-500/10 backdrop-blur-md'
          }`}
        >
          {error && (
            <div className="mb-6 rounded-xl border border-red-300/60 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label
                className={`mb-2 block text-sm font-semibold ${
                  darkMode ? 'text-purple-100' : 'text-slate-800'
                }`}
              >
                Story Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your story title"
                className={inputStyle}
                required
              />
            </div>

            {/* Category */}
            <div>
              <label
                className={`mb-2 block text-sm font-semibold ${
                  darkMode ? 'text-purple-100' : 'text-slate-800'
                }`}
              >
                Category
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputStyle}
              >
                {CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  className={`text-sm font-semibold ${
                    darkMode ? 'text-purple-100' : 'text-slate-800'
                  }`}
                >
                  Story Description
                </label>

                <span
                  className={`text-xs ${
                    darkMode ? 'text-purple-200/50' : 'text-slate-400'
                  }`}
                >
                  {description.length} characters
                </span>
              </div>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write your story here..."
                className={`${inputStyle} min-h-64 resize-y p-4 leading-relaxed`}
                required
              />
            </div>

            {/* Thumbnail */}
            <div>
              <label
                className={`mb-2 block text-sm font-semibold ${
                  darkMode ? 'text-purple-100' : 'text-slate-800'
                }`}
              >
                Story Thumbnail
              </label>

              <div
                className={`overflow-hidden rounded-2xl border p-4 ${
                  darkMode
                    ? 'border-fuchsia-400/15 bg-[#140a20]'
                    : 'border-rose-200/80 bg-rose-50/40'
                }`}
              >
                <div
                  className={`mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${
                    darkMode ? 'text-pink-300' : 'text-rose-600'
                  }`}
                >
                  <ImageIcon size={16} />
                  {thumbnail ? 'New Image Preview' : 'Current Story Image'}
                </div>

                {preview || currentThumbnail ? (
                  <img
                    src={
                      preview ||
                      `http://localhost:5000/uploads/${currentThumbnail}`
                    }
                    alt="Story thumbnail preview"
                    className="h-64 w-full rounded-xl object-cover"
                  />
                ) : (
                  <div
                    className={`flex h-52 flex-col items-center justify-center rounded-xl ${
                      darkMode
                        ? 'bg-white/5 text-purple-200/40'
                        : 'bg-rose-100/60 text-rose-300'
                    }`}
                  >
                    <ImageIcon size={36} />
                    <p className="mt-2 text-sm">No thumbnail available</p>
                  </div>
                )}

                {thumbnail && (
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p
                      className={`truncate text-xs ${
                        darkMode ? 'text-purple-200/75' : 'text-slate-600'
                      }`}
                    >
                      {thumbnail.name}
                    </p>

                    <button
                      type="button"
                      onClick={() => setThumbnail(null)}
                      className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-red-300/60 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 transition hover:bg-red-500/20"
                    >
                      <X size={14} />
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <label
                className={`mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 py-7 text-center transition ${
                  darkMode
                    ? 'border-fuchsia-400/25 bg-white/5 hover:border-pink-400 hover:bg-pink-500/10'
                    : 'border-rose-200 bg-rose-50/50 hover:border-rose-400 hover:bg-rose-100/60'
                }`}
              >
                <div
                  className={`mb-2 rounded-full p-2.5 shadow-2xs ${
                    darkMode
                      ? 'bg-pink-500/20 text-pink-300'
                      : 'bg-white text-rose-600'
                  }`}
                >
                  <ImagePlus size={22} />
                </div>

                <span
                  className={`text-sm font-semibold ${
                    darkMode ? 'text-white' : 'text-slate-800'
                  }`}
                >
                  Choose a new thumbnail
                </span>

                <span
                  className={`mt-1 text-xs ${
                    darkMode ? 'text-purple-200/65' : 'text-slate-500'
                  }`}
                >
                  Select an image from your computer
                </span>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              <p
                className={`mt-2 text-xs ${
                  darkMode ? 'text-purple-200/50' : 'text-slate-400'
                }`}
              >
                Leave unchanged to keep your current image.
              </p>
            </div>

            {/* Buttons */}
            <div
              className={`flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end ${
                darkMode ? 'border-white/10' : 'border-rose-100'
              }`}
            >
              <button
                type="button"
                onClick={() => navigate('/my-stories')}
                className={`rounded-xl border px-6 py-2.5 text-xs font-bold tracking-wide transition ${
                  darkMode
                    ? 'border-white/15 bg-white/5 text-purple-100 hover:bg-white/10'
                    : 'border-rose-200 bg-white text-slate-700 hover:bg-rose-50'
                }`}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-rose-500 to-purple-600 px-7 py-2.5 text-xs font-bold tracking-wide text-white shadow-sm shadow-rose-500/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save size={15} />
                {saving ? 'Updating...' : 'Update Story'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}

export default EditPost