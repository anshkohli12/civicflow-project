import IssueCard from "./IssueCard"
import LoadingSpinner from "../common/LoadingSpinner"

const IssueList = ({ issues, loading, onVote }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (issues.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
        <div className="text-slate-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">No Issues Found</h3>
        <p className="text-slate-600">No issues match your current filters. Try adjusting your search criteria.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {issues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} onVote={onVote} />
      ))}
    </div>
  )
}

export default IssueList
