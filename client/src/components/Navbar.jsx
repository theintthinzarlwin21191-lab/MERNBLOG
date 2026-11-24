import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  BookOpen,
  PenLine,
  UserRound,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
} from 'lucide-react'

import useAuthStore from '../stores/authStore'
import useThemeStore from '../stores/themeStore'

function Navbar() {
  const { isLoggedIn, logout } = useAuthStore()
  const darkMode = useThemeStore((state) => state.darkMode)
  const toggleDarkMode = useThemeStore((state) => state.toggleDarkMode)
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => {
    setMenuOpen(false)
  }

  const navStyle = ({ isActive }) =>
    `rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-200 ${
      isActive
        ? darkMode
          ? 'bg-linear-to-r from-pink-500/25 to-purple-500/25 text-pink-200 ring-1 ring-pink-400/35'
          : 'bg-linear-to-r from-rose-100 to-purple-100 text-rose-700 ring-1 ring-rose-200'
        : darkMode
          ? 'text-purple-100/75 hover:bg-white/5 hover:text-white'
          : 'text-slate-600 hover:bg-rose-50 hover:text-rose-600'
    }`

  const handleLogout = () => {
    logout()
    closeMenu()
    navigate('/login')
  }

  const mobileLinkStyle = ({ isActive }) =>
    `block rounded-2xl px-4 py-3 text-sm font-semibold transition ${
      isActive
        ? darkMode
          ? 'bg-pink-500/20 text-pink-200'
          : 'bg-rose-100 text-rose-700'
        : darkMode
          ? 'text-purple-100/80 hover:bg-white/5'
          : 'text-slate-700 hover:bg-rose-50'
    }`

  return (
    <nav
      className={`sticky top-0 z-50 w-full border-b backdrop-blur-xl transition-colors duration-300 ${
        darkMode
          ? 'border-fuchsia-400/20 bg-[#12091c]/85 text-white'
          : 'border-rose-200/80 bg-white/85 text-slate-900 shadow-2xs'
      }`}
    >
      <div className="mx-auto flex min-h max-w-6xl items-center justify-between gap-4 px-5 md:px-8">
        {/* Brand */}
        <Link
          to="/"
          onClick={closeMenu}
          className="group flex shrink-0 items-center gap-3.5"
        >
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-rose-500 via-pink-500 to-purple-600 text-white shadow-md shadow-rose-500/20 transition group-hover:scale-105`}
          >
            <BookOpen size={20} strokeWidth={2.2} />
          </div>

          <div>
            <span className="block font-serif text-xl font-bold tracking-tight sm:text-2xl">
              Commonplace
              <span className={darkMode ? 'text-pink-400' : 'text-rose-500'}>
                .
              </span>
            </span>

            <span
              className={`hidden text-[9.5px] font-bold uppercase tracking-[0.22em] sm:block ${
                darkMode ? 'text-purple-200/50' : 'text-slate-400'
              }`}
            >
              EDITORIAL JOURNAL
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1.5 md:flex">
          <NavLink to="/" end className={navStyle}>
            Home
          </NavLink>

          <NavLink to="/authors" className={navStyle}>
            Authors
          </NavLink>

          {isLoggedIn ? (
            <>
              <NavLink to="/my-stories" className={navStyle}>
                My Stories
              </NavLink>

              <NavLink
                to="/write"
                className="ml-2 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-rose-500 to-purple-600 px-5 py-2.5 text-xs font-semibold tracking-wide text-white shadow-sm shadow-rose-500/25 transition hover:brightness-110"
              >
                <PenLine size={14} />
                Write Story
              </NavLink>

              <NavLink
                to="/profile"
                aria-label="My Profile"
                className={({ isActive }) =>
                  `ml-1 flex h-10 w-10 items-center justify-center rounded-full border transition ${
                    isActive
                      ? darkMode
                        ? 'border-pink-400/50 bg-pink-500/20 text-pink-200'
                        : 'border-rose-300 bg-rose-100 text-rose-700'
                      : darkMode
                        ? 'border-white/15 bg-white/5 text-purple-100 hover:border-pink-400/40 hover:text-pink-200'
                        : 'border-rose-200 bg-rose-50/60 text-slate-700 hover:border-rose-300 hover:text-rose-600'
                  }`
                }
              >
                <UserRound size={17} />
              </NavLink>

              <button
                type="button"
                onClick={handleLogout}
                className={`ml-1 inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition ${
                  darkMode
                    ? 'text-purple-200/75 hover:bg-red-500/15 hover:text-red-300'
                    : 'text-slate-600 hover:bg-red-50 hover:text-red-600'
                }`}
              >
                <LogOut size={15} />
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navStyle}>
                Login
              </NavLink>

              <Link
                to="/register"
                className="ml-2 rounded-full bg-linear-to-r from-rose-500 to-purple-600 px-5 py-2.5 text-xs font-semibold tracking-wide text-white shadow-sm shadow-rose-500/25 transition hover:brightness-110"
              >
                Get Started
              </Link>
            </>
          )}

          {/* Theme Switch */}
          <button
            type="button"
            onClick={toggleDarkMode}
            aria-label="Switch between light and dark mode"
            className={`ml-2 inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold transition-all ${
              darkMode
                ? 'border-fuchsia-400/30 bg-white/10 text-amber-300 hover:border-pink-400'
                : 'border-rose-200 bg-rose-50/80 text-rose-700 hover:border-rose-300 hover:bg-rose-100'
            }`}
          >
            {darkMode ? <Sun size={14} /> : <Moon size={14} />}
            <span>{darkMode ? 'Light' : 'Dark'}</span>
          </button>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={toggleDarkMode}
            aria-label="Switch between light and dark mode"
            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
              darkMode
                ? 'border-fuchsia-400/30 bg-white/10 text-amber-300'
                : 'border-rose-200 bg-rose-50 text-rose-700'
            }`}
          >
            {darkMode ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className={`flex h-11 w-11 items-center justify-center rounded-xl border transition ${
              darkMode
                ? 'border-white/15 bg-white/5 text-purple-100'
                : 'border-rose-200 bg-rose-50/70 text-slate-800'
            }`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div
          className={`border-t px-5 py-5 md:hidden ${
            darkMode
              ? 'border-fuchsia-400/20 bg-[#12091c]'
              : 'border-rose-200/80 bg-white'
          }`}
        >
          <div className="flex flex-col gap-2">
            <NavLink to="/" end onClick={closeMenu} className={mobileLinkStyle}>
              Home
            </NavLink>

            <NavLink to="/authors" onClick={closeMenu} className={mobileLinkStyle}>
              Authors
            </NavLink>

            {isLoggedIn ? (
              <>
                <NavLink
                  to="/my-stories"
                  onClick={closeMenu}
                  className={mobileLinkStyle}
                >
                  My Stories
                </NavLink>

                <NavLink
                  to="/write"
                  onClick={closeMenu}
                  className="mt-1 flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-rose-500 to-purple-600 px-4 py-3 text-sm font-semibold text-white"
                >
                  <PenLine size={16} />
                  Write Story
                </NavLink>

                <NavLink
                  to="/profile"
                  onClick={closeMenu}
                  className={mobileLinkStyle}
                >
                  My Profile
                </NavLink>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-rose-400 hover:bg-rose-500/10"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  onClick={closeMenu}
                  className={mobileLinkStyle}
                >
                  Login
                </NavLink>

                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="mt-2 rounded-full bg-linear-to-r from-rose-500 to-purple-600 px-5 py-3 text-center text-sm font-semibold text-white"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar