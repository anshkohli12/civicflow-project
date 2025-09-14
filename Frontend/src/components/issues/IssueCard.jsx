import { Link } from "react-router-dom"
import StatusBadge from "./StatusBadge"
import CategoryIcon from "./CategoryIcon"
import VoteButton from "./VoteButton"
import { MapPin, MessageSquare, Calendar, User, AlertTriangle } from "lucide-react"
import { formatRelativeTime } from "../../utils/helpers"

const IssueCard = ({ issue, onVote }) => {
  // Handle location display - use coordinates if available
  const getLocationText = () => {
    if (issue.latitude && issue.longitude) {
      return `${issue.latitude.toFixed(4)}, ${issue.longitude.toFixed(4)}`
    }
    return "Location not specified"
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <CategoryIcon category={issue.category} />
            <StatusBadge status={issue.status} />
            {issue.critical && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Critical
              </span>
            )}
          </div>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            <Link to={`/issues/${issue.id}`} className="hover:text-blue-600 transition-colors">
              {issue.title}
            </Link>
          </h3>

          <p className="text-slate-600 mb-4 line-clamp-2">{issue.description}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            {issue.createdBy && (
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{issue.createdBy.username || issue.createdBy.name || 'Anonymous'}</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{getLocationText()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatRelativeTime(issue.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="ml-6 flex items-center space-x-4">
          <VoteButton 
            votes={issue.voteCount || 0} 
            onVote={(voteType) => onVote(issue.id, voteType)} 
            compact={true} 
          />

          <Link
            to={`/issues/${issue.id}`}
            className="flex items-center space-x-1 text-slate-500 hover:text-blue-600 transition-colors"
          >
            <MessageSquare className="h-4 w-4" />
            <span>View</span>
          </Link>
        </div>
      </div>

      {/* Issue Image Preview */}
      {issue.imageUrl && (
        <div className="mt-4">
          <img
            src={issue.imageUrl}
            alt="Issue preview"
            className="w-full h-48 object-cover rounded-lg border border-slate-200"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
        </div>
      )}

      {/* Additional metadata */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Issue #{issue.id}</span>
          {issue.updatedAt && issue.updatedAt !== issue.createdAt && (
            <span>Updated {formatRelativeTime(issue.updatedAt)}</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default IssueCard
