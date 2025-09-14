import { useState, useEffect } from "react"
import { adminService } from "../../services/adminService"
import Card from "../common/Card"
import Button from "../common/Button"
import LoadingSpinner from "../common/LoadingSpinner"
import { 
  Building, 
  User, 
  MapPin, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  X,
  Send,
  Search,
  Filter,
  ArrowRight
} from "lucide-react"
import { toast } from "react-toastify"

const IssueAssignment = () => {
  const [issues, setIssues] = useState([])
  const [ngos, setNgos] = useState([])
  const [loading, setLoading] = useState(true)
  const [assigning, setAssigning] = useState(false)
  const [selectedIssue, setSelectedIssue] = useState(null)
  const [selectedNgo, setSelectedNgo] = useState("")
  const [assignmentNotes, setAssignmentNotes] = useState("")
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    search: ""
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      console.log("🔄 Loading issues and NGOs from database...")
      
      const [issuesResponse, ngosResponse] = await Promise.all([
        adminService.getAllIssues(0, 50, "createdAt", "desc"),
        adminService.getAllNGOs()
      ])
      
      console.log("✅ Issues loaded:", issuesResponse)
      console.log("✅ NGOs loaded:", ngosResponse)
      
      // Handle issues response
      const issuesData = issuesResponse.content || issuesResponse || []
      setIssues(issuesData)
      
      // Handle NGOs response - ensure we get the array properly
      const ngosData = Array.isArray(ngosResponse) ? ngosResponse : (ngosResponse.content || ngosResponse.data || [])
      setNgos(ngosData)
      
      console.log(`📊 Loaded ${issuesData.length} issues and ${ngosData.length} NGOs`)
      
      if (ngosData.length === 0) {
        toast.warning("No NGOs found in the database. Please register some NGOs first.")
      }
      
      if (issuesData.length === 0) {
        toast.info("No issues found in the database.")
      }
      
    } catch (error) {
      console.error("❌ Failed to load data:", error)
      toast.error("Failed to load data from database: " + error.message)
      
      // Don't set mock data - leave arrays empty to show actual state
      setIssues([])
      setNgos([])
    } finally {
      setLoading(false)
    }
  }

  const handleAssignIssue = async () => {
    if (!selectedIssue || !selectedNgo) {
      toast.error("Please select both an issue and an NGO")
      return
    }

    setAssigning(true)
    try {
      await adminService.assignIssueToNGO(selectedIssue.id, selectedNgo, assignmentNotes)
      
      // Update the issue status locally
      setIssues(prev => 
        prev.map(issue => 
          issue.id === selectedIssue.id 
            ? { ...issue, status: "ASSIGNED", assignedNgo: ngos.find(ngo => ngo.id.toString() === selectedNgo) }
            : issue
        )
      )
      
      toast.success("Issue assigned successfully!")
      setSelectedIssue(null)
      setSelectedNgo("")
      setAssignmentNotes("")
    } catch (error) {
      console.error("Failed to assign issue:", error)
      toast.error("Failed to assign issue: " + error.message)
    } finally {
      setAssigning(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "OPEN": return "text-blue-600 bg-blue-50 border-blue-200"
      case "ASSIGNED": return "text-purple-600 bg-purple-50 border-purple-200"
      case "IN_PROGRESS": return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "RESOLVED": return "text-green-600 bg-green-50 border-green-200"
      case "REJECTED": return "text-red-600 bg-red-50 border-red-200"
      default: return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "HIGH": return "text-red-600"
      case "MEDIUM": return "text-yellow-600" 
      case "LOW": return "text-green-600"
      default: return "text-gray-600"
    }
  }

  const filteredIssues = issues.filter(issue => {
    const matchesStatus = !filters.status || issue.status === filters.status
    const matchesCategory = !filters.category || issue.category === filters.category
    const matchesSearch = !filters.search || 
      issue.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      issue.description.toLowerCase().includes(filters.search.toLowerCase())
    
    return matchesStatus && matchesCategory && matchesSearch
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Issue Assignment</h2>
          <p className="text-gray-600">Assign community issues to NGO partners</p>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <span className="text-gray-500">Issues: <span className="font-semibold">{filteredIssues.length}</span></span>
          <span className="text-gray-500">NGOs: <span className="font-semibold">{ngos.length}</span></span>
        </div>
      </div>

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <h3 className="font-medium text-yellow-800 mb-2">🔍 Debug Information</h3>
          <div className="text-xs text-yellow-700 space-y-1">
            <p>Total NGOs loaded: {ngos.length}</p>
            <p>Total Issues loaded: {issues.length}</p>
            <p>API Base URL: {import.meta.env.VITE_API_URL || 'http://localhost:8080'}</p>
            <p>JWT Token: {localStorage.getItem('token') ? '✅ Present' : '❌ Missing'}</p>
            <div className="flex space-x-2 mt-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={async () => {
                  try {
                    console.log("🧪 Testing NGO API directly...")
                    const result = await adminService.getAllNGOs()
                    console.log("🧪 Direct NGO API result:", result)
                    alert(`NGO API Test: ${Array.isArray(result) ? result.length : 'Not array'} NGOs found. Check console for details.`)
                  } catch (error) {
                    console.error("🧪 NGO API test failed:", error)
                    alert(`NGO API Test Failed: ${error.message}`)
                  }
                }}
              >
                Test NGO API
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => loadData()}
              >
                Reload Data
              </Button>
            </div>
            {ngos.length > 0 && (
              <details className="mt-2">
                <summary className="cursor-pointer">View NGO Data</summary>
                <pre className="mt-1 text-xs bg-white p-2 rounded overflow-auto max-h-32">
                  {JSON.stringify(ngos, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </Card>
      )}

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Search issues..."
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Safety">Safety</option>
              <option value="Environment">Environment</option>
              <option value="Transportation">Transportation</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <Button
              onClick={() => setFilters({ status: "", category: "", search: "" })}
              variant="outline"
              className="w-full"
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Issues Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Issues List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Available Issues</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredIssues.map((issue) => (
              <Card
                key={issue.id}
                className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedIssue?.id === issue.id ? "ring-2 ring-green-500 bg-green-50" : ""
                }`}
                onClick={() => setSelectedIssue(issue)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 line-clamp-2">{issue.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(issue.status)}`}>
                    {issue.status.replace("_", " ")}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{issue.description}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{issue.createdBy?.firstName} {issue.createdBy?.lastName}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{issue.createdBy?.city}</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`font-medium ${getPriorityColor(issue.priority)}`}>
                      {issue.priority} Priority
                    </span>
                    <span>👍 {issue.voteCount}</span>
                  </div>
                </div>
                
                <div className="mt-2 text-xs text-gray-500">
                  <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                  <span className="mx-2">•</span>
                  <span>{issue.category}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Assignment Panel */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Assignment Details</h3>
          
          {selectedIssue ? (
            <Card className="p-6 space-y-4">
              {/* Selected Issue */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">Selected Issue</h4>
                <p className="text-sm text-green-800">{selectedIssue.title}</p>
                <div className="flex items-center justify-between mt-2 text-xs text-green-600">
                  <span>Category: {selectedIssue.category}</span>
                  <span>Priority: {selectedIssue.priority}</span>
                </div>
              </div>

              {/* NGO Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign to NGO ({ngos.length} available)
                </label>
                <select
                  value={selectedNgo}
                  onChange={(e) => {
                    console.log("🏢 NGO selected:", e.target.value)
                    const selectedNgoData = ngos.find(n => n.id.toString() === e.target.value)
                    console.log("🏢 Selected NGO data:", selectedNgoData)
                    setSelectedNgo(e.target.value)
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select an NGO...</option>
                  {ngos.map((ngo) => {
                    console.log("🏢 Rendering NGO option:", ngo)
                    return (
                      <option key={ngo.id} value={ngo.id}>
                        {ngo.organizationName || `${ngo.firstName} ${ngo.lastName}`} - @{ngo.username}
                      </option>
                    )
                  })}
                </select>
                {ngos.length === 0 && (
                  <p className="text-sm text-amber-600 mt-1">
                    ⚠️ No NGOs found. Please register some NGOs first.
                  </p>
                )}
              </div>

              {/* Selected NGO Details */}
              {selectedNgo && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  {(() => {
                    const ngo = ngos.find(n => n.id.toString() === selectedNgo)
                    console.log("🏢 Found selected NGO:", ngo)
                    return ngo ? (
                      <div>
                        <h5 className="font-medium text-blue-900 mb-2">
                          {ngo.organizationName || `${ngo.firstName} ${ngo.lastName}'s Organization`}
                        </h5>
                        <div className="text-sm text-blue-800 space-y-1">
                          <p>Contact: {ngo.firstName} {ngo.lastName}</p>
                          <p>Email: {ngo.email}</p>
                          <p>Role: {ngo.role}</p>
                          {ngo.organizationType && <p>Type: {ngo.organizationType}</p>}
                          {ngo.city && <p>Location: {ngo.city}</p>}
                          {ngo.verificationStatus && <p>Status: {ngo.verificationStatus}</p>}
                        </div>
                      </div>
                    ) : (
                      <p className="text-blue-800">NGO details not found</p>
                    )
                  })()}
                </div>
              )}

              {/* Assignment Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignment Notes (Optional)
                </label>
                <textarea
                  value={assignmentNotes}
                  onChange={(e) => setAssignmentNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Add any specific instructions or notes for the NGO..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 pt-4">
                <Button
                  onClick={handleAssignIssue}
                  disabled={!selectedNgo || assigning}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {assigning ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Assign Issue
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedIssue(null)
                    setSelectedNgo("")
                    setAssignmentNotes("")
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="p-8 text-center">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No Issue Selected</h4>
              <p className="text-gray-600">Select an issue from the list to assign it to an NGO partner</p>
            </Card>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{issues.filter(i => i.status === "OPEN").length}</div>
          <div className="text-sm text-gray-600">Open Issues</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{issues.filter(i => i.status === "ASSIGNED").length}</div>
          <div className="text-sm text-gray-600">Assigned Issues</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{issues.filter(i => i.status === "IN_PROGRESS").length}</div>
          <div className="text-sm text-gray-600">In Progress</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{ngos.length}</div>
          <div className="text-sm text-gray-600">Available NGOs</div>
        </Card>
      </div>
    </div>
  )
}

export default IssueAssignment