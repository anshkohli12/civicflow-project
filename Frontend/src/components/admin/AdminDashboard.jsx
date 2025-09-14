import LoadingSpinner from "../common/LoadingSpinner"
import { formatRelativeTime } from "../../utils/helpers"
import { TrendingUp, Users, BarChart3, Activity, CheckCircle, Clock } from "lucide-react"

const AdminDashboard = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <LoadingSpinner size="lg" />
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  if (!stats || !stats.growth) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <p className="text-gray-500">Unable to load dashboard data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Growth Metrics */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center space-x-2 mb-6">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <h3 className="text-xl font-bold text-slate-900">Growth Metrics</h3>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-blue-900">User Growth</p>
              <p className="text-2xl font-bold text-blue-600">+{stats.growth.userGrowth || 0}%</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>

          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-green-900">Resolution Rate</p>
              <p className="text-2xl font-bold text-green-600">{stats.growth.resolutionRate || 0}%</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>

          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-purple-900">Avg Resolution Time</p>
              <p className="text-2xl font-bold text-purple-600">{stats.growth.avgResolutionTime || 0} days</p>
            </div>
            <Clock className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Issue Categories */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center space-x-2 mb-6">
          <BarChart3 className="h-5 w-5 text-slate-600" />
          <h3 className="text-xl font-bold text-slate-900">Issue Categories</h3>
        </div>

        <div className="space-y-4">
          {stats.categories.map((category, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-900">{category.name}</span>
                  <span className="text-sm text-slate-600">{category.count}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center space-x-2 mb-6">
          <Activity className="h-5 w-5 text-slate-600" />
          <h3 className="text-xl font-bold text-slate-900">Recent Activity</h3>
        </div>

        <div className="space-y-4">
          {stats.recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4 p-4 bg-slate-50 rounded-lg">
              <div
                className={`w-3 h-3 rounded-full mt-2 ${
                  activity.type === "issue_resolved"
                    ? "bg-green-500"
                    : activity.type === "user_registered"
                      ? "bg-blue-500"
                      : activity.type === "issue_reported"
                        ? "bg-amber-500"
                        : "bg-slate-500"
                }`}
              />
              <div className="flex-1">
                <p className="text-slate-900 font-medium">{activity.message}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-slate-600">by {activity.user}</span>
                  <span className="text-sm text-slate-500">{formatRelativeTime(activity.timestamp)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
