import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  UserRound,
  BookOpen,
  CalendarDays,
  ArrowLeft,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react'
import API from '../lib/api'
import useThemeStore from '../stores/themeStore'

function AuthorProfile() {
  const { id } = useParams()
  const darkMode = useThemeStore((state) => state.darkMode)

  const [author, setAuthor] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAuthorProfile = async () => {
      try {
        setLoading(true)
        setError('')

        const [authorResponse, postsResponse] = await Promise.all([
          API.get(`/users/${id}`),
          API.get(`/posts/users/${id}`),
        ])

        setAuthor(authorResponse.data)

        const postData = postsResponse.data
        setPosts(Array.isArray(postData) ? postData : postData.posts || [])
      } catch (err) {
        console.error('Author profile error:', err)
        setError(
          err.response?.data?.message || 'Unable to load author profile.'
        )
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchAuthorProfile()
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
            Loading author profile...
          </p>
        </div>
      </div>
    )
  }

  if (error || !author) {
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
          <h2 className="font-serif text-2xl font-bold">Author not found</h2>
          <p className="mt-2.5 text-sm text-red-400">
            {error || 'This author does not exist.'}
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-rose-500 to-purple-600 px-6 py-2.5 text-xs font-semibold text-white shadow-sm shadow-rose-500/25 transition hover:brightness-110"
          >
            <ArrowLeft size={15} />
            Back to Home
          </Link>
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
        <Link
          to="/"
          className={`mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition ${
            darkMode
              ? 'border-fuchsia-400/20 bg-[#1b0f29]/85 text-purple-100 hover:border-pink-400/40 hover:text-pink-300'
              : 'border-rose-200/85 bg-white/90 text-slate-700 shadow-2xs hover:border-rose-300 hover:text-rose-600'
          }`}
        >
          <ArrowLeft size={15} />
          Back to Home
        </Link>

        {/* Author Header Banner */}
        <section
          className={`relative overflow-hidden rounded-4xl border px-6 py-8 transition-all duration-300 md:px-10 md:py-10 ${
            darkMode
              ? 'border-fuchsia-400/25 bg-linear-to-br from-[#281138]/95 via-[#1d102b]/95 to-[#331126]/95 text-white shadow-2xl shadow-black/40'
              : 'border-rose-200/90 bg-linear-to-br from-rose-500 via-pink-500 to-purple-600 text-white shadow-xl shadow-rose-500/20'
          }`}
        >
          <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-amber-300/20 blur-2xl" />

          <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white/80 bg-white/15 text-white shadow-md backdrop-blur-xs">
              {author.avatar ? (
                <img
                  src={`http://localhost:5000/uploads/${author.avatar}`}
                  alt={author.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserRound size={42} />
              )}
            </div>

            <div className="text-center sm:text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-xs">
                <Sparkles size={12} className="text-amber-200" />
                Storyteller
              </span>

              <h1 className="mt-2.5 font-serif text-3xl font-bold tracking-tight text-white md:text-5xl">
                {author.name}
              </h1>

              <p className="mt-1 text-sm text-white/85">{author.email}</p>
            </div>
          </div>

          <div className="relative mt-8 flex flex-wrap gap-4 border-t border-white/20 pt-6">
            <div className="flex items-center gap-3.5 rounded-2xl border border-white/20 bg-white/15 px-5 py-3.5 backdrop-blur-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-amber-200">
                <BookOpen size={20} />
              </div>
              <div>
                <p className="text-lg font-bold text-white">{posts.length}</p>
                <p className="text-xs text-white/80">Published Stories</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 rounded-2xl border border-white/20 bg-white/15 px-5 py-3.5 backdrop-blur-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-amber-200">
                <CalendarDays size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Author</p>
                <p className="text-xs text-white/80">Blog Contributor</p>
              </div>
            </div>
          </div>
        </section>

        {/* Author Stories */}
        <section className="mt-14">
          <div
            className={`mb-8 border-b pb-5 ${
              darkMode ? 'border-white/10' : 'border-rose-200/80'
            }`}
          >
            <p
              className={`text-[10.5px] font-bold uppercase tracking-[0.2em] ${
                darkMode ? 'text-pink-300' : 'text-rose-600'
              }`}
            >
              Explore the collection
            </p>

            <h2
              className={`mt-1 font-serif text-2xl font-bold tracking-tight md:text-3xl ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              Stories by {author.name}
            </h2>

            <p
              className={`mt-1.5 text-sm ${
                darkMode ? 'text-purple-200/70' : 'text-slate-600'
              }`}
            >
              Discover all the stories published by this author.
            </p>
          </div>

          {posts.length === 0 ? (
            <div
              className={`rounded-3xl border px-6 py-16 text-center ${
                darkMode
                  ? 'border-fuchsia-400/20 bg-[#1b0f29]/85 text-white'
                  : 'border-rose-200/80 bg-white/90 text-slate-900 shadow-md shadow-rose-500/10'
              }`}
            >
              <div
                className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${
                  darkMode
                    ? 'bg-pink-500/20 text-pink-300'
                    : 'bg-rose-100 text-rose-600'
                }`}
              >
                <BookOpen size={26} />
              </div>

              <h3 className="font-serif text-xl font-bold">No stories yet</h3>

              <p
                className={`mt-1.5 text-sm ${
                  darkMode ? 'text-purple-200/70' : 'text-slate-600'
                }`}
              >
                This author hasn&apos;t published any stories.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article
                  key={post._id}
                  className={`group flex flex-col justify-between overflow-hidden rounded-3xl border transition-all duration-300 hover:-translate-y-1.5 ${
                    darkMode
                      ? 'border-fuchsia-400/20 bg-linear-to-b from-[#201130]/95 to-[#170c24]/95 shadow-xl shadow-black/35 hover:border-pink-400/50'
                      : 'border-rose-200/85 bg-white/95 shadow-md shadow-rose-500/10 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/15'
                  }`}
                >
                  <div>
                    <Link
                      to={`/posts/${post._id}`}
                      className={`block overflow-hidden ${
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
                          <BookOpen size={38} />
                        </div>
                      )}
                    </Link>

                    <div className="p-6">
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
                          className={`mt-3.5 line-clamp-2 font-serif text-xl font-bold leading-snug transition ${
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
                    className={`border-t px-6 py-4 ${
                      darkMode
                        ? 'border-white/10 bg-linear-to-r from-pink-500/10 to-purple-500/10'
                        : 'border-rose-100 bg-linear-to-r from-rose-50/80 to-purple-50/80'
                    }`}
                  >
                    <Link
                      to={`/posts/${post._id}`}
                      className={`inline-flex items-center gap-1.5 text-xs font-bold tracking-wide transition ${
                        darkMode
                          ? 'text-pink-300 hover:text-amber-200'
                          : 'text-rose-600 hover:text-purple-700'
                      }`}
                    >
                      Read story
                      <ArrowUpRight
                        size={14}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default AuthorProfile