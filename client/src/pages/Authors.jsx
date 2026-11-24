import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  BookOpen,
  ArrowUpRight,
  UserRound,
  Sparkles,
} from 'lucide-react'
import API from '../lib/api'
import useThemeStore from '../stores/themeStore'

function Authors() {
  const darkMode = useThemeStore((state) => state.darkMode)
  const [authors, setAuthors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await API.get('/users')

        const data = response.data

        if (Array.isArray(data)) {
          setAuthors(data)
        } else if (Array.isArray(data.users)) {
          setAuthors(data.users)
        } else if (Array.isArray(data.authors)) {
          setAuthors(data.authors)
        } else {
          setAuthors([])
        }
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to load authors.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchAuthors()
  }, [])

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
            Discovering authors...
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
          className={`relative mb-12 overflow-hidden rounded-4xl border px-6 py-12 text-center transition-all duration-300 md:px-14 md:py-16 ${
            darkMode
              ? 'border-fuchsia-400/25 bg-linear-to-br from-[#281138]/95 via-[#1d102b]/95 to-[#331126]/95 text-white shadow-2xl shadow-black/40'
              : 'border-rose-200/90 bg-linear-to-br from-rose-500 via-pink-500 to-purple-600 text-white shadow-xl shadow-rose-500/20'
          }`}
        >
          <div className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-amber-300/25 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-12 h-52 w-52 rounded-full bg-fuchsia-300/25 blur-2xl" />

          <div className="relative mx-auto mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-xs">
            <Sparkles size={13} className="text-amber-200" />
            <Users size={13} />
            Our Community
          </div>

          <h1 className="relative font-serif text-3xl font-bold tracking-tight text-white md:text-5xl">
            Meet Our{' '}
            <span
              className={`italic ${
                darkMode
                  ? 'bg-linear-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text text-transparent'
                  : 'text-amber-200'
              }`}
            >
              Authors
            </span>
          </h1>

          <p className="relative mx-auto mt-3.5 max-w-xl text-sm leading-relaxed text-white/90 md:text-base">
            Discover creative minds, explore their stories, and connect
            with people who love sharing ideas.
          </p>
        </section>

        {error && (
          <div className="rounded-2xl border border-red-300/60 bg-red-500/10 p-5 text-sm text-red-400">
            {error}
          </div>
        )}

        {!error && (
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
                Our Writers
              </h2>
              <p
                className={`mt-1 text-sm ${
                  darkMode ? 'text-purple-200/70' : 'text-slate-600'
                }`}
              >
                Get to know the people behind the stories.
              </p>
            </div>

            <span
              className={`rounded-full px-4 py-1.5 text-xs font-bold ${
                darkMode
                  ? 'bg-linear-to-r from-pink-500/25 to-purple-500/25 text-pink-200 ring-1 ring-pink-400/30'
                  : 'bg-linear-to-r from-rose-100 to-purple-100 text-rose-700 ring-1 ring-rose-200'
              }`}
            >
              {authors.length} {authors.length === 1 ? 'Author' : 'Authors'}
            </span>
          </div>
        )}

        {!error && authors.length === 0 && (
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
              <Users size={26} />
            </div>

            <h2 className="font-serif text-xl font-bold">No authors found</h2>

            <p
              className={`mt-1.5 text-sm ${
                darkMode ? 'text-purple-200/70' : 'text-slate-600'
              }`}
            >
              There are no authors to display right now.
            </p>
          </div>
        )}

        {!error && authors.length > 0 && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {authors.map((author) => (
              <article
                key={author._id}
                className={`group flex flex-col justify-between rounded-3xl border p-7 text-center transition-all duration-300 hover:-translate-y-1.5 ${
                  darkMode
                    ? 'border-fuchsia-400/20 bg-linear-to-b from-[#201130]/95 to-[#170c24]/95 text-white shadow-xl shadow-black/35 hover:border-pink-400/50'
                    : 'border-rose-200/85 bg-white/95 text-slate-900 shadow-md shadow-rose-500/10 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/15'
                }`}
              >
                <div>
                  <div
                    className={`mx-auto mb-5 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 transition duration-300 ${
                      darkMode
                        ? 'border-pink-500/25 bg-pink-500/10 text-pink-300 group-hover:border-pink-400/50'
                        : 'border-rose-100 bg-linear-to-br from-rose-50 to-purple-50 text-rose-500 group-hover:border-purple-200'
                    }`}
                  >
                    {author.avatar ? (
                      <img
                        src={`http://localhost:5000/uploads/${author.avatar}`}
                        alt={author.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserRound size={42} strokeWidth={1.5} />
                    )}
                  </div>

                  <h3
                    className={`font-serif text-xl font-bold transition ${
                      darkMode
                        ? 'text-white group-hover:text-pink-300'
                        : 'text-slate-900 group-hover:text-rose-600'
                    }`}
                  >
                    {author.name || 'Anonymous Author'}
                  </h3>

                  <p
                    className={`mt-1 truncate text-sm ${
                      darkMode ? 'text-purple-200/65' : 'text-slate-500'
                    }`}
                  >
                    {author.email || 'Blog Community Member'}
                  </p>

                  <div
                    className={`mx-auto mt-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold ${
                      darkMode
                        ? 'bg-pink-500/20 text-pink-200 ring-1 ring-pink-400/30'
                        : 'bg-linear-to-r from-rose-100 to-purple-100 text-rose-700'
                    }`}
                  >
                    <BookOpen size={14} />
                    {Math.max(0, author.posts || 0)} Stories
                  </div>
                </div>

                <Link
                  to={`/authors/${author._id}`}
                  className="mt-7 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-linear-to-r from-rose-500 to-purple-600 px-5 py-2.5 text-xs font-bold tracking-wide text-white shadow-sm shadow-rose-500/25 transition hover:brightness-110"
                >
                  View Profile
                  <ArrowUpRight size={15} />
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default Authors