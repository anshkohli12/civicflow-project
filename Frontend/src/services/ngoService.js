const API_BASE_URL = 'http://localhost:8080'
const API_BASE = `${API_BASE_URL}/api/ngo`

class NgoService {
  // Get token from localStorage
  getToken() {
    const user = JSON.parse(localStorage.getItem('user'))
    return user?.token
  }

  // Get authorization headers
  getHeaders() {
    const token = this.getToken()
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    }
  }

  // Get assigned issues for the current NGO
  async getMyAssignedIssues(page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc', status = '') {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sortBy,
        sortDir
      })
      
      if (status) {
        params.append('status', status)
      }

      const url = `${API_BASE}/my-issues?${params}`
      console.log('NGO Service: Fetching issues from:', url)
      console.log('NGO Service: Headers:', this.getHeaders())

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders()
      })

      console.log('NGO Service: Response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('NGO Service: Error response:', errorText)
        
        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch (e) {
          errorData = { message: errorText }
        }
        
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('NGO Service: Successfully fetched', data.totalElements || data.length, 'issues')
      return data
    } catch (error) {
      console.error('Error fetching assigned issues:', error)
      throw error
    }
  }

  // Update issue status
  async updateIssueStatus(issueId, status) {
    try {
      const response = await fetch(`${API_BASE}/issues/${issueId}/status`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({ status })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      return await response.text() // Backend returns a simple string message
    } catch (error) {
      console.error('Error updating issue status:', error)
      throw error
    }
  }

  // Get specific issue details
  async getIssueDetails(issueId) {
    try {
      const response = await fetch(`${API_BASE}/issues/${issueId}`, {
        method: 'GET',
        headers: this.getHeaders()
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching issue details:', error)
      throw error
    }
  }

  // Get NGO dashboard stats
  async getDashboardStats() {
    try {
      // Since there's no specific stats endpoint, calculate from issues
      const issuesData = await this.getMyAssignedIssues(0, 1000) // Get all issues for stats
      const issues = issuesData.content || []
      
      return {
        totalAssigned: issues.length,
        pending: issues.filter(issue => issue.status === 'ASSIGNED').length,
        inProgress: issues.filter(issue => issue.status === 'IN_PROGRESS').length,
        resolved: issues.filter(issue => issue.status === 'RESOLVED').length
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      // Return default stats on error
      return {
        totalAssigned: 0,
        pending: 0,
        inProgress: 0,
        resolved: 0
      }
    }
  }
}

export const ngoService = new NgoService()
export default ngoService