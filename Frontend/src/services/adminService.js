import { apiService } from "./apiService"

export const adminService = {
  // Dashboard Statistics
  async getDashboardStats() {
    return await apiService.get("/api/admin/dashboard")
  },

  // User Management - Updated to match backend endpoints
  // Get all users with pagination
  async getAllUsers(page = 0, size = 20) {
    console.log('🔍 Fetching users from:', `/api/admin/users?page=${page}&size=${size}`)
    console.log('🔑 Token in localStorage:', localStorage.getItem('token') ? 'EXISTS' : 'MISSING')
    try {
      const result = await apiService.get(`/api/admin/users?page=${page}&size=${size}`)
      console.log('✅ Users fetched successfully:', result)
      return result
    } catch (error) {
      console.error('❌ Error fetching users:', error)
      throw error
    }
  },

  async getUserDetails(userId) {
    return await apiService.get(`/api/admin/users/${userId}`)
  },

  async changeUserRole(userId, role, areaCode = null, reason = null) {
    return await apiService.put(`/api/admin/users/${userId}/role`, { 
      newRole: role, 
      areaCode: areaCode,
      reason: reason 
    })
  },

  async toggleUserStatus(userId) {
    return await apiService.put(`/api/admin/users/${userId}/toggle-status`)
  },

  async deleteUser(userId) {
    return await apiService.delete(`/api/admin/users/${userId}`)
  },

  // Bulk operations
  async bulkToggleUserStatus(userIds) {
    return await apiService.put("/api/admin/users/bulk/toggle-status", { userIds })
  },

  async bulkChangeUserRole(userIds, newRole, areaCode = null, reason = null) {
    return await apiService.put("/api/admin/users/bulk/change-role", { 
      userIds, 
      newRole, 
      areaCode, 
      reason 
    })
  },

  // Statistics
  async getUserStatistics() {
    return await apiService.get("/api/admin/statistics/users")
  },

  async getIssueStatistics() {
    return await apiService.get("/api/admin/statistics/issues")
  },

  async getSystemHealth() {
    return await apiService.get("/api/admin/system/health")
  },

  // Activities
  async getRecentActivities(page = 0, size = 20) {
    return await apiService.get(`/api/admin/activities?page=${page}&size=${size}`)
  },

  // Issues Management (using regular issue endpoints)
  async getAllIssues(page = 0, size = 10, sortBy = "createdAt", sortDir = "desc", status = null, category = null) {
    const params = new URLSearchParams()
    params.append("page", page)
    params.append("size", size)
    params.append("sortBy", sortBy)
    params.append("sortDir", sortDir)
    if (status) params.append("status", status)
    if (category) params.append("category", category)
    return await apiService.get(`/api/issues?${params.toString()}`)
  },

  async getIssueDetails(issueId) {
    return await apiService.get(`/api/issues/${issueId}`)
  },

  async updateIssueStatus(issueId, status) {
    return await apiService.patch(`/api/issues/${issueId}/status?status=${encodeURIComponent(status)}`, {})
  },

  async updateIssueCritical(issueId, critical) {
    return await apiService.patch(`/api/issues/${issueId}/critical?critical=${critical}`, {})
  },

  async deleteIssue(issueId) {
    return await apiService.delete(`/api/issues/${issueId}`)
  },

  // User's issues for admin view
  async getUserIssues(userId, page = 0, size = 10) {
    return await apiService.get(`/api/issues/user/${userId}?page=${page}&size=${size}`)
  },

  // NGO Management
  async getAllNgos(page = 0, size = 20) {
    return await apiService.get(`/api/admin/ngos?page=${page}&size=${size}`)
  },

  async getNgoDetails(ngoId) {
    return await apiService.get(`/api/admin/ngos/${ngoId}`)
  },

  async assignIssueToNgo(issueId, ngoId) {
    return await apiService.patch(`/api/admin/issues/${issueId}/assign`, { ngoId })
  },

  async unassignIssueFromNgo(issueId) {
    return await apiService.patch(`/api/admin/issues/${issueId}/unassign`)
  }
}
