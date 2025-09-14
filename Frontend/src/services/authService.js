import { apiService } from "./apiService"

export const authService = {
  async login(credentials) {
    const response = await apiService.post("/api/auth/login", credentials)
    if (response.token) {
      localStorage.setItem("token", response.token)
      localStorage.setItem("user", JSON.stringify(response))
    }
    return response
  },

  async register(userData) {
    const response = await apiService.post("/api/auth/register", userData)
    return response
  },

  logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  },

  getCurrentUser() {
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user) : null
  },

  isAuthenticated() {
    return !!localStorage.getItem("token")
  },

  isAdmin() {
    const user = this.getCurrentUser()
    return user?.role === "ADMIN"
  },
}
