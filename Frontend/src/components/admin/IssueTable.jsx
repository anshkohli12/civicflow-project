"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import LoadingSpinner from "../common/LoadingSpinner"
import Button from "../common/Button"
import StatusBadge from "../issues/StatusBadge"
import PriorityBadge from "../issues/PriorityBadge"
import CategoryIcon from "../issues/CategoryIcon"
import { formatDate, formatRelativeTime } from "../../utils/helpers"
import { MoreHorizontal, ExternalLink, Edit, User, MessageSquare, ThumbsUp } from "lucide-react"

const IssueTable = ({ issues, loading, selectedIssues, onIssueSelect, onSelectAll, onIssueUpdate }) => {
  const [editingIssue, setEditingIssue] = useState(null)

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const handleStatusChange = (issue, newStatus) => {
    onIssueUpdate(issue.id, {
      status: newStatus,
      updatedAt: new Date(),
    })
  }

  const handlePriorityChange = (issue, newPriority) => {
    onIssueUpdate(issue.id, {
      priority: newPriority,
      updatedAt: new Date(),
    })
  }

  const allSelected = issues.length > 0 && selectedIssues.length === issues.length
  const someSelected = selectedIssues.length > 0 && selectedIssues.length < issues.length

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = someSelected
                  }}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Issue</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Engagement
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {issues.map((issue) => (
              <tr key={issue.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedIssues.includes(issue.id)}
                    onChange={(e) => onIssueSelect(issue.id, e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-start space-x-3">
                    <CategoryIcon category={issue.category} size="md" />
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/issues/${issue.id}`}
                        className="text-sm font-medium text-slate-900 hover:text-blue-600 transition-colors"
                      >
                        {issue.title}
                      </Link>
                      <p className="text-sm text-slate-500 mt-1 line-clamp-2">{issue.description}</p>
                      <p className="text-xs text-slate-400 mt-1">📍 {issue.location}</p>
                      {issue.assignedTo && (
                        <p className="text-xs text-blue-600 mt-1">Assigned to: {issue.assignedTo}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={issue.status}
                    onChange={(e) => handleStatusChange(issue, e.target.value)}
                    className="text-xs border-0 bg-transparent focus:ring-0 p-0"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                  <StatusBadge status={issue.status} />
                </td>
                <td className="px-6 py-4">
                  <select
                    value={issue.priority}
                    onChange={(e) => handlePriorityChange(issue, e.target.value)}
                    className="text-xs border-0 bg-transparent focus:ring-0 p-0 mb-1"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                  <PriorityBadge priority={issue.priority} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{issue.author.name}</p>
                      <p className="text-xs text-slate-500">{issue.author.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{issue.votes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{issue.comments}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-900">{formatDate(issue.createdAt)}</div>
                  <div className="text-xs text-slate-500">Updated {formatRelativeTime(issue.updatedAt)}</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Link to={`/issues/${issue.id}`}>
                      <Button variant="ghost" size="sm" className="text-slate-600 hover:text-blue-600">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {issues.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500">No issues found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}

export default IssueTable
