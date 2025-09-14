import { formatRelativeTime } from "../../utils/helpers"
import { ThumbsUp, MessageSquare, FileText, CheckCircle } from "lucide-react"

const ActivityFeed = () => {
  // Mock activity data
  const activities = [
    {
      id: 1,
      type: "vote",
      description: 'You voted on "Broken streetlight on Main Street"',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      icon: ThumbsUp,
      color: "text-green-600 bg-green-100",
    },
    {
      id: 2,
      type: "comment",
      description: 'You commented on "Pothole causing traffic issues"',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      icon: MessageSquare,
      color: "text-blue-600 bg-blue-100",
    },
    {
      id: 3,
      type: "issue",
      description: 'You reported "Graffiti on community center wall"',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      icon: FileText,
      color: "text-purple-600 bg-purple-100",
    },
    {
      id: 4,
      type: "resolved",
      description: 'Your issue "Broken park bench" was resolved',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      icon: CheckCircle,
      color: "text-emerald-600 bg-emerald-100",
    },
    {
      id: 5,
      type: "vote",
      description: 'You voted on "Missing stop sign at intersection"',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      icon: ThumbsUp,
      color: "text-green-600 bg-green-100",
    },
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Activity</h2>

      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-900 font-medium">{activity.description}</p>
                <p className="text-xs text-slate-500 mt-1">{formatRelativeTime(activity.timestamp)}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-200">
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View all activity</button>
      </div>
    </div>
  )
}

export default ActivityFeed
