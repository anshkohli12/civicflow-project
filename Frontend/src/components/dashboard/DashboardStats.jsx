import { useState, useEffect } from "react"
import { dashboardService } from "../../services/dashboardService"
import StatsCard from "./StatsCard"
import { FileText, ThumbsUp, CheckCircle, Clock } from "lucide-react"

const DashboardStats = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)
        const userStats = await dashboardService.getUserStats()
        console.log('Dashboard stats response:', userStats) // Debug log
        
        // Transform backend data to component format
        const formattedStats = [
          {
            title: "My Issues",
            value: (userStats?.myIssues || 0).toString(),
            change: (userStats?.issuesThisWeek || 0) > 0 ? `+${userStats.issuesThisWeek} this week` : "No new issues this week",
            changeType: (userStats?.issuesThisWeek || 0) > 0 ? "positive" : "neutral",
            icon: FileText,
            color: "blue",
          },
          {
            title: "Votes Received",
            value: (userStats?.votesReceived || 0).toString(),
            change: "Total votes on your issues",
            changeType: "positive",
            icon: ThumbsUp,
            color: "green",
          },
          {
            title: "Issues Resolved",
            value: (userStats?.issuesResolved || 0).toString(),
            change: `${(userStats?.myIssues || 0) > 0 ? Math.round(((userStats?.issuesResolved || 0) / userStats.myIssues) * 100) : 0}% completion rate`,
            changeType: "positive",
            icon: CheckCircle,
            color: "emerald",
          },
          {
            title: "Pending Issues",
            value: (userStats?.pendingIssues || 0).toString(),
            change: "Awaiting action",
            changeType: (userStats?.pendingIssues || 0) > 0 ? "negative" : "positive",
            icon: Clock,
            color: "amber",
          },
        ]
        
        setStats(formattedStats)
      } catch (err) {
        console.error('Error fetching dashboard stats:', err)
        
        // Show fallback data when API fails
        const fallbackStats = [
          {
            title: "My Issues",
            value: "0",
            change: "Unable to fetch data",
            changeType: "neutral",
            icon: FileText,
            color: "blue",
          },
          {
            title: "Votes Received",
            value: "0",
            change: "Unable to fetch data",
            changeType: "neutral",
            icon: ThumbsUp,
            color: "green",
          },
          {
            title: "Issues Resolved",
            value: "0",
            change: "Unable to fetch data",
            changeType: "neutral",
            icon: CheckCircle,
            color: "emerald",
          },
          {
            title: "Pending Issues",
            value: "0",
            change: "Unable to fetch data",
            changeType: "neutral",
            icon: Clock,
            color: "amber",
          },
        ]
        
        setStats(fallbackStats)
        setError('Failed to load dashboard statistics. Please check your connection.')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-slate-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-slate-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Impact</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Impact</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>
    </div>
  )
}

export default DashboardStats
