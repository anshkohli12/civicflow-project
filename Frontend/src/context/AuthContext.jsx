import React, { createContext, useContext, useState, useEffect } from "react"
import { authService } from "../services/authService"
import { userService } from "../services/userService"

const AuthContext = createContext()

export { AuthContext }

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          const userData = await userService.getProfile()
          setUser(userData)
        } catch (error) {
          console.error("Failed to get user profile:", error)
          authService.logout()
        }
      }
      setLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials)
      setUser(response)
      return response
    } catch (error) {
      throw new Error(error.message || "Login failed")
    }
  }

  const register = async (userData) => {
    try {
      const response = await authService.register(userData)
      return response
    } catch (error) {
      throw new Error(error.message || "Registration failed")
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  const updateUser = (userData) => {
    setUser((prev) => ({ ...prev, ...userData }))
  }

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "ADMIN",
    isNgo: user?.role === "NGO",
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
