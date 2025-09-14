import { apiService } from "./apiService"

export const userService = {
  async getProfile() {
    return await apiService.get("/api/user/profile")
  },

  async updateProfile(profileData) {
    return await apiService.put("/api/user/profile", profileData)
  },

  async uploadProfilePicture(file) {
    const formData = new FormData()
    formData.append("file", file)
    return await apiService.post("/api/user/upload-profile-picture", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  },

  async changePassword(passwordData) {
    return await apiService.put("/api/user/change-password", passwordData)
  },

  async deleteAccount() {
    return await apiService.delete("/api/user/delete-account")
  },

  async updatePreferences(preferences) {
    return await apiService.put("/api/user/preferences", preferences)
  },

  async getNotificationSettings() {
    return await apiService.get("/api/user/notification-settings")
  },

  async updateNotificationSettings(settings) {
    return await apiService.put("/api/user/notification-settings", settings)
  },
}
