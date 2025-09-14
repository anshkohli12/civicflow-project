"use client"

import { useState } from "react"
import { useAuth } from "../../hooks/useAuth"
import Button from "../common/Button"
import Input from "../common/Input"
import LoadingSpinner from "../common/LoadingSpinner"

const ContactInfo = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    phone: user?.phone || "",
    alternateEmail: user?.alternateEmail || "",
    website: user?.website || "",
    socialMedia: {
      twitter: user?.socialMedia?.twitter || "",
      linkedin: user?.socialMedia?.linkedin || "",
    },
  })
  const [errors, setErrors] = useState({})
  const { updateUser } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name.startsWith("social.")) {
      const socialField = name.split(".")[1]
      setFormData((prev) => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [socialField]: value,
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (formData.phone && !/^\+?[\d\s\-$$$$]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number"
    }

    if (formData.alternateEmail && !/\S+@\S+\.\S+/.test(formData.alternateEmail)) {
      newErrors.alternateEmail = "Please enter a valid email address"
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = "Please enter a valid URL (starting with http:// or https://)"
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    setErrors({})

    try {
      // Mock API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000))
      updateUser(formData)
      setIsEditing(false)
    } catch (error) {
      setErrors({ submit: "Failed to update contact information. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      phone: user?.phone || "",
      alternateEmail: user?.alternateEmail || "",
      website: user?.website || "",
      socialMedia: {
        twitter: user?.socialMedia?.twitter || "",
        linkedin: user?.socialMedia?.linkedin || "",
      },
    })
    setErrors({})
    setIsEditing(false)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900">Contact Information</h2>
        {!isEditing && (
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        )}
      </div>

      {errors.submit && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{errors.submit}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
            Phone Number
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            disabled={!isEditing || loading}
            placeholder="+1 (555) 123-4567"
            error={errors.phone}
          />
        </div>

        <div>
          <label htmlFor="alternateEmail" className="block text-sm font-medium text-slate-700 mb-2">
            Alternate Email
          </label>
          <Input
            id="alternateEmail"
            name="alternateEmail"
            type="email"
            value={formData.alternateEmail}
            onChange={handleChange}
            disabled={!isEditing || loading}
            placeholder="alternate@example.com"
            error={errors.alternateEmail}
          />
        </div>

        <div>
          <label htmlFor="website" className="block text-sm font-medium text-slate-700 mb-2">
            Website
          </label>
          <Input
            id="website"
            name="website"
            type="url"
            value={formData.website}
            onChange={handleChange}
            disabled={!isEditing || loading}
            placeholder="https://yourwebsite.com"
            error={errors.website}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Social Media</h3>

          <div>
            <label htmlFor="twitter" className="block text-sm font-medium text-slate-700 mb-2">
              Twitter
            </label>
            <Input
              id="twitter"
              name="social.twitter"
              type="text"
              value={formData.socialMedia.twitter}
              onChange={handleChange}
              disabled={!isEditing || loading}
              placeholder="@yourusername"
            />
          </div>

          <div>
            <label htmlFor="linkedin" className="block text-sm font-medium text-slate-700 mb-2">
              LinkedIn
            </label>
            <Input
              id="linkedin"
              name="social.linkedin"
              type="text"
              value={formData.socialMedia.linkedin}
              onChange={handleChange}
              disabled={!isEditing || loading}
              placeholder="linkedin.com/in/yourusername"
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex space-x-4">
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
              {loading ? (
                <div className="flex items-center">
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Saving...</span>
                </div>
              ) : (
                "Save Changes"
              )}
            </Button>
            <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>
              Cancel
            </Button>
          </div>
        )}
      </form>
    </div>
  )
}

export default ContactInfo
