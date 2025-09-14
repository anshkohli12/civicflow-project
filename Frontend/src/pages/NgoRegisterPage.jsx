import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { authService } from "../services/authService"
import { toast } from "react-toastify"
import AuthLayout from "../components/auth/AuthLayout"
import Button from "../components/common/Button"
import Input from "../components/common/Input"
import { Building2, MapPin } from "lucide-react"

const NgoRegisterPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)
  const [formData, setFormData] = useState({
    organizationName: "",
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    areaCode: "",
    bio: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    latitude: "",
    longitude: ""
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

    if (!formData.organizationName.trim()) {
      newErrors.organizationName = "Organization name is required"
    }

    if (!formData.bio.trim()) {
      newErrors.bio = "Organization description is required"
    } else if (formData.bio.length < 20) {
      newErrors.bio = "Description must be at least 20 characters"
    }

    if (!formData.areaCode.trim()) {
      newErrors.areaCode = "Area code is required"
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required"
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters"
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required"
    }

    if (!formData.areaCode.trim()) {
      newErrors.areaCode = "Area code is required"
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required"
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required"
    }

    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 = "Address is required"
    }

    if (!formData.country.trim()) {
      newErrors.country = "Country is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form")
      return
    }

    setLoading(true)
    
    try {
      // Prepare NGO registration data
      const ngoData = {
        ...formData,
        role: "NGO",
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null
      }
      
      // Remove confirm password from the data
      delete ngoData.confirmPassword
      
      await authService.register(ngoData)
      toast.success("NGO registration successful! Please login to continue.")
      navigate("/ngo/login")
    } catch (error) {
      console.error("NGO registration error:", error)
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "Registration failed. Please try again."
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser")
      return
    }

    setLocationLoading(true)
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setFormData(prev => ({
          ...prev,
          latitude: latitude.toString(),
          longitude: longitude.toString()
        }))
        setLocationLoading(false)
        toast.success("Location coordinates updated successfully!")
      },
      (error) => {
        console.error("Error getting location:", error)
        let errorMessage = "Unable to get your location. "
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "Please allow location access in your browser settings."
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Location information is unavailable."
            break
          case error.TIMEOUT:
            errorMessage += "Location request timed out."
            break
          default:
            errorMessage += "Please try again or enter coordinates manually."
            break
        }
        
        toast.error(errorMessage)
        setLocationLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                <Building2 className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4">
              Register Your NGO
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Join CivicFlow to help resolve community issues and make a positive impact in your area.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Organization Information */}
            <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-lg rounded-xl p-6 space-y-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Organization Information</h3>
                  <p className="text-sm text-gray-600">Tell us about your organization</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-1">
                  <Input
                    id="organizationName"
                    name="organizationName"
                    type="text"
                    label="Organization Name"
                    value={formData.organizationName}
                    onChange={handleChange}
                    error={errors.organizationName}
                    placeholder="Enter your organization's official name"
                    required
                  />
                </div>

                <div>
                  <Input
                    id="areaCode"
                    name="areaCode"
                    type="text"
                    label="Area Code / Ward"
                    value={formData.areaCode}
                    onChange={handleChange}
                    error={errors.areaCode}
                    placeholder="Service area code"
                    required
                  />
                </div>

                <div>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    label="Phone Number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    error={errors.phoneNumber}
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={3}
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 text-sm bg-gray-50/50 hover:bg-white"
                  placeholder="Brief description of your organization's mission, services, and community impact..."
                  required
                />
                {errors.bio && <p className="mt-2 text-sm text-red-600">{errors.bio}</p>}
              </div>
            </div>

            {/* Contact Person & Account Information Combined */}
            <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-lg rounded-xl p-6 space-y-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Contact Person & Account Details</h3>
                  <p className="text-sm text-gray-600">Primary contact and login information</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  label="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                  placeholder="John"
                  required
                />
                
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  label="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={errors.lastName}
                  placeholder="Doe"
                  required
                />

                <Input
                  id="email"
                  name="email"
                  type="email"
                  label="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  placeholder="contact@yourngo.org"
                  required
                />

                <Input
                  id="username"
                  name="username"
                  type="text"
                  label="Username"
                  value={formData.username}
                  onChange={handleChange}
                  error={errors.username}
                  placeholder="your_ngo_username"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  label="Password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  placeholder="Create a strong password"
                  required
                />
                
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  label="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-lg rounded-xl p-6 space-y-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-md">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Address Information</h3>
                  <p className="text-sm text-gray-600">Where your organization is located</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  id="addressLine1"
                  name="addressLine1"
                  type="text"
                  label="Address Line 1"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  error={errors.addressLine1}
                  placeholder="123 Main Street"
                  required
                />

                <Input
                  id="addressLine2"
                  name="addressLine2"
                  type="text"
                  label="Address Line 2"
                  value={formData.addressLine2}
                  onChange={handleChange}
                  placeholder="Suite, apartment, floor (optional)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Input
                  id="city"
                  name="city"
                  type="text"
                  label="City"
                  value={formData.city}
                  onChange={handleChange}
                  error={errors.city}
                  placeholder="New York"
                  required
                />
                
                <Input
                  id="state"
                  name="state"
                  type="text"
                  label="State"
                  value={formData.state}
                  onChange={handleChange}
                  error={errors.state}
                  placeholder="NY"
                  required
                />
                
                <Input
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  label="Postal Code"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="10001"
                />

                <Input
                  id="country"
                  name="country"
                  type="text"
                  label="Country"
                  value={formData.country}
                  onChange={handleChange}
                  error={errors.country}
                  placeholder="United States"
                  required
                />
              </div>
            </div>

            {/* Location Coordinates (Optional) */}
            <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-lg rounded-xl p-6 space-y-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Location Coordinates</h3>
                  <p className="text-sm text-gray-600">Optional: Help citizens find you easily</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  id="latitude"
                  name="latitude"
                  type="number"
                  step="any"
                  label="Latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="e.g., 40.7128"
                />
                
                <Input
                  id="longitude"
                  name="longitude"
                  type="number"
                  step="any"
                  label="Longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="e.g., -74.0060"
                />
              </div>

              {/* Use Current Location Button */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={locationLoading}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {locationLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Getting Location...</span>
                    </>
                  ) : (
                    <>
                      <MapPin className="w-4 h-4" />
                      <span>Use Current Location</span>
                    </>
                  )}
                </button>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>💡 Tip:</strong> You can get your coordinates from Google Maps by right-clicking on your location and selecting the coordinates, or use the "Use Current Location" button above.
                </p>
              </div>
            </div>

            <div className="pt-6 flex justify-center">
              <Button
                type="submit"
                disabled={loading}
                className="px-12 h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg transform hover:scale-[1.01] active:scale-[0.99]"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Registering Your NGO...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-3">
                    <Building2 className="w-5 h-5" />
                    <span>Register NGO</span>
                  </div>
                )}
              </Button>
            </div>
          </form>

          <div className="text-center space-y-6 pt-8 border-t border-gray-300">
            <p className="text-base text-slate-600">
              Already have an NGO account?{" "}
              <Link to="/ngo/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors hover:underline">
                Sign in here
              </Link>
            </p>
            <p className="text-base text-slate-600">
              Looking for citizen registration?{" "}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors hover:underline">
                Register as citizen
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NgoRegisterPage