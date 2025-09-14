"use client"

import { useState } from "react"
import { useAuth } from "../../hooks/useAuth"
import Button from "../common/Button"
import LoadingSpinner from "../common/LoadingSpinner"

const PreferencesSettings = ({ user }) => {
  const [loading, setLoading] = useState(false)
  const [preferences, setPreferences] = useState({
    emailNotifications: user?.preferences?.emailNotifications ?? true,
    smsNotifications: user?.preferences?.smsNotifications ?? false,
    pushNotifications: user?.preferences?.pushNotifications ?? true,
    weeklyDigest: user?.preferences?.weeklyDigest ?? true,
    issueUpdates: user?.preferences?.issueUpdates ?? true,
    communityNews: user?.preferences?.communityNews ?? false,
    language: user?.preferences?.language || "en",
    timezone: user?.preferences?.timezone || "America/New_York",
    theme: user?.preferences?.theme || "light",
  })
  const [errors, setErrors] = useState({})
  const { updateUser } = useAuth()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setPreferences((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      // Mock API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000))
      updateUser({ preferences })
    } catch (error) {
      setErrors({ submit: "Failed to update preferences. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-slate-900 mb-6">Preferences & Settings</h2>

      {errors.submit && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{errors.submit}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Notification Preferences */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Notification Preferences</h3>
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="emailNotifications"
                checked={preferences.emailNotifications}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
              <div>
                <span className="text-slate-900 font-medium">Email Notifications</span>
                <p className="text-slate-600 text-sm">Receive notifications via email</p>
              </div>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="smsNotifications"
                checked={preferences.smsNotifications}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
              <div>
                <span className="text-slate-900 font-medium">SMS Notifications</span>
                <p className="text-slate-600 text-sm">Receive notifications via text message</p>
              </div>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="pushNotifications"
                checked={preferences.pushNotifications}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
              <div>
                <span className="text-slate-900 font-medium">Push Notifications</span>
                <p className="text-slate-600 text-sm">Receive browser push notifications</p>
              </div>
            </label>
          </div>
        </div>

        {/* Content Preferences */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Content Preferences</h3>
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="weeklyDigest"
                checked={preferences.weeklyDigest}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
              <div>
                <span className="text-slate-900 font-medium">Weekly Digest</span>
                <p className="text-slate-600 text-sm">Receive a weekly summary of community activity</p>
              </div>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="issueUpdates"
                checked={preferences.issueUpdates}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
              <div>
                <span className="text-slate-900 font-medium">Issue Updates</span>
                <p className="text-slate-600 text-sm">
                  Get notified when issues you've reported or voted on are updated
                </p>
              </div>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="communityNews"
                checked={preferences.communityNews}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
              <div>
                <span className="text-slate-900 font-medium">Community News</span>
                <p className="text-slate-600 text-sm">Receive updates about community events and news</p>
              </div>
            </label>
          </div>
        </div>

        {/* Language & Region */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Language & Region</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-slate-700 mb-2">
                Language
              </label>
              <select
                id="language"
                name="language"
                value={preferences.language}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>

            <div>
              <label htmlFor="timezone" className="block text-sm font-medium text-slate-700 mb-2">
                Timezone
              </label>
              <select
                id="timezone"
                name="timezone"
                value={preferences.timezone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
              </select>
            </div>
          </div>
        </div>

        {/* Theme */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Appearance</h3>
          <div>
            <label htmlFor="theme" className="block text-sm font-medium text-slate-700 mb-2">
              Theme
            </label>
            <select
              id="theme"
              name="theme"
              value={preferences.theme}
              onChange={handleChange}
              className="w-full max-w-xs px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200">
          <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
            {loading ? (
              <div className="flex items-center">
                <LoadingSpinner size="sm" />
                <span className="ml-2">Saving...</span>
              </div>
            ) : (
              "Save Preferences"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default PreferencesSettings
