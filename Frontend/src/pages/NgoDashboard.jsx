import { useState, useEffect } from "react"
import { Building2, FileText, Clock, CheckCircle, TrendingUp, MapPin, Eye, X, ExternalLink, Calendar, User, Tag, AlertTriangle, ChevronDown } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { toast } from "react-toastify"
import LoadingSpinner from "../components/common/LoadingSpinner"
import ngoService from "../services/ngoService"

const NgoDashboard = () => {
  const { user } = useAuth()
  const [assignedIssues, setAssignedIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedIssue, setSelectedIssue] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [stats, setStats] = useState({
    totalAssigned: 0,
    inProgress: 0,
    resolved: 0,
    pending: 0
  })

  // Fetch assigned issues from API
  useEffect(() => {
    const fetchAssignedIssues = async () => {
      try {
        setLoading(true)
        
        // Fetch real data from API
        const response = await ngoService.getMyAssignedIssues()
        const issues = response.content || []
        
        console.log('NGO Dashboard: Fetched issues:', issues)
        console.log('NGO Dashboard: Issue statuses:', issues.map(i => ({ id: i.id, title: i.title, status: i.status })))
        
        // If no issues from API, add some test data for development
        if (issues.length === 0) {
          console.log('NGO Dashboard: No issues from API, adding test data')
          const testIssues = [
            {
              id: 1,
              title: "Test Issue - Street Light Broken",
              description: "The streetlight on Main Street is not working",
              category: "Infrastructure",
              status: "ASSIGNED",
              latitude: 40.7128,
              longitude: -74.0060,
              createdAt: "2024-01-15T10:30:00Z",
              updatedAt: "2024-01-15T10:30:00Z",
              createdBy: "test_user",
              critical: false,
              voteCount: 5
            },
            {
              id: 2,
              title: "Test Issue - Pothole on Highway",
              description: "Large pothole causing traffic issues",
              category: "Roads",
              status: "IN_PROGRESS",
              latitude: 40.7589,
              longitude: -73.9851,
              createdAt: "2024-01-14T14:20:00Z",
              updatedAt: "2024-01-16T09:15:00Z",
              createdBy: "another_user",
              critical: true,
              voteCount: 12
            }
          ]
          setAssignedIssues(testIssues)
        } else {
          setAssignedIssues(issues)
        }
        
        // Calculate stats from fetched issues
        const newStats = {
          totalAssigned: issues.length,
          inProgress: issues.filter(issue => issue.status === "IN_PROGRESS").length,
          resolved: issues.filter(issue => issue.status === "RESOLVED").length,
          pending: issues.filter(issue => issue.status === "ASSIGNED").length
        }
        setStats(newStats)
        
      } catch (error) {
        console.error("Error fetching assigned issues:", error)
        toast.error("Failed to load assigned issues. Please try again.")
        
        // Set empty state on error
        setAssignedIssues([])
        setStats({
          totalAssigned: 0,
          inProgress: 0,
          resolved: 0,
          pending: 0
        })
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchAssignedIssues()
    }
  }, [user])

  const handleStatusUpdate = async (issueId, newStatus) => {
    console.log('=== STATUS UPDATE CALLED ===')
    console.log('Issue ID:', issueId)
    console.log('New Status:', newStatus)
    console.log('Updating Status state:', updatingStatus)
    
    try {
      setUpdatingStatus(true)
      
      // Call API to update issue status
      console.log('Calling ngoService.updateIssueStatus...')
      await ngoService.updateIssueStatus(issueId, newStatus)
      console.log('NGO Dashboard: Status update successful')
      
      // Update local state
      setAssignedIssues(prev => 
        prev.map(issue => 
          issue.id === issueId 
            ? { ...issue, status: newStatus, updatedAt: new Date().toISOString() }
            : issue
        )
      )
      
      // Update selected issue if it's the one being updated
      if (selectedIssue && selectedIssue.id === issueId) {
        setSelectedIssue(prev => ({
          ...prev,
          status: newStatus,
          updatedAt: new Date().toISOString()
        }))
      }
      
      // Update stats
      const updatedIssues = assignedIssues.map(issue => 
        issue.id === issueId ? { ...issue, status: newStatus } : issue
      )
      
      const newStats = {
        totalAssigned: updatedIssues.length,
        inProgress: updatedIssues.filter(issue => issue.status === "IN_PROGRESS").length,
        resolved: updatedIssues.filter(issue => issue.status === "RESOLVED").length,
        pending: updatedIssues.filter(issue => issue.status === "ASSIGNED").length
      }
      setStats(newStats)
      
      toast.success(`Issue status updated to ${newStatus.replace('_', ' ')}`)
    } catch (error) {
      console.error("Error updating issue status:", error)
      toast.error("Failed to update issue status. Please try again.")
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleViewDetails = async (issue) => {
    try {
      setSelectedIssue(issue)
      setIsModalOpen(true)
      
      // Optionally fetch more detailed data
      // const detailedIssue = await ngoService.getIssueDetails(issue.id)
      // setSelectedIssue(detailedIssue)
    } catch (error) {
      console.error("Error fetching issue details:", error)
      toast.error("Failed to load issue details")
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedIssue(null)
  }

  const getStatusOptions = (currentStatus) => {
    const statusFlow = {
      'ASSIGNED': [
        { 
          value: 'IN_PROGRESS', 
          label: 'Start Working', 
          description: 'Begin work on this issue',
          icon: <Clock className="h-4 w-4" />, 
          color: 'bg-blue-100 text-blue-600' 
        },
        { 
          value: 'RESOLVED', 
          label: 'Mark as Resolved', 
          description: 'Complete and close this issue',
          icon: <CheckCircle className="h-4 w-4" />, 
          color: 'bg-green-100 text-green-600' 
        }
      ],
      'IN_PROGRESS': [
        { 
          value: 'ASSIGNED', 
          label: 'Back to Assigned', 
          description: 'Return to assigned status',
          icon: <FileText className="h-4 w-4" />, 
          color: 'bg-yellow-100 text-yellow-600' 
        },
        { 
          value: 'RESOLVED', 
          label: 'Mark as Resolved', 
          description: 'Complete and close this issue',
          icon: <CheckCircle className="h-4 w-4" />, 
          color: 'bg-green-100 text-green-600' 
        }
      ],
      'RESOLVED': [
        { 
          value: 'IN_PROGRESS', 
          label: 'Reopen Issue', 
          description: 'Continue working on this issue',
          icon: <Clock className="h-4 w-4" />, 
          color: 'bg-blue-100 text-blue-600' 
        }
      ]
    }
    return statusFlow[currentStatus] || []
  }

  const getStatusDisplay = (status) => {
    const statusConfig = {
      'ASSIGNED': 'Assigned',
      'IN_PROGRESS': 'In Progress', 
      'RESOLVED': 'Resolved'
    }
    return statusConfig[status] || status
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "ASSIGNED":
        return "bg-yellow-100 text-yellow-800"
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800"
      case "RESOLVED":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Building2 className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">NGO Dashboard</h1>
              <p className="text-gray-600">
                Welcome back, {user?.firstName} {user?.lastName}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileText className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Assigned</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalAssigned}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.pending}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">In Progress</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.inProgress}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Resolved</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.resolved}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Assigned Issues */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Assigned Issues</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Issues assigned to your organization for resolution
            </p>
          </div>
          
          {assignedIssues.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No assigned issues</h3>
              <p className="mt-1 text-sm text-gray-500">
                You haven't been assigned any issues yet.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {assignedIssues.map((issue) => (
                <li key={issue.id} className="px-6 py-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            issue.critical ? 'bg-red-500' : 'bg-gray-400'
                          }`}></div>
                          <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600 cursor-pointer"
                              onClick={() => handleViewDetails(issue)}>
                            {issue.title}
                          </h3>
                        </div>
                        <div className="flex items-center space-x-2">
                          {issue.critical && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              CRITICAL
                            </span>
                          )}
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(issue.status)}`}>
                            {issue.status.replace("_", " ")}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 line-clamp-2">{issue.description}</p>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center">
                          <Tag className="h-4 w-4 mr-1" />
                          <span>{issue.category}</span>
                        </div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          <span>{issue.createdBy}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{formatDate(issue.createdAt)}</span>
                        </div>
                        {issue.voteCount > 0 && (
                          <div className="flex items-center">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            <span>{issue.voteCount} votes</span>
                          </div>
                        )}
                        {issue.latitude && issue.longitude && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>Location available</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="mt-4 flex flex-wrap gap-3">
                    {/* Status Update Select Dropdown */}
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">Update Status:</label>
                      <select
                        value={issue.status}
                        onChange={(e) => {
                          if (e.target.value !== issue.status) {
                            handleStatusUpdate(issue.id, e.target.value)
                          }
                        }}
                        disabled={updatingStatus}
                        className="block w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="ASSIGNED">Assigned</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                      </select>
                    </div>

                    {/* Other Action Buttons */}
                    <button 
                      onClick={() => handleViewDetails(issue)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </button>
                    
                    {issue.latitude && issue.longitude && (
                      <button 
                        onClick={() => window.open(`https://maps.google.com?q=${issue.latitude},${issue.longitude}`, '_blank')}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Location
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Issue Detail Modal */}
      {isModalOpen && selectedIssue && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  selectedIssue.critical ? 'bg-red-500' : 'bg-gray-400'
                }`}></div>
                <h3 className="text-xl font-semibold text-gray-900">Issue Details</h3>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="py-6 space-y-6">
              {/* Title and Status */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-medium text-gray-900">{selectedIssue.title}</h4>
                  <div className="flex items-center space-x-2">
                    {selectedIssue.critical && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        CRITICAL
                      </span>
                    )}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(selectedIssue.status)}`}>
                      {selectedIssue.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Description</h5>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">{selectedIssue.description}</p>
              </div>

              {/* Issue Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Tag className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-500">Category:</span>
                    <span className="ml-2 font-medium">{selectedIssue.category}</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-500">Reported by:</span>
                    <span className="ml-2 font-medium">{selectedIssue.createdBy}</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-500">Created:</span>
                    <span className="ml-2 font-medium">{formatDate(selectedIssue.createdAt)}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-500">Votes:</span>
                    <span className="ml-2 font-medium">{selectedIssue.voteCount || 0}</span>
                  </div>
                  
                  {selectedIssue.latitude && selectedIssue.longitude && (
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-500">Location:</span>
                      <button 
                        onClick={() => window.open(`https://maps.google.com?q=${selectedIssue.latitude},${selectedIssue.longitude}`, '_blank')}
                        className="ml-2 text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View on Map
                      </button>
                    </div>
                  )}
                  
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-500">Last Updated:</span>
                    <span className="ml-2 font-medium">{formatDate(selectedIssue.updatedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Image */}
              {selectedIssue.imageUrl && (
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Issue Image</h5>
                  <img 
                    src={selectedIssue.imageUrl} 
                    alt="Issue" 
                    className="w-full max-w-md h-48 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="flex space-x-3">
                {selectedIssue.status === "ASSIGNED" && (
                  <button
                    onClick={() => handleStatusUpdate(selectedIssue.id, "IN_PROGRESS")}
                    disabled={updatingStatus}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    {updatingStatus ? 'Updating...' : 'Start Working'}
                  </button>
                )}
                
                {selectedIssue.status === "IN_PROGRESS" && (
                  <button
                    onClick={() => handleStatusUpdate(selectedIssue.id, "RESOLVED")}
                    disabled={updatingStatus}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {updatingStatus ? 'Updating...' : 'Mark Resolved'}
                  </button>
                )}
              </div>
              
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NgoDashboard