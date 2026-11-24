import { create } from 'zustand'
import API from '../lib/api'

const useAuthStore = create((set) => ({
  currentUser: null,
  token: sessionStorage.getItem('token'),
  isLoggedIn: !!sessionStorage.getItem('token'),
  loading: false,
  error: null,

  login: async (email, password) => {
    try {
      set({ loading: true, error: null })

      const response = await API.post('/users/login', {
        email,
        password,
      })

      const { token, id, name } = response.data

      sessionStorage.setItem('token', token)

      set({
        token,
        currentUser: { id, name, email },
        isLoggedIn: true,
        loading: false,
      })

      return true
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Login failed',
        loading: false,
      })

      return false
    }
  },

  logout: () => {
    sessionStorage.removeItem('token')

    set({
      currentUser: null,
      token: null,
      isLoggedIn: false,
      error: null,
    })
  },
}))

export default useAuthStore