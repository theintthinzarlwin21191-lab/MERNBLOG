import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  PenLine,
  BookOpen,
  Pencil,
  ArrowUpRight,
  FileText,
  Feather,
  Trash2,
} from 'lucide-react'
import API from '../lib/api'
import useThemeStore from '../stores/themeStore'

function MyStories() {
  const darkMode = useThemeStore((state) => state.darkMode)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    const fetchMyStories = async () => {
      try {
        const token = sessionStorage.getItem('token')

        if (!token) {
          setError('Please login again to view your stories.')
          return
        }

        const payload = JSON.parse(
          atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
        )

        const userId = payload.id

        if (!userId) {
          setError('User ID not found. Please login again.')
          return
        }

        const response = await API.get(`/posts/users/${userId}`)
        setPosts(Array.isArray(response.data) ? response.data : [])
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to load your stories.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchMyStories()
  }, [])

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this story?'
    )

    if (!confirmDelete) return

    try {
      setDeletingId(postId)

      await API.delete(`/posts/${postId}`)

      setPosts((previousPosts) =>
        previousPosts.filter((post) => post._id !== postId)
      )

      alert('Story deleted successfully.')
    } catch (err) {
      alert(
        err.response?.data?.message || 'Failed to delete story.'
      )
    } finally {
      setDeletingId(null)
    }
  }

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
            className={`mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 ${
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
            Loading your stories...
          </p>
        </div>
      </div>
    )
  }

  return (
    <main
      className="relative min-h-screen overflow-hidden px-5 py-10 md:px-8 md:py-14"
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

      <div className="relative mx-auto max-w-6xl">
        {/* Top Banner Box */}
        <section
          className={`relative mb-10 overflow-hidden rounded-4xl border px-6 py-9 transition-all duration-300 md:px-12 md:py-12 ${
            darkMode
              ? 'border-fuchsia-400/25 bg-linear-to-br from-[#281138]/95 via-[#1d102b]/95 to-[#331126]/95 text-white shadow-2xl shadow-black/40'
              : 'border-rose-200/90 bg-linear-to-br from-rose-500 via-pink-500 to-purple-600 text-white shadow-xl shadow-rose-500/20'
          }`}
        >
          <div className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-amber-300/25 blur-2xl" />

          <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-xs">
                <Feather size={13} className="text-amber-200" />
                Your collection
              </div>

              <h1 className="font-serif text-3xl font-bold tracking-tight text-white md:text-5xl">
                My{' '}
                <span
                  className={`italic ${
                    darkMode
                      ? 'bg-linear-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text text-transparent'
                      : 'text-amber-200'
                  }`}
                >
                  Stories
                </span>
              </h1>

              <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/90 md:text-base">
                Every story has a voice. Manage your writing, revisit your
                ideas, and keep sharing what matters.
              </p>
            </div>

            <Link
              to="/write"
              className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs font-bold uppercase tracking-wider transition ${
                darkMode
                  ? 'bg-linear-to-r from-pink-500 to-purple-500 text-white shadow-md hover:brightness-110'
                  : 'bg-white text-rose-600 shadow-md hover:bg-amber-50'
              }`}
            >
              <PenLine size={15} />
              Write New Story
            </Link>
          </div>
        </section>

        {/* Stats Row */}
        <section className="mb-10 grid gap-5 sm:grid-cols-2">
          <div
            className={`flex items-center gap-4 rounded-3xl border p-5 transition-colors duration-300 ${
              darkMode
                ? 'border-fuchsia-400/20 bg-[#1b0f29]/90 text-white shadow-lg shadow-black/25 backdrop-blur-md'
                : 'border-rose-200/85 bg-white/95 text-slate-900 shadow-md shadow-rose-500/10 backdrop-blur-md'
            }`}
          >
            <div
              className={`rounded-2xl p-3.5 ${
                darkMode
                  ? 'bg-pink-500/20 text-pink-300'
                  : 'bg-rose-100 text-rose-600'
              }`}
            >
              <BookOpen size={22} />
            </div>

            <div>
              <p
                className={`text-[11px] font-bold uppercase tracking-wider ${
                  darkMode ? 'text-purple-200/55' : 'text-slate-400'
                }`}
              >
                Published Stories
              </p>
              <p className="mt-0.5 text-2xl font-extrabold">{posts.length}</p>
            </div>
          </div>

          <div
            className={`flex items-center gap-4 rounded-3xl border p-5 transition-colors duration-300 ${
              darkMode
                ? 'border-fuchsia-400/20 bg-[#1b0f29]/90 text-white shadow-lg shadow-black/25 backdrop-blur-md'
                : 'border-rose-200/85 bg-white/95 text-slate-900 shadow-md shadow-rose-500/10 backdrop-blur-md'
            }`}
          >
            <div
              className={`rounded-2xl p-3.5 ${
                darkMode
                  ? 'bg-purple-500/20 text-purple-300'
                  : 'bg-purple-100 text-purple-600'
              }`}
            >
              <FileText size={22} />
            </div>

            <div>
              <p
                className={`text-[11px] font-bold uppercase tracking-wider ${
                  darkMode ? 'text-purple-200/55' : 'text-slate-400'
                }`}
              >
                Your Collection
              </p>
              <p className="mt-0.5 font-serif text-lg font-bold">
                Personal Library
              </p>
            </div>
          </div>
        </section>

        {error && (
          <div className="mb-8 rounded-2xl border border-red-300/60 bg-red-500/10 p-5 text-sm text-red-400">
            {error}
          </div>
        )}

        {!error && posts.length === 0 && (
          <section
            className={`rounded-3xl border px-6 py-16 text-center ${
              darkMode
                ? 'border-fuchsia-400/20 bg-[#1b0f29]/90 text-white shadow-xl shadow-black/30'
                : 'border-rose-200/85 bg-white/95 text-slate-900 shadow-lg shadow-rose-500/10'
            }`}
          >
            <div
              className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${
                darkMode
                  ? 'bg-pink-500/20 text-pink-300'
                  : 'bg-rose-100 text-rose-600'
              }`}
            >
              <BookOpen size={30} />
            </div>

            <h2 className="font-serif text-2xl font-bold">
              Your library is waiting
            </h2>

            <p
              className={`mx-auto mt-3 max-w-md text-sm leading-relaxed ${
                darkMode ? 'text-purple-200/70' : 'text-slate-600'
              }`}
            >
              You haven&apos;t published any stories yet. Start writing and
              make your first idea part of your collection.
            </p>

            <Link
              to="/write"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-rose-500 to-purple-600 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm shadow-rose-500/25 transition hover:brightness-110"
            >
              <PenLine size={15} />
              Write Your First Story
            </Link>
          </section>
        )}

        {!error && posts.length > 0 && (
          <>
            <div
              className={`mb-8 flex items-center justify-between border-b pb-4 ${
                darkMode ? 'border-white/10' : 'border-rose-200/80'
              }`}
            >
              <div>
                <h2
                  className={`font-serif text-2xl font-bold ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  Your Published Work
                </h2>
                <p
                  className={`mt-1 text-sm ${
                    darkMode ? 'text-purple-200/70' : 'text-slate-600'
                  }`}
                >
                  All your stories in one place.
                </p>
              </div>

              <span
                className={`rounded-full px-4 py-1.5 text-xs font-bold ${
                  darkMode
                    ? 'bg-linear-to-r from-pink-500/25 to-purple-500/25 text-pink-200 ring-1 ring-pink-400/30'
                    : 'bg-linear-to-r from-rose-100 to-purple-100 text-rose-700 ring-1 ring-rose-200'
                }`}
              >
                {posts.length} {posts.length === 1 ? 'Story' : 'Stories'}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article
                  key={post._id}
                  className={`group flex flex-col justify-between overflow-hidden rounded-3xl border p-4 transition-all duration-300 hover:-translate-y-1.5 ${
                    darkMode
                      ? 'border-fuchsia-400/20 bg-linear-to-b from-[#201130]/95 to-[#170c24]/95 text-white shadow-xl shadow-black/35 hover:border-pink-400/50'
                      : 'border-rose-200/85 bg-white/95 text-slate-900 shadow-md shadow-rose-500/10 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/15'
                  }`}
                >
                  <div>
                    <Link
                      to={`/posts/${post._id}`}
                      className={`block overflow-hidden rounded-2xl ${
                        darkMode
                          ? 'bg-linear-to-tr from-fuchsia-950 to-rose-950'
                          : 'bg-linear-to-tr from-rose-100 to-purple-100'
                      }`}
                    >
                      {post.thumbnail ? (
                        <img
                          src={`http://localhost:5000/uploads/${post.thumbnail}`}
                          alt={post.title}
                          className="aspect-16/10 w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div
                          className={`flex aspect-16/10 w-full items-center justify-center ${
                            darkMode ? 'text-pink-300/60' : 'text-rose-400'
                          }`}
                        >
                          <BookOpen size={40} strokeWidth={1.4} />
                        </div>
                      )}
                    </Link>

                    <div className="mt-4 px-1">
                      <div className="flex items-center justify-between gap-2 text-[10.5px] font-bold uppercase tracking-[0.14em]">
                        <span
                          className={`rounded-full px-3 py-1 ${
                            darkMode
                              ? 'bg-linear-to-r from-pink-500/25 to-purple-500/25 text-pink-200 ring-1 ring-pink-400/30'
                              : 'bg-linear-to-r from-rose-100 to-purple-100 text-rose-700'
                          }`}
                        >
                          {post.category || 'GENERAL'}
                        </span>
                        <span
                          className={
                            darkMode ? 'text-purple-200/50' : 'text-slate-400'
                          }
                        >
                          {formatDate(post.createdAt)}
                        </span>
                      </div>

                      <Link to={`/posts/${post._id}`}>
                        <h3
                          className={`mt-3 line-clamp-2 font-serif text-xl font-bold leading-snug transition ${
                            darkMode
                              ? 'text-white group-hover:text-pink-300'
                              : 'text-slate-900 group-hover:text-rose-600'
                          }`}
                        >
                          {post.title}
                        </h3>
                      </Link>
                    </div>
                  </div>

                  <div
                    className={`mt-5 grid grid-cols-2 gap-2 border-t pt-4 ${
                      darkMode ? 'border-white/10' : 'border-rose-100'
                    }`}
                  >
                    <Link
                      to={`/posts/${post._id}`}
                      className={`inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                        darkMode
                          ? 'border-white/15 bg-white/5 text-purple-100 hover:border-pink-400/40 hover:text-pink-300'
                          : 'border-rose-200 bg-rose-50/50 text-slate-700 hover:border-rose-300 hover:text-rose-600'
                      }`}
                    >
                      Read
                      <ArrowUpRight size={14} />
                    </Link>

                    <Link
                      to={`/edit-post/${post._id}`}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-linear-to-r from-rose-500 to-purple-600 px-3 py-2 text-xs font-semibold text-white transition hover:brightness-110"
                    >
                      <Pencil size={13} />
                      Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDelete(post._id)}
                      disabled={deletingId === post._id}
                      className="col-span-2 inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-300/60 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                      {deletingId === post._id
                        ? 'Deleting...'
                        : 'Delete Story'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}

export default MyStories