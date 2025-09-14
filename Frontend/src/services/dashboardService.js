import { apiService } from './apiService'

export const dashboardService = {
  // Get user dashboard statistics
  async getUserStats() {
    try {
      const response = await apiService.get('/api/issues/dashboard/stats')
      return response // apiService already returns response.data
    } catch (error) {
      console.error('Error fetching user dashboard stats:', error)
      
      // Fallback: Calculate stats from my-issues if dashboard endpoint fails
      try {
        console.log('Trying fallback with my-issues endpoint...')
        const myIssues = await this.getMyIssues()
        
        const stats = {
          myIssues: myIssues.length,
          issuesResolved: myIssues.filter(issue => issue.status === 'RESOLVED').length,
          pendingIssues: myIssues.filter(issue => issue.status === 'OPEN').length,
          votesReceived: myIssues.reduce((total, issue) => total + (issue.voteCount || 0), 0),
          issuesThisWeek: myIssues.filter(issue => {
            const oneWeekAgo = new Date()
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
            return new Date(issue.createdAt) > oneWeekAgo
          }).length
        }
        
        console.log('Fallback stats calculated:', stats)
        return stats
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError)
        throw error
      }
    }
  },

  // Get user's recent issues for dashboard
  async getUserRecentIssues() {
    try {
      const response = await apiService.get('/api/issues/dashboard/recent')
      return response // apiService already returns response.data
    } catch (error) {
      console.error('Error fetching user recent issues:', error)
      
      // Fallback: Get from my-issues and take last 5
      try {
        console.log('Trying fallback with my-issues endpoint...')
        const myIssues = await this.getMyIssues()
        
        // Sort by createdAt and take last 5
        const recentIssues = myIssues
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
        
        console.log('Fallback recent issues:', recentIssues)
        return recentIssues
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError)
        throw error
      }
    }
  },

  // Get user's own issues
  async getMyIssues() {
    try {
      const response = await apiService.get('/api/issues/my-issues')
      return response
    } catch (error) {
      console.error('Error fetching my issues:', error)
      throw error
    }
  }
}
