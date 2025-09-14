import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { authService } from "../services/authService"
import { useAuth } from "../context/AuthContext"
import { toast } from "react-toastify"
import AuthLayout from "../components/auth/AuthLayout"
import Button from "../components/common/Button"
import Input from "../components/common/Input"
import { Building2 } from "lucide-react"

const NgoLoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    console.log('NGO Login: Starting login process...')
    
    try {
      console.log('NGO Login: Calling login with credentials:', { username: formData.username })
      const response = await login({
        username: formData.username,
        password: formData.password
      })
      
      console.log('NGO Login: Login response:', response)
      
      // Check if the user is an NGO
      if (response.role !== "NGO") {
        console.log('NGO Login: User is not an NGO, role:', response.role)
        toast.error("Access denied. This login is for NGOs only.")
        setLoading(false)
        return
      }
      
      // Login successful
      console.log('NGO Login: Login successful, navigating to dashboard...')
      toast.success("Welcome back!")
      navigate("/ngo/dashboard")
    } catch (error) {
      console.error("NGO login error:", error)
      let errorMessage = "Login failed. Please try again."
      
      if (error.response?.status === 401) {
        errorMessage = "Invalid username or password."
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
              <Building2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-3">NGO Login</h2>
          <p className="text-lg text-slate-600">Access your NGO dashboard and manage assigned issues</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="username"
            name="username"
            type="text"
            label="Username or Email"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            placeholder="Enter your username or email"
            required
          />

          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="Enter your password"
            required
          />

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Building2 className="w-5 h-5" />
                <span>Sign in to Dashboard</span>
              </div>
            )}
          </Button>
        </form>

        <div className="text-center space-y-6 pt-6 border-t border-gray-200">
          <p className="text-slate-600">
            New to CivicFlow?{" "}
            <Link to="/ngo/register" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
              Register your NGO
            </Link>
          </p>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Looking for a different login?</span>
            </div>
          </div>

          <div className="flex justify-center space-x-6 text-sm">
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
            >
              Citizen Login
            </Link>
            <span className="text-gray-300">|</span>
            <Link
              to="/admin/login"
              className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}

export default NgoLoginPage