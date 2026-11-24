import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Authors from './pages/Authors'
import MyStories from './pages/MyStories'
import PostDetail from './pages/PostDetail'
import AuthorProfile from './pages/AuthorProfile'
import Write from './pages/Write'
import EditPost from './pages/EditPost'
import Profile from './pages/Profile'
import useThemeStore from './stores/themeStore'

function App() {
  const darkMode = useThemeStore((state) => state.darkMode)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  return (
    <BrowserRouter>
      <div
        className={`flex min-h-screen flex-col transition-colors duration-300 ${
          darkMode
            ? 'bg-[#0b1117] text-slate-100'
            : 'bg-[#f4f7f5] text-slate-900'
        }`}
      >
        <Navbar />

        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/authors" element={<Authors />} />
            <Route path="/authors/:id" element={<AuthorProfile />} />
            <Route path="/posts/:id" element={<PostDetail />} />

            <Route
              path="/my-stories"
              element={
                <ProtectedRoute>
                  <MyStories />
                </ProtectedRoute>
              }
            />

            <Route
              path="/write"
              element={
                <ProtectedRoute>
                  <Write />
                </ProtectedRoute>
              }
            />

            <Route
              path="/edit-post/:id"
              element={
                <ProtectedRoute>
                  <EditPost />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="*"
              element={
                <div className="flex min-h-[65vh] flex-col items-center justify-center px-5 py-16 text-center">
                  <div
                    className={`w-full max-w-md rounded-3xl border px-8 py-12 transition-colors duration-300 ${
                      darkMode
                        ? 'border-slate-800 bg-[#131c24] text-slate-100'
                        : 'border-slate-200/90 bg-white text-slate-900 shadow-xs'
                    }`}
                  >
                    <span
                      className={`inline-block rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-widest ${
                        darkMode
                          ? 'bg-teal-500/15 text-teal-300'
                          : 'bg-teal-50 text-teal-700'
                      }`}
                    >
                      Page Not Found
                    </span>

                    <h1 className="mt-3 text-5xl font-extrabold tracking-tight">
                      404
                    </h1>

                    <p
                      className={`mt-2.5 text-sm ${
                        darkMode ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      Sorry, this page could not be found.
                    </p>

                    <Link
                      to="/"
                      className={`mt-6 inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white transition ${
                        darkMode
                          ? 'bg-teal-500 text-slate-950 hover:bg-teal-400'
                          : 'bg-teal-700 hover:bg-teal-800'
                      }`}
                    >
                      <ArrowLeft size={16} />
                      Back to Home
                    </Link>
                  </div>
                </div>
              }
            />
          </Routes>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App