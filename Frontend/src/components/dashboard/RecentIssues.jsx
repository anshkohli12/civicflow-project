import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { dashboardService } from "../../services/dashboardService"
import { formatRelativeTime } from "../../utils/helpers"
import { ArrowRight, MapPin, ThumbsUp, MessageSquare } from "lucide-react"

const RecentIssues = () => {
  const { user } = useAuth()
  const [recentIssues, setRecentIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMyIssues = async () => {
      try {
        setLoading(true)
        setError(null)
        
        if (!user) {
          setError('User not authenticated')
          setRecentIssues([])
          return
        }
        
        // Get all user issues
        const issues = await dashboardService.getMyIssues()
        console.log('My issues loaded:', issues.length, 'issues')
        setRecentIssues(issues || [])
        
      } catch (err) {
        console.error('Error fetching my issues:', err)
        setError(`Failed to load your issues: ${err.message}`)
        setRecentIssues([])
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchMyIssues()
    }
  }, [user])

  const getStatusColor = (status) => {
    switch (status) {
      case "OPEN":
        return "bg-amber-100 text-amber-800"
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800"
      case "RESOLVED":
        return "bg-green-100 text-green-800"
      case "CLOSED":
        return "bg-slate-100 text-slate-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "OPEN":
        return "Open"
      case "IN_PROGRESS":
        return "In Progress"
      case "RESOLVED":
        return "Resolved"
      case "CLOSED":
        return "Closed"
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">My Issues</h2>
          <div className="w-24 h-8 bg-slate-200 rounded-lg animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-50 rounded-xl p-6 animate-pulse">
              <div className="flex space-x-3 mb-3">
                <div className="h-4 bg-slate-200 rounded w-20"></div>
                <div className="h-4 bg-slate-200 rounded w-16"></div>
              </div>
              <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2 mb-3"></div>
              <div className="h-4 bg-slate-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">My Issues</h2>
          <Link 
            to="/issues" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-all"
          >
            <span>View all issues</span>
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 font-bold">!</span>
            </div>
            <div>
              <h3 className="text-red-800 font-semibold mb-1">Unable to load issues</h3>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h2 className="text-2xl font-bold text-slate-900">My Issues</h2>
          {!loading && recentIssues && (
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              {recentIssues.length} total
            </span>
          )}
        </div>
        <Link 
          to="/issues" 
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-all"
        >
          <span>View all issues</span>
          <ArrowRight className="h-4 w-4 ml-2" />
        </Link>
      </div>

      <div className="space-y-4">
        {!recentIssues || recentIssues.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
            {loading ? (
              <p className="text-slate-500">Loading your issues...</p>
            ) : error ? (
              <div>
                <p className="text-red-600 mb-2 font-semibold">Unable to load issues</p>
                <p className="text-sm text-red-500">{error}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">📝</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">No issues yet</h3>
                  <p className="text-slate-500 mb-4">You haven't created any issues yet. Start making a difference in your community!</p>
                  <Link 
                    to="/issues/create" 
                    className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Create your first issue
                  </Link>
                </div>
              </div>
            )}
          </div>
        ) : (
          recentIssues.map((issue) => (
            <div
              key={issue.id}
              className="group bg-slate-50 hover:bg-white rounded-xl shadow-sm border border-slate-200 hover:border-blue-200 p-4 lg:p-6 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-3 flex-wrap">
                    <span className="text-xs font-medium text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200 whitespace-nowrap">
                      {issue.category}
                    </span>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap ${getStatusColor(issue.status)}`}>
                      {getStatusText(issue.status)}
                    </span>
                    {issue.critical && (
                      <span className="text-xs font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full whitespace-nowrap border border-red-200">
                        🚨 Critical
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg lg:text-xl font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">
                    <Link to={`/issues/${issue.id}`} className="hover:underline">
                      {issue.title}
                    </Link>
                  </h3>
                  <p className="text-slate-600 text-sm mb-3 line-clamp-2 leading-relaxed">{issue.description}</p>
                  <div className="flex items-center text-slate-500 text-sm mb-3">
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0 text-slate-400" />
                    <span className="truncate">
                      {issue.latitude && issue.longitude 
                        ? `${issue.latitude.toFixed(4)}, ${issue.longitude.toFixed(4)}`
                        : 'Location not specified'
                      }
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div className="flex items-center space-x-6 text-sm text-slate-600">
                  <div className="flex items-center space-x-2 bg-white px-3 py-1 rounded-full border border-slate-200">
                    <ThumbsUp className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">{issue.voteCount || 0}</span>
                    <span className="text-slate-500">votes</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-slate-500">
                    <span>Created by you</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-slate-500">{formatRelativeTime(new Date(issue.createdAt))}</span>
                  <Link 
                    to={`/issues/${issue.id}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg transition-all"
                  >
                    View →
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default RecentIssues
