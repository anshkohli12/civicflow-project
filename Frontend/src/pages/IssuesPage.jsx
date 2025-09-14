"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import IssueList from "../components/issues/IssueList"
import IssueFilters from "../components/issues/IssueFilters"
import SearchBar from "../components/common/SearchBar"
import Button from "../components/common/Button"
import { Plus, Map, List } from "lucide-react"
import { issueService } from "../services/issueService"
import { useAuth } from "../context/AuthContext"

const IssuesPage = () => {
  const { user } = useAuth()
  const [issues, setIssues] = useState([])
  const [filteredIssues, setFilteredIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState("list") // 'list' or 'map'
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    status: "",
    critical: null,
    sortBy: "newest",
  })

  // Load issues from backend
  useEffect(() => {
    loadIssues()
  }, [])

  const loadIssues = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await issueService.getIssues()
      setIssues(response || [])
      setFilteredIssues(response || [])
    } catch (err) {
      console.error('Error loading issues:', err)
      setError('Failed to load issues. Please try again.')
      setIssues([])
      setFilteredIssues([])
    } finally {
      setLoading(false)
    }
  }

  // Apply filters and search to issues
  useEffect(() => {
    applyFilters()
  }, [issues, filters])

  const applyFilters = () => {
    let filtered = [...issues]

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(
        (issue) =>
          issue.title?.toLowerCase().includes(searchTerm) ||
          issue.description?.toLowerCase().includes(searchTerm) ||
          issue.category?.toLowerCase().includes(searchTerm)
      )
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter((issue) => issue.category === filters.category)
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter((issue) => issue.status === filters.status)
    }

    // Critical filter
    if (filters.critical !== null) {
      filtered = filtered.filter((issue) => issue.critical === filters.critical)
    }

    // Sort issues
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt)
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt)
        case "mostVotes":
          return (b.voteCount || 0) - (a.voteCount || 0)
        case "leastVotes":
          return (a.voteCount || 0) - (b.voteCount || 0)
        case "title":
          return a.title?.localeCompare(b.title || "") || 0
        default:
          return 0
      }
    })

    setFilteredIssues(filtered)
  }
  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const handleVote = async (issueId, voteType) => {
    try {
      await issueService.voteOnIssue(issueId, voteType)
      // Reload issues to get updated vote counts
      await loadIssues()
    } catch (err) {
      console.error('Error voting on issue:', err)
      // You could show a toast notification here
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading issues...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600">{error}</p>
          </div>
          <Button onClick={loadIssues} className="bg-blue-600 hover:bg-blue-700 text-white">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Community Issues</h1>
            <p className="text-slate-600">
              Browse and vote on issues reported by your community. 
              {issues.length > 0 && ` Found ${issues.length} issues.`}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <div className="flex items-center bg-white rounded-lg border border-slate-200 p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list" ? "bg-blue-100 text-blue-600" : "text-slate-600 hover:text-slate-900"
                }`}
                title="List View"
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "map" ? "bg-blue-100 text-blue-600" : "text-slate-600 hover:text-slate-900"
                }`}
                title="Map View"
              >
                <Map className="h-4 w-4" />
              </button>
            </div>
            {user && (
              <Link to="/issues/new">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Report Issue
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar
            value={filters.search}
            onChange={(value) => handleFilterChange({ search: value })}
            placeholder="Search issues by title, description, or category..."
          />
        </div>

        {/* Statistics */}
        {issues.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="text-2xl font-bold text-slate-900">{issues.length}</div>
              <div className="text-sm text-slate-600">Total Issues</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="text-2xl font-bold text-green-600">
                {issues.filter(issue => issue.status === 'RESOLVED').length}
              </div>
              <div className="text-sm text-slate-600">Resolved</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="text-2xl font-bold text-yellow-600">
                {issues.filter(issue => issue.status === 'IN_PROGRESS').length}
              </div>
              <div className="text-sm text-slate-600">In Progress</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="text-2xl font-bold text-red-600">
                {issues.filter(issue => issue.critical === true).length}
              </div>
              <div className="text-sm text-slate-600">Critical</div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <IssueFilters 
              filters={filters} 
              onFilterChange={handleFilterChange} 
              issueCount={filteredIssues.length}
              totalCount={issues.length}
            />
          </div>

          {/* Issues List */}
          <div className="lg:col-span-3">
            {viewMode === "list" ? (
              <IssueList
                issues={filteredIssues}
                loading={loading}
                onVote={handleVote}
                onRefresh={loadIssues}
              />
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
                <Map className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Map View</h3>
                <p className="text-slate-600 mb-4">
                  Map view will show issue locations with interactive markers.
                </p>
                <Button 
                  onClick={() => setViewMode("list")}
                  variant="outline"
                >
                  Switch to List View
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Empty State */}
        {!loading && issues.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-w-md mx-auto">
              <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No Issues Found</h3>
              <p className="text-slate-600 mb-4">
                Be the first to report an issue in your community.
              </p>
              {user && (
                <Link to="/issues/new">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Report First Issue
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default IssuesPage
