import React, { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import { userService } from "../../services/userService"
import Button from "../common/Button"
import Input from "../common/Input"
import LoadingSpinner from "../common/LoadingSpinner"
import { User, Mail, Phone, MapPin, Edit, Save, X } from "lucide-react"

const UserProfile = () => {
  const { user, updateUser } = useAuth()
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    bio: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  })
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        bio: user.bio || "",
        addressLine1: user.addressLine1 || "",
        addressLine2: user.addressLine2 || "",
        city: user.city || "",
        state: user.state || "",
        postalCode: user.postalCode || "",
        country: user.country || "",
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSave = async () => {
    setLoading(true)
    setErrors({})
    
    try {
      const updatedProfile = await userService.updateProfile(profileData)
      updateUser(updatedProfile)
      setIsEditing(false)
    } catch (error) {
      setErrors({ general: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        bio: user.bio || "",
        addressLine1: user.addressLine1 || "",
        addressLine2: user.addressLine2 || "",
        city: user.city || "",
        state: user.state || "",
        postalCode: user.postalCode || "",
        country: user.country || "",
      })
    }
    setIsEditing(false)
    setErrors({})
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-gray-600">@{user.username}</p>
            </div>
          </div>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? "outline" : "primary"}
          >
            {isEditing ? <X className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </div>
      </div>

      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{errors.general}</p>
        </div>
      )}

      {/* Personal Information */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <User className="h-5 w-5 mr-2 text-gray-600" />
          Personal Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            {isEditing ? (
              <Input
                name="firstName"
                value={profileData.firstName}
                onChange={handleChange}
                error={errors.firstName}
              />
            ) : (
              <p className="text-gray-900">{profileData.firstName || "Not provided"}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            {isEditing ? (
              <Input
                name="lastName"
                value={profileData.lastName}
                onChange={handleChange}
                error={errors.lastName}
              />
            ) : (
              <p className="text-gray-900">{profileData.lastName || "Not provided"}</p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          {isEditing ? (
            <textarea
              name="bio"
              value={profileData.bio}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tell us about yourself..."
            />
          ) : (
            <p className="text-gray-900">{profileData.bio || "No bio provided"}</p>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Mail className="h-5 w-5 mr-2 text-gray-600" />
          Contact Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            {isEditing ? (
              <Input
                name="email"
                type="email"
                value={profileData.email}
                onChange={handleChange}
                error={errors.email}
              />
            ) : (
              <p className="text-gray-900">{profileData.email || "Not provided"}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            {isEditing ? (
              <Input
                name="phoneNumber"
                value={profileData.phoneNumber}
                onChange={handleChange}
                error={errors.phoneNumber}
                placeholder="+1 (555) 123-4567"
              />
            ) : (
              <p className="text-gray-900">{profileData.phoneNumber || "Not provided"}</p>
            )}
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-gray-600" />
          Address Information
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address Line 1
            </label>
            {isEditing ? (
              <Input
                name="addressLine1"
                value={profileData.addressLine1}
                onChange={handleChange}
                error={errors.addressLine1}
                placeholder="123 Main Street"
              />
            ) : (
              <p className="text-gray-900">{profileData.addressLine1 || "Not provided"}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address Line 2
            </label>
            {isEditing ? (
              <Input
                name="addressLine2"
                value={profileData.addressLine2}
                onChange={handleChange}
                error={errors.addressLine2}
                placeholder="Apartment, suite, etc. (optional)"
              />
            ) : (
              <p className="text-gray-900">{profileData.addressLine2 || "Not provided"}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              {isEditing ? (
                <Input
                  name="city"
                  value={profileData.city}
                  onChange={handleChange}
                  error={errors.city}
                  placeholder="New York"
                />
              ) : (
                <p className="text-gray-900">{profileData.city || "Not provided"}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              {isEditing ? (
                <Input
                  name="state"
                  value={profileData.state}
                  onChange={handleChange}
                  error={errors.state}
                  placeholder="NY"
                />
              ) : (
                <p className="text-gray-900">{profileData.state || "Not provided"}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Postal Code
              </label>
              {isEditing ? (
                <Input
                  name="postalCode"
                  value={profileData.postalCode}
                  onChange={handleChange}
                  error={errors.postalCode}
                  placeholder="10001"
                />
              ) : (
                <p className="text-gray-900">{profileData.postalCode || "Not provided"}</p>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            {isEditing ? (
              <Input
                name="country"
                value={profileData.country}
                onChange={handleChange}
                error={errors.country}
                placeholder="United States"
              />
            ) : (
              <p className="text-gray-900">{profileData.country || "Not provided"}</p>
            )}
          </div>
        </div>
      </div>

      {/* Save Button */}
      {isEditing && (
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={handleCancel} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                <span className="ml-2">Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

export default UserProfile
