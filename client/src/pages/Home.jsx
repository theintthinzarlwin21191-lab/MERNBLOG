import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, ArrowUpRight, Sparkles, Tag } from 'lucide-react'
import API from '../lib/api'
import useThemeStore from '../stores/themeStore'

const CATEGORIES = [
  'All',
  'Agriculture',
  'Business',
  'Education',
  'Entertainment',
  'Art',
  'Investment',
  'Uncategorized',
  'Weather',
]

function Home() {
  const darkMode = useThemeStore((state) => state.darkMode)
  const [posts, setPosts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        setError('')

        const endpoint =
          selectedCategory === 'All'
            ? '/posts'
            : `/posts/categories/${encodeURIComponent(selectedCategory)}`

        const response = await API.get(endpoint)
        const rawPosts = Array.isArray(response.data)
          ? response.data
          : response.data?.posts || []

        const filteredPosts =
          selectedCategory === 'All'
            ? rawPosts
            : rawPosts.filter(
                (post) =>
                  (post.category || 'Uncategorized').toLowerCase() ===
                  selectedCategory.toLowerCase()
              )

        setPosts(filteredPosts)
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load stories.')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [selectedCategory])

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

  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{
        backgroundImage: darkMode
          ? 'radial-linear(rgba(244, 114, 182, 0.14) 1px, transparent 1px), radial-linear(circle at 15% 10%, rgba(168, 85, 247, 0.22), transparent 40%), radial-linear(circle at 85% 20%, rgba(244, 63, 94, 0.2), transparent 42%), linear-linear(180deg, #0d0814 0%, #140b1d 55%, #0c0912 100%)'
          : 'radial-linear(rgba(219, 39, 119, 0.14) 1px, transparent 1px), radial-linear(circle at 12% 12%, rgba(251, 113, 133, 0.28), transparent 38%), radial-linear(circle at 88% 18%, rgba(167, 139, 250, 0.26), transparent 40%), linear-linear(180deg, #fff1f5 0%, #faf5ff 50%, #fff7ed 100%)',
        backgroundSize: '24px 24px, 100% 100%, 100% 100%, 100% 100%',
      }}
    >
      {/* Decorative Color Orbs */}
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

      {/* Colorful Hero Banner */}
      <section className="relative mx-auto max-w-6xl px-5 pt-9 md:px-8 md:pt-12">
        <div
          className={`relative overflow-hidden rounded-4xl border px-6 py-12 text-center transition-all duration-300 md:px-14 md:py-16 ${
            darkMode
              ? 'border-fuchsia-400/25 bg-linear-to-br from-[#281138]/90 via-[#1d102b]/90 to-[#331126]/90 shadow-2xl shadow-black/40'
              : 'border-rose-200/90 bg-linear-to-br from-rose-500 via-pink-500 to-purple-600 text-white shadow-xl shadow-rose-500/20'
          }`}
        >
          <div className="pointer-events-none -right-12 -top-12 absolute h-52 w-52 rounded-full bg-amber-300/25 blur-2xl" />
          <div className="pointer-events-none -bottom-16 -left-12 absolute h-52 w-52 rounded-full bg-fuchsia-300/25 blur-2xl" />

          <span
            className={`relative inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] ${
              darkMode
                ? 'border border-pink-300/25 bg-white/10 text-pink-200'
                : 'bg-white/20 text-white backdrop-blur-xs'
            }`}
          >
            <Sparkles size={13} className="text-amber-200" />
            Insights That Ignite Growth
          </span>

          <h1
            className={`relative mt-4 font-serif text-4xl font-bold tracking-tight sm:text-6xl ${
              darkMode ? 'text-white' : 'text-white'
            }`}
          >
            Commonplace{' '}
            <span
              className={`italic ${
                darkMode
                  ? 'bg-linear-to-r from-pink-300 via-rose-200 to-amber-200 bg-clip-text text-transparent'
                  : 'text-amber-200'
              }`}
            >
              Journal
            </span>
          </h1>

          <p
            className={`relative mx-auto mt-4 max-w-xl text-sm leading-relaxed md:text-base ${
              darkMode ? 'text-purple-100/80' : 'text-white/90'
            }`}
          >
            Discover ideas, tips, and stories from our community to inspire your
            learning and creative journey.
          </p>
        </div>
      </section>

      {/* Categories & Stories */}
      <section className="relative mx-auto max-w-6xl px-5 py-11 md:px-8 md:py-14">
        {/* Category Bar */}
        <div
          className={`mb-9 rounded-3xl border p-4 transition-colors duration-300 ${
            darkMode
              ? 'border-fuchsia-400/20 bg-[#1b0f29]/85 shadow-lg shadow-black/25 backdrop-blur-md'
              : 'border-rose-200/80 bg-white/85 shadow-md shadow-rose-500/10 backdrop-blur-md'
          }`}
        >
          <div className="mb-2.5 flex items-center gap-1.5 px-1 text-[11px] font-bold uppercase tracking-[0.16em]">
            <Tag
              size={12}
              className={darkMode ? 'text-pink-400' : 'text-rose-500'}
            />
            <span className={darkMode ? 'text-pink-200/75' : 'text-rose-600'}>
              Explore Categories
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((category) => {
              const isActive = selectedCategory === category
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                    isActive
                      ? darkMode
                        ? 'bg-linear-to-r from-pink-500 to-purple-500 text-white shadow-sm shadow-pink-500/30'
                        : 'bg-linear-to-r from-rose-500 to-purple-600 text-white shadow-sm shadow-rose-500/30'
                      : darkMode
                        ? 'border border-white/10 bg-white/5 text-purple-100/80 hover:border-pink-400/40 hover:bg-pink-500/15 hover:text-pink-200'
                        : 'border border-rose-200/80 bg-rose-50/70 text-slate-700 hover:border-rose-300 hover:bg-rose-100/80 hover:text-rose-700'
                  }`}
                >
                  {category}
                </button>
              )
            })}
          </div>
        </div>

        {/* Section Header */}
        <div
          className={`mb-8 flex items-center justify-between border-b pb-4 ${
            darkMode ? 'border-white/10' : 'border-rose-200/80'
          }`}
        >
          <div>
            <p
              className={`text-[10.5px] font-bold uppercase tracking-[0.2em] ${
                darkMode ? 'text-pink-300' : 'text-rose-600'
              }`}
            >
              Curated Feed
            </p>
            <h2
              className={`mt-1 font-serif text-2xl font-bold tracking-tight sm:text-3xl ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              {selectedCategory === 'All'
                ? 'Latest Stories'
                : `${selectedCategory} Stories`}
            </h2>
          </div>

          {!loading && !error && (
            <span
              className={`rounded-full px-4 py-1.5 text-xs font-bold ${
                darkMode
                  ? 'bg-linear-to-r from-pink-500/25 to-purple-500/25 text-pink-200 ring-1 ring-pink-400/30'
                  : 'bg-linear-to-r from-rose-100 to-purple-100 text-rose-700 ring-1 ring-rose-200'
              }`}
            >
              {posts.length} {posts.length === 1 ? 'story' : 'stories'}
            </span>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className={`animate-pulse overflow-hidden rounded-3xl border ${
                  darkMode
                    ? 'border-white/10 bg-[#1b0f29]/80'
                    : 'border-rose-200/80 bg-white/85'
                }`}
              >
                <div
                  className={`aspect-16/10 w-full ${
                    darkMode
                      ? 'bg-linear-to-r from-fuchsia-900/40 to-rose-900/40'
                      : 'bg-linear-to-r from-rose-100 to-purple-100'
                  }`}
                />
                <div className="p-6">
                  <div
                    className={`h-3 w-24 rounded ${
                      darkMode ? 'bg-white/10' : 'bg-rose-100'
                    }`}
                  />
                  <div
                    className={`mt-4 h-5 w-4/5 rounded ${
                      darkMode ? 'bg-white/10' : 'bg-purple-100'
                    }`}
                  />
                  <div
                    className={`mt-2.5 h-4 w-3/5 rounded ${
                      darkMode ? 'bg-white/5' : 'bg-rose-50'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-red-300/60 bg-red-500/10 p-6 text-center text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && posts.length === 0 && (
          <div
            className={`rounded-3xl border px-6 py-16 text-center ${
              darkMode
                ? 'border-fuchsia-400/20 bg-[#1b0f29]/85'
                : 'border-rose-200/80 bg-white/90 shadow-md shadow-rose-500/10'
            }`}
          >
            <div
              className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl ${
                darkMode
                  ? 'bg-pink-500/20 text-pink-300'
                  : 'bg-rose-100 text-rose-600'
              }`}
            >
              <BookOpen size={22} />
            </div>
            <h3
              className={`mt-4 font-serif text-xl font-bold ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              No stories found
            </h3>
            <p
              className={`mt-1.5 text-sm ${
                darkMode ? 'text-purple-200/70' : 'text-slate-600'
              }`}
            >
              There are no published stories in{' '}
              <span className="font-semibold">{selectedCategory}</span> yet.
            </p>
            {selectedCategory !== 'All' && (
              <button
                type="button"
                onClick={() => setSelectedCategory('All')}
                className={`mt-6 rounded-full px-6 py-2.5 text-xs font-semibold text-white transition ${
                  darkMode
                    ? 'bg-linear-to-r from-pink-500 to-purple-500 hover:brightness-110'
                    : 'bg-linear-to-r from-rose-500 to-purple-600 hover:brightness-110'
                }`}
              >
                Show All Stories
              </button>
            )}
          </div>
        )}

        {/* 3-Column Colorful Cards */}
        {!loading && !error && posts.length > 0 && (
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
                        <BookOpen size={36} />
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
                        {post.category || 'Uncategorized'}
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

                    {post.description && (
                      <p
                        className={`mt-2.5 line-clamp-2 text-sm leading-relaxed ${
                          darkMode ? 'text-purple-100/70' : 'text-slate-600'
                        }`}
                      >
                        {post.description}
                      </p>
                    )}
                  </div>
                </div>

                <div
                  className={`flex items-center justify-between border-t px-6 py-4 ${
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
    </main>
  )
}

export default Home