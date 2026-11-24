import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Pencil, Trash2, ArrowLeft, BookOpen } from 'lucide-react'
import API from '../lib/api'
import useAuthStore from '../stores/authStore'
import useThemeStore from '../stores/themeStore'

function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const currentUser = useAuthStore((state) => state.currentUser)
  const darkMode = useThemeStore((state) => state.darkMode)

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        const response = await API.get(`/posts/${id}`)
        setPost(response.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load story.')
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id])

  const formatDate = (dateValue) => {
    if (!dateValue) return 'RECENT POST'
    const parsed = new Date(dateValue)
    if (Number.isNaN(parsed.getTime())) return 'RECENT POST'
    return parsed
      .toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
      .toUpperCase()
  }

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this story?'
    )

    if (!confirmDelete) return

    try {
      setDeleting(true)
      await API.delete(`/posts/${id}`)
      alert('Story deleted successfully.')
      navigate('/my-stories')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete story.')
      setDeleting(false)
    }
  }

  const pageBgStyle = {
    backgroundImage: darkMode
      ? 'radial-linear(rgba(244, 114, 182, 0.14) 1px, transparent 1px), radial-linear(circle at 15% 10%, rgba(168, 85, 247, 0.22), transparent 40%), radial-linear(circle at 85% 20%, rgba(244, 63, 94, 0.2), transparent 42%), linear-linear(180deg, #0d0814 0%, #140b1d 55%, #0c0912 100%)'
      : 'radial-linear(rgba(219, 39, 119, 0.14) 1px, transparent 1px), radial-linear(circle at 12% 12%, rgba(251, 113, 133, 0.28), transparent 38%), radial-linear(circle at 88% 18%, rgba(167, 139, 250, 0.26), transparent 40%), linear-linear(180deg, #fff1f5 0%, #faf5ff 50%, #fff7ed 100%)',
    backgroundSize: '24px 24px, 100% 100%, 100% 100%, 100% 100%',
  }

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
            Loading story...
          </p>
        </div>
      </div>
    )
  }

  if (error || !post) {
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
          <BookOpen
            size={40}
            className={`mx-auto mb-4 ${
              darkMode ? 'text-pink-400' : 'text-rose-500'
            }`}
          />

          <h2 className="mb-2 font-serif text-2xl font-bold">
            Story not found
          </h2>

          <p
            className={`mb-6 text-sm ${
              darkMode ? 'text-purple-200/70' : 'text-slate-600'
            }`}
          >
            {error || 'This story may have been removed.'}
          </p>

          <Link
            to="/"
            className="inline-flex rounded-full bg-linear-to-r from-rose-500 to-purple-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm shadow-rose-500/25 transition hover:brightness-110"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const authorId = post.creator || post.creatorId || post.userId
  const authorObj =
    typeof post.creator === 'object' && post.creator !== null
      ? post.creator
      : typeof post.author === 'object' && post.author !== null
        ? post.author
        : null

  let tokenUserId = null

  try {
    const token = sessionStorage.getItem('token')

    if (token) {
      const payload = JSON.parse(
        atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
      )
      tokenUserId = payload.id || payload._id || payload.userId
    }
  } catch (err) {
    console.error('Failed to read user token:', err)
  }

  const loggedInUserId = currentUser?.id || tokenUserId
  const isOwner =
    Boolean(loggedInUserId && authorId) &&
    String(authorId._id || authorId) === String(loggedInUserId)

  const authorName =
    authorObj?.name ||
    (typeof post.creator === 'string' ? post.creator : null) ||
    (typeof post.author === 'string' ? post.author : null) ||
    'Unknown Author'

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

      <article className="relative mx-auto max-w-4xl">
        <Link
          to="/"
          className={`mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition ${
            darkMode
              ? 'border-fuchsia-400/20 bg-[#1b0f29]/85 text-purple-100 hover:border-pink-400/40 hover:text-pink-300'
              : 'border-rose-200/85 bg-white/90 text-slate-700 shadow-2xs hover:border-rose-300 hover:text-rose-600'
          }`}
        >
          <ArrowLeft size={15} />
          Back to stories
        </Link>

        <div
          className={`overflow-hidden rounded-4xl border transition-all duration-300 ${
            darkMode
              ? 'border-fuchsia-400/20 bg-[#1b0f29]/90 text-white shadow-2xl shadow-black/40 backdrop-blur-md'
              : 'border-rose-200/85 bg-white/95 text-slate-900 shadow-xl shadow-rose-500/10 backdrop-blur-md'
          }`}
        >
          {/* Banner Header Box */}
          <div
            className={`relative overflow-hidden border-b px-6 py-8 md:px-10 md:py-10 ${
              darkMode
                ? 'border-fuchsia-400/20 bg-linear-to-br from-[#281138] via-[#1d102b] to-[#331126] text-white'
                : 'border-rose-200/90 bg-linear-to-br from-rose-500 via-pink-500 to-purple-600 text-white'
            }`}
          >
            <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-amber-300/20 blur-2xl" />

            <div className="relative mb-4 flex flex-wrap items-center gap-3 text-[11px] font-bold uppercase tracking-wider">
              <span className="rounded-full bg-white/20 px-3.5 py-1 text-white backdrop-blur-xs">
                {post.category || 'GENERAL'}
              </span>
              <span className="text-white/80">
                {formatDate(post.createdAt)}
              </span>
            </div>

            <h1 className="relative font-serif text-3xl font-bold leading-tight tracking-tight text-white md:text-5xl">
              {post.title}
            </h1>

            <div className="relative mt-6 flex items-center gap-3 border-t border-white/20 pt-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-amber-200 backdrop-blur-xs">
                {authorName.charAt(0).toUpperCase()}
              </div>

              <div>
                <p className="text-[10.5px] font-semibold uppercase tracking-wider text-white/75">
                  Written by
                </p>
                <p className="text-sm font-bold text-white">{authorName}</p>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          {post.thumbnail && (
            <div className="px-6 pt-8 md:px-10">
              <div
                className={`overflow-hidden rounded-2xl border ${
                  darkMode
                    ? 'border-fuchsia-400/15 bg-[#140a20]'
                    : 'border-rose-200/80 bg-rose-50'
                }`}
              >
                <img
                  src={`http://localhost:5000/uploads/${post.thumbnail}`}
                  alt={post.title}
                  className="max-h w-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Story Body */}
          <div className="px-6 py-8 md:px-10 md:py-10">
            <div
              className={`whitespace-pre-line text-base leading-8 md:text-lg md:leading-9 ${
                darkMode ? 'text-purple-100/90' : 'text-slate-700'
              }`}
            >
              {post.description}
            </div>

            {/* Owner Actions */}
            {isOwner && (
              <div
                className={`mt-10 flex flex-wrap gap-3 border-t pt-7 ${
                  darkMode ? 'border-white/10' : 'border-rose-100'
                }`}
              >
                <Link
                  to={`/edit-post/${id}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-rose-500 to-purple-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm shadow-rose-500/25 transition hover:brightness-110"
                >
                  <Pencil size={14} />
                  Edit Story
                </Link>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-300/60 bg-red-500/10 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
                >
                  <Trash2 size={14} />
                  {deleting ? 'Deleting...' : 'Delete Story'}
                </button>
              </div>
            )}
          </div>
        </div>
      </article>

      <div
        className={`relative mx-auto mt-10 max-w-4xl border-t pt-6 text-center ${
          darkMode ? 'border-white/10' : 'border-rose-200/70'
        }`}
      >
        <Link
          to="/"
          className={`text-sm font-semibold transition ${
            darkMode
              ? 'text-pink-300 hover:text-amber-200'
              : 'text-rose-600 hover:text-purple-700'
          }`}
        >
          Explore more stories →
        </Link>
      </div>
    </main>
  )
}

export default PostDetail