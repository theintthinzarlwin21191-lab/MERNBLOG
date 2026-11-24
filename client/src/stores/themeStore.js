import { create } from 'zustand'

const getInitialDarkMode = () => {
  if (typeof window === 'undefined') return false
  try {
    return localStorage.getItem('blogThemeMode') === 'dark'
  } catch {
    return false
  }
}

const useThemeStore = create((set) => ({
  darkMode: getInitialDarkMode(),

  setDarkMode: (value) => {
    const next = Boolean(value)
    try {
      localStorage.setItem('blogThemeMode', next ? 'dark' : 'light')
      document.documentElement.classList.toggle('dark', next)
    } catch {
      // Ignore storage errors
    }
    set({ darkMode: next })
  },

  toggleDarkMode: () =>
    set((state) => {
      const next = !state.darkMode
      try {
        localStorage.setItem('blogThemeMode', next ? 'dark' : 'light')
        document.documentElement.classList.toggle('dark', next)
      } catch {
        // Ignore storage errors
      }
      return { darkMode: next }
    }),
}))

export default useThemeStore