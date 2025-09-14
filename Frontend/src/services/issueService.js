import { apiService } from "./apiService"

export const issueService = {
  // Get all issues (matches backend GET /api/issues)
  async getIssues() {
    console.log('🔍 Fetching issues from:', `/api/issues`)
    console.log('🔑 Token in localStorage:', localStorage.getItem('token') ? 'EXISTS' : 'MISSING')
    try {
      const result = await apiService.get(`/api/issues`)
      console.log('✅ Issues fetched successfully:', result)
      return result
    } catch (error) {
      console.error('❌ Error fetching issues:', error)
      throw error
    }
  },

  // Alias for admin pages
  async getAllIssues() {
    console.log('🔍 Fetching all issues from:', `/api/issues`)
    console.log('🔑 Token in localStorage:', localStorage.getItem('token') ? 'EXISTS' : 'MISSING')
    try {
      const result = await apiService.get(`/api/issues`)
      console.log('✅ All issues fetched successfully:', result)
      return result
    } catch (error) {
      console.error('❌ Error fetching all issues:', error)
      throw error
    }
  },

  // Get issues with smart filtering (matches backend GET /api/issues/filter)
  async getFilteredIssues(params = {}) {
    const queryParams = new URLSearchParams()

    // Add pagination
    queryParams.append("page", params.page || 0)
    queryParams.append("size", params.size || 20)

    // Add location filters
    if (params.latitude) queryParams.append("latitude", params.latitude)
    if (params.longitude) queryParams.append("longitude", params.longitude)
    if (params.radiusKm) queryParams.append("radiusKm", params.radiusKm)
    
    // Add other filters
    if (params.category) queryParams.append("category", params.category)
    if (params.isCritical !== undefined) queryParams.append("isCritical", params.isCritical)
    if (params.status) queryParams.append("status", params.status)
    if (params.minVotes) queryParams.append("minVotes", params.minVotes)
    if (params.dateFrom) queryParams.append("dateFrom", params.dateFrom)
    if (params.dateTo) queryParams.append("dateTo", params.dateTo)
    if (params.sortBy) queryParams.append("sortBy", params.sortBy)

    return await apiService.get(`/api/issues/filter?${queryParams.toString()}`)
  },

  // Get issue by ID (matches backend GET /api/issues/{id})
  async getIssueById(id) {
    return await apiService.get(`/api/issues/${id}`)
  },

  // Create new issue (matches backend POST /api/issues)
  async createIssue(issueData) {
    // Ensure all required fields are set with defaults
    const completeIssueData = {
      title: issueData.title,
      description: issueData.description,
      category: issueData.category,
      latitude: issueData.latitude || null,
      longitude: issueData.longitude || null,
      critical: issueData.critical || false,
      voteCount: 0,
      status: "OPEN", // Default status
      imageUrl: null, // Will be set after upload if image provided
      // createdBy will be set by backend
      // assignedNgo will be null initially
      // createdAt and updatedAt will be set by backend
    }
    
    return await apiService.post("/api/issues", completeIssueData)
  },

  // Create issue with image upload (backend requires two steps)
  async createIssueWithImage(issueData, imageFile) {
    // Step 1: Create the issue first (backend expects JSON, not FormData)
    const createdIssue = await this.createIssue(issueData)
    
    // Step 2: If there's an image, upload it to the created issue
    if (imageFile && createdIssue.id) {
      const imageResponse = await this.uploadIssueImage(createdIssue.id, imageFile)
      // Return the issue with the updated image URL
      return {
        ...createdIssue,
        imageUrl: imageResponse.imageUrl
      }
    }
    
    return createdIssue
  },

  // Update issue (matches backend PUT /api/issues/{id})
  async updateIssue(id, issueData) {
    return await apiService.put(`/api/issues/${id}`, issueData)
  },

  // Update issue status (matches backend PATCH /api/issues/{id}/status)
  async updateIssueStatus(id, status) {
    return await apiService.patch(`/api/issues/${id}/status?status=${status}`)
  },

  // Upload image for existing issue (matches backend POST /api/issues/{id}/image)
  async uploadIssueImage(id, imageFile) {
    const formData = new FormData()
    formData.append('image', imageFile)

    return await apiService.post(`/api/issues/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // Delete issue (matches backend DELETE /api/issues/{id})
  async deleteIssue(id) {
    return await apiService.delete(`/api/issues/${id}`)
  },

  // Get my created issues (matches backend GET /api/issues/my-issues)
  async getMyIssues() {
    return await apiService.get(`/api/issues/my-issues`)
  },

  // Get nearby issues (matches backend GET /api/issues/nearby)
  async getNearbyIssues(lat, lng, radius = 10) {
    return await apiService.get(`/api/issues/nearby?lat=${lat}&lng=${lng}&radius=${radius}`)
  },

  // Get nearby issues with filters (matches backend GET /api/issues/nearby/filtered)
  async getNearbyIssuesWithFilters(lat, lng, radius = 10, category = null, critical = null) {
    let url = `/api/issues/nearby/filtered?lat=${lat}&lng=${lng}&radius=${radius}`
    if (category) url += `&category=${category}`
    if (critical !== null) url += `&critical=${critical}`
    return await apiService.get(url)
  },

  // Get distance to issue (matches backend GET /api/issues/{id}/distance)
  async getDistanceToIssue(id, userLat, userLng) {
    return await apiService.get(`/api/issues/${id}/distance?lat=${userLat}&lng=${userLng}`)
  },

  // === VOTING ENDPOINTS (matches VoteController) ===
  
  // Cast vote on issue (matches backend POST /api/issues/{issueId}/vote)
  async voteOnIssue(issueId, voteType = "UPVOTE") {
    return await apiService.post(`/api/issues/${issueId}/vote`, { type: voteType })
  },

  // Remove vote from issue (matches backend DELETE /api/issues/{issueId}/vote)
  async removeVote(issueId) {
    return await apiService.delete(`/api/issues/${issueId}/vote`)
  },

  // Get vote summary for issue (matches backend GET /api/issues/{issueId}/votes/summary)
  async getVoteSummary(issueId) {
    return await apiService.get(`/api/issues/${issueId}/votes/summary`)
  },

  // Get all votes for issue (matches backend GET /api/issues/{issueId}/votes)
  async getIssueVotes(issueId) {
    return await apiService.get(`/api/issues/${issueId}/votes`)
  },

  // Get current user's voting history (matches backend GET /api/issues/votes/my-votes)
  async getMyVotes() {
    return await apiService.get(`/api/issues/votes/my-votes`)
  }
}
