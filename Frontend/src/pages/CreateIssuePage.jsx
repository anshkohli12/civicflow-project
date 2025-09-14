"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { issueService } from "../services/issueService"
import Button from "../components/common/Button"
import { ArrowLeft, Check, Upload, MapPin } from "lucide-react"

const CreateIssuePage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    description: "",
    latitude: null,
    longitude: null,
    critical: false,
    imageFile: null,
  })

  const steps = [
    { id: 1, title: "Category", description: "Select issue category" },
    { id: 2, title: "Details", description: "Describe the issue" },
    { id: 3, title: "Location", description: "Set issue location" },
    { id: 4, title: "Photos", description: "Add photos (optional)" },
    { id: 5, title: "Review", description: "Review and submit" },
  ]

  const categories = [
    { id: "Infrastructure", name: "Infrastructure", icon: "🏗️", description: "Roads, bridges, utilities" },
    { id: "Safety", name: "Safety", icon: "🚨", description: "Traffic, lighting, security" },
    { id: "Environment", name: "Environment", icon: "🌱", description: "Pollution, waste, nature" },
    { id: "Parks", name: "Parks & Recreation", icon: "🏞️", description: "Parks, playgrounds, sports" },
    { id: "Transportation", name: "Transportation", icon: "🚌", description: "Public transit, parking" },
    { id: "Roads", name: "Roads", icon: "🛣️", description: "Potholes, road maintenance" },
    { id: "Utilities", name: "Utilities", icon: "⚡", description: "Water, electricity, gas" },
    { id: "Cleanliness", name: "Cleanliness", icon: "🧹", description: "Waste management, sanitation" },
    { id: "Vandalism", name: "Vandalism", icon: "🎨", description: "Graffiti, property damage" },
    { id: "Other", name: "Other", icon: "📝", description: "Other civic issues" },
  ]

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      navigate("/issues")
    }
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      setError(null)

      // Validate required fields
      if (!formData.title || !formData.description || !formData.category) {
        setError("Please fill in all required fields")
        return
      }

      // Create issue data for the backend
      const issueData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        latitude: formData.latitude,
        longitude: formData.longitude,
        critical: formData.critical,
      }

      let response
      if (formData.imageFile) {
        // Use the method that handles file upload
        response = await issueService.createIssueWithImage(issueData, formData.imageFile)
      } else {
        // Use regular issue creation
        response = await issueService.createIssue(issueData)
      }

      console.log("Issue created successfully:", response)
      
      // Redirect to issues page with success message
      navigate("/issues", {
        state: { message: "Issue reported successfully!" },
      })
    } catch (error) {
      console.error("Error submitting issue:", error)
      setError(error.response?.data?.message || "Failed to submit issue. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateFormData = (updates) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  // Get user's current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          updateFormData({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Error getting location:", error)
          setError("Could not get your location. Please try again.")
        }
      )
    } else {
      setError("Geolocation is not supported by this browser.")
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="inline-flex items-center text-slate-600 hover:text-blue-600 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {currentStep === 1 ? "Back to Issues" : "Previous Step"}
          </button>

          <h1 className="text-3xl font-bold text-slate-900 mb-2">Report an Issue</h1>
          <p className="text-slate-600">Help improve your community by reporting civic issues</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep > step.id
                      ? "bg-green-600 border-green-600 text-white"
                      : currentStep === step.id
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-white border-slate-300 text-slate-400"
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${currentStep > step.id ? "bg-green-600" : "bg-slate-200"}`} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <h2 className="text-xl font-semibold text-slate-900">{steps[currentStep - 1].title}</h2>
            <p className="text-slate-600">{steps[currentStep - 1].description}</p>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          {/* Step 1: Category Selection */}
          {currentStep === 1 && (
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-6">What type of issue are you reporting?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => updateFormData({ category: category.id })}
                    className={`p-6 rounded-lg border-2 text-left transition-all hover:shadow-md ${
                      formData.category === category.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-3xl">{category.icon}</span>
                      <div>
                        <h4 className="font-semibold text-slate-900">{category.name}</h4>
                        <p className="text-sm text-slate-600">{category.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Issue Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
                  Issue Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => updateFormData({ title: e.target.value })}
                  placeholder="Brief, descriptive title (e.g., 'Broken streetlight on Main St')"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => updateFormData({ description: e.target.value })}
                  placeholder="Provide detailed information about the issue, including when you noticed it and any safety concerns..."
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Priority Level
                </label>
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.critical}
                      onChange={(e) => updateFormData({ critical: e.target.checked })}
                      className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="ml-2 text-sm text-slate-700">
                      Mark as Critical (Safety concern or emergency)
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Location (Optional)
                </label>
                <p className="text-sm text-slate-600 mb-4">
                  Provide the location coordinates for this issue. This helps authorities locate and address the problem.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="latitude" className="block text-sm font-medium text-slate-700 mb-2">
                      Latitude
                    </label>
                    <input
                      type="number"
                      id="latitude"
                      step="any"
                      value={formData.latitude || ""}
                      onChange={(e) => updateFormData({ latitude: e.target.value ? parseFloat(e.target.value) : null })}
                      placeholder="e.g., 40.7128"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="longitude" className="block text-sm font-medium text-slate-700 mb-2">
                      Longitude
                    </label>
                    <input
                      type="number"
                      id="longitude"
                      step="any"
                      value={formData.longitude || ""}
                      onChange={(e) => updateFormData({ longitude: e.target.value ? parseFloat(e.target.value) : null })}
                      placeholder="e.g., -74.0060"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="bg-slate-100 rounded-lg p-8 text-center">
                  <MapPin className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h4 className="font-semibold text-slate-900 mb-2">Use Current Location</h4>
                  <p className="text-slate-600 mb-4">Get your current location coordinates automatically</p>
                  <Button 
                    variant="outline" 
                    onClick={getCurrentLocation}
                    disabled={!navigator.geolocation}
                  >
                    Use Current Location
                  </Button>
                  {formData.latitude && formData.longitude && (
                    <div className="mt-4 text-sm text-green-600">
                      ✓ Location set: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Photos */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Photo (Optional)</label>
                <p className="text-sm text-slate-600 mb-4">
                  Add a photo to help illustrate the issue. This helps authorities understand and prioritize the problem.
                </p>

                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-slate-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0]
                      updateFormData({ imageFile: file })
                    }}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h4 className="font-semibold text-slate-900 mb-2">Upload Photo</h4>
                    <p className="text-slate-600">Click to browse or drag and drop an image</p>
                    <p className="text-xs text-slate-500 mt-2">PNG, JPG, GIF up to 10MB</p>
                  </label>
                </div>

                {formData.imageFile && (
                  <div className="mt-4">
                    <div className="relative inline-block">
                      <img
                        src={URL.createObjectURL(formData.imageFile)}
                        alt="Selected image"
                        className="w-32 h-32 object-cover rounded-lg border border-slate-200"
                      />
                      <button
                        onClick={() => updateFormData({ imageFile: null })}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-700"
                      >
                        ×
                      </button>
                    </div>
                    <p className="text-sm text-slate-600 mt-2">{formData.imageFile.name}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Review Your Issue Report</h3>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-600">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-slate-200">
                  <span className="font-medium text-slate-700">Category:</span>
                  <span className="text-slate-900">{categories.find((c) => c.id === formData.category)?.name}</span>
                </div>

                <div className="flex justify-between py-3 border-b border-slate-200">
                  <span className="font-medium text-slate-700">Title:</span>
                  <span className="text-slate-900 text-right max-w-md">{formData.title}</span>
                </div>

                <div className="py-3 border-b border-slate-200">
                  <span className="font-medium text-slate-700">Description:</span>
                  <p className="text-slate-900 mt-2">{formData.description}</p>
                </div>

                <div className="flex justify-between py-3 border-b border-slate-200">
                  <span className="font-medium text-slate-700">Location:</span>
                  <span className="text-slate-900 text-right max-w-md">
                    {formData.latitude && formData.longitude
                      ? `${formData.latitude.toFixed(4)}, ${formData.longitude.toFixed(4)}`
                      : "Not specified"
                    }
                  </span>
                </div>

                <div className="flex justify-between py-3 border-b border-slate-200">
                  <span className="font-medium text-slate-700">Priority:</span>
                  <span className="text-slate-900">
                    {formData.critical ? "Critical" : "Normal"}
                  </span>
                </div>

                {formData.imageFile && (
                  <div className="py-3">
                    <span className="font-medium text-slate-700">Photo:</span>
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(formData.imageFile)}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded border border-slate-200"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  By submitting this report, you agree that the information provided is accurate and you consent to it
                  being reviewed by local administrators.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
            <Button variant="outline" onClick={handleBack}>
              {currentStep === 1 ? "Cancel" : "Back"}
            </Button>

            <Button
              onClick={currentStep === steps.length ? handleSubmit : handleNext}
              disabled={
                isSubmitting ||
                (currentStep === 1 && !formData.category) ||
                (currentStep === 2 && (!formData.title || !formData.description))
              }
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? "Submitting..." : currentStep === steps.length ? "Submit Issue" : "Next Step"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateIssuePage
