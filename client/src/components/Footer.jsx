import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import useThemeStore from '../stores/themeStore'

function Footer() {
  const darkMode = useThemeStore((state) => state.darkMode)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setSubscribed(true)
    setEmail('')
  }

  return (
    <footer
      className={`border-t transition-colors duration-300 ${
        darkMode
          ? 'border-fuchsia-400/20 bg-linear-to-b from-[#140a20] to-[#0b0512] text-purple-100'
          : 'border-rose-200/80 bg-linear-to-b from-white to-rose-50/60 text-slate-700'
      }`}
    >
      <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Brand & Socials */}
          <div className="md:col-span-3">
            <Link to="/" className="group inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-rose-500 via-pink-500 to-purple-600 text-white shadow-sm shadow-rose-500/20">
                <BookOpen size={17} />
              </div>
              <span
                className={`font-serif text-xl font-bold tracking-tight ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}
              >
                Commonplace
                <span className={darkMode ? 'text-pink-400' : 'text-rose-500'}>
                  .
                </span>
              </span>
            </Link>

            <p
              className={`mt-3.5 text-xs leading-relaxed ${
                darkMode ? 'text-purple-200/65' : 'text-slate-500'
              }`}
            >
              Thoughtful stories, everyday perspectives, and ideas from our
              community.
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs font-bold">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className={`flex h-8 w-8 items-center justify-center rounded-full border transition ${
                  darkMode
                    ? 'border-white/15 bg-white/5 text-purple-100 hover:border-pink-400 hover:text-pink-300'
                    : 'border-rose-200 bg-white text-rose-600 hover:border-rose-300 hover:bg-rose-50'
                }`}
              >
                X
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className={`flex h-8 w-8 items-center justify-center rounded-full border transition ${
                  darkMode
                    ? 'border-white/15 bg-white/5 text-purple-100 hover:border-pink-400 hover:text-pink-300'
                    : 'border-rose-200 bg-white text-rose-600 hover:border-rose-300 hover:bg-rose-50'
                }`}
              >
                in
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className={`flex h-8 w-8 items-center justify-center rounded-full border transition ${
                  darkMode
                    ? 'border-white/15 bg-white/5 text-purple-100 hover:border-pink-400 hover:text-pink-300'
                    : 'border-rose-200 bg-white text-rose-600 hover:border-rose-300 hover:bg-rose-50'
                }`}
              >
                IG
              </a>
            </div>
          </div>

          {/* Company */}
          <div className="md:col-span-2">
            <h3
              className={`text-[10.5px] font-bold uppercase tracking-[0.18em] ${
                darkMode ? 'text-pink-200' : 'text-slate-900'
              }`}
            >
              Company
            </h3>
            <div
              className={`mt-3.5 flex flex-col gap-2.5 text-xs ${
                darkMode ? 'text-purple-200/70' : 'text-slate-500'
              }`}
            >
              <Link
                to="/"
                className={`transition ${
                  darkMode ? 'hover:text-pink-300' : 'hover:text-rose-600'
                }`}
              >
                Home
              </Link>
              <Link
                to="/authors"
                className={`transition ${
                  darkMode ? 'hover:text-pink-300' : 'hover:text-rose-600'
                }`}
              >
                Authors
              </Link>
              <Link
                to="/my-stories"
                className={`transition ${
                  darkMode ? 'hover:text-pink-300' : 'hover:text-rose-600'
                }`}
              >
                My Stories
              </Link>
              <Link
                to="/write"
                className={`transition ${
                  darkMode ? 'hover:text-pink-300' : 'hover:text-rose-600'
                }`}
              >
                Write a Story
              </Link>
            </div>
          </div>

          {/* Account */}
          <div className="md:col-span-2">
            <h3
              className={`text-[10.5px] font-bold uppercase tracking-[0.18em] ${
                darkMode ? 'text-pink-200' : 'text-slate-900'
              }`}
            >
              Account
            </h3>
            <div
              className={`mt-3.5 flex flex-col gap-2.5 text-xs ${
                darkMode ? 'text-purple-200/70' : 'text-slate-500'
              }`}
            >
              <Link
                to="/login"
                className={`transition ${
                  darkMode ? 'hover:text-pink-300' : 'hover:text-rose-600'
                }`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={`transition ${
                  darkMode ? 'hover:text-pink-300' : 'hover:text-rose-600'
                }`}
              >
                Create Account
              </Link>
              <Link
                to="/profile"
                className={`transition ${
                  darkMode ? 'hover:text-pink-300' : 'hover:text-rose-600'
                }`}
              >
                My Profile
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="md:col-span-2">
            <h3
              className={`text-[10.5px] font-bold uppercase tracking-[0.18em] ${
                darkMode ? 'text-pink-200' : 'text-slate-900'
              }`}
            >
              Contact
            </h3>
            <div
              className={`mt-3.5 flex flex-col gap-2.5 text-xs ${
                darkMode ? 'text-purple-200/70' : 'text-slate-500'
              }`}
            >
              <span>+123 456 789</span>
              <a
                href="mailto:hello@commonplace.blog"
                className={`transition ${
                  darkMode ? 'hover:text-pink-300' : 'hover:text-rose-600'
                }`}
              >
                hello@commonplace.blog
              </a>
              <span>Mandalay, Myanmar</span>
            </div>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-3">
            <div
              className={`rounded-2xl border p-4 ${
                darkMode
                  ? 'border-fuchsia-400/20 bg-white/5'
                  : 'border-rose-200/80 bg-white'
              }`}
            >
              <h3
                className={`text-[10.5px] font-bold uppercase tracking-[0.18em] ${
                  darkMode ? 'text-pink-200' : 'text-slate-900'
                }`}
              >
                Newsletter
              </h3>
              <form
                onSubmit={handleSubscribe}
                className="mt-3 flex items-center gap-2"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (subscribed) setSubscribed(false)
                  }}
                  placeholder="Email Address"
                  className={`w-full rounded-xl border px-3 py-2 text-xs outline-none transition ${
                    darkMode
                      ? 'border-white/15 bg-[#0d0715] text-white placeholder:text-purple-200/40 focus:border-pink-400'
                      : 'border-rose-200 bg-rose-50/40 text-slate-800 focus:border-rose-400'
                  }`}
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-xl bg-linear-to-r from-rose-500 to-purple-600 px-4 py-2 text-xs font-semibold text-white transition hover:brightness-110"
                >
                  Submit
                </button>
              </form>
              {subscribed && (
                <p
                  className={`mt-2 text-xs font-medium ${
                    darkMode ? 'text-pink-300' : 'text-rose-600'
                  }`}
                >
                  Subscribed to updates!
                </p>
              )}
            </div>
          </div>
        </div>

        <div
          className={`mt-12 flex flex-col items-center justify-between gap-2 border-t pt-6 text-xs sm:flex-row ${
            darkMode
              ? 'border-white/10 text-purple-200/50'
              : 'border-rose-200/70 text-slate-400'
          }`}
        >
          <span>
            © {new Date().getFullYear()} Commonplace. All rights reserved.
          </span>
          <span>Crafted with care</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer