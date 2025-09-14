"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import { adminService } from "../services/adminService"
import AdminStats from "../components/admin/AdminStats"
import AdminDashboard from "../components/admin/AdminDashboard"
import { toast } from "react-toastify"

const AdminPage = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAdminDashboard = async () => {
      setLoading(true)
      try {
        const response = await adminService.getDashboardStats()
        console.log("Admin dashboard response:", response)
        setStats(response.data || response)
      } catch (error) {
        console.error("Failed to load admin dashboard:", error)
        toast.error("Failed to load dashboard data")
        
        // Fallback to mock data on error with proper structure
        const mockStats = {
          overview: {
            totalUsers: 0,
            totalIssues: 0,
            resolvedIssues: 0,
            pendingIssues: 0,
            inProgressIssues: 0,
            activeUsers: 0,
            newUsersThisMonth: 0,
            issuesResolvedThisMonth: 0,
          },
          growth: {
            userGrowth: 0,
            issueGrowth: 0,
            resolutionRate: 0,
            avgResolutionTime: 0,
          },
          categories: [],
          recentActivity: [],
        }
        setStats(mockStats)
      } finally {
        setLoading(false)
      }
    }

    loadAdminDashboard()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
          <p className="text-slate-600">Monitor and manage your CivicFlow platform</p>
        </div>

        {/* Quick Stats Cards */}
        <AdminStats stats={stats} loading={loading} />

        {/* Main Dashboard Content */}
        <div className="mt-8">
          <AdminDashboard stats={stats} loading={loading} />
        </div>
      </div>
    </div>
  )
}

export default AdminPage
