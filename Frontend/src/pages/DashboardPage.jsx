"use client"
import { useAuth } from "../context/AuthContext"
import QuickActions from "../components/dashboard/QuickActions"
import RecentIssues from "../components/dashboard/RecentIssues"
import WelcomeSection from "../components/dashboard/WelcomeSection"

const DashboardPage = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <WelcomeSection user={user} />

        {/* Main Dashboard Content */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <QuickActions />
          
          {/* My Issues */}
          <RecentIssues />
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
