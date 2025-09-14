import StatsCard from "../dashboard/StatsCard"
import LoadingSpinner from "../common/LoadingSpinner"
import { Users, FileText, CheckCircle, Clock } from "lucide-react"

const AdminStats = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <LoadingSpinner size="lg" />
          </div>
        ))}
      </div>
    )
  }

  if (!stats || !stats.overview || !stats.growth) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <p className="text-gray-500">Unable to load admin statistics</p>
        </div>
      </div>
    )
  }

  const adminStats = [
    {
      title: "Total Users",
      value: (stats.overview.totalUsers || 0).toLocaleString(),
      change: `+${stats.overview.newUsersThisMonth || 0} this month`,
      changeType: "positive",
      icon: Users,
      color: "blue",
    },
    {
      title: "Total Issues",
      value: (stats.overview.totalIssues || 0).toLocaleString(),
      change: `${(stats.growth.issueGrowth || 0) > 0 ? "+" : ""}${stats.growth.issueGrowth || 0}% this month`,
      changeType: (stats.growth.issueGrowth || 0) > 0 ? "positive" : "negative",
      icon: FileText,
      color: "purple",
    },
    {
      title: "Resolved Issues",
      value: (stats.overview.resolvedIssues || 0).toLocaleString(),
      change: `+${stats.overview.issuesResolvedThisMonth || 0} this month`,
      changeType: "positive",
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "Pending Issues",
      value: (stats.overview.pendingIssues || 0).toLocaleString(),
      change: `${stats.overview.inProgressIssues || 0} in progress`,
      changeType: "neutral",
      icon: Clock,
      color: "amber",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {adminStats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  )
}

export default AdminStats
