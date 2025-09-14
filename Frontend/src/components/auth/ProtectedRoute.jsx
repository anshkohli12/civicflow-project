"use client"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import LoadingSpinner from "../common/LoadingSpinner"

const ProtectedRoute = ({ children, requireAdmin = false, requireRole = null }) => {
  const { user, loading, isAuthenticated, isAdmin } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requireAdmin && !isAdmin) {
    // Redirect to unauthorized page if admin access required but user is not admin
    return <Navigate to="/unauthorized" replace />
  }

  if (requireRole && user?.role !== requireRole) {
    // Redirect to unauthorized page if specific role required but user doesn't have it
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

export default ProtectedRoute
