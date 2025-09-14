import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { ToastProvider } from "./context/ToastContext"
import MainLayout from "./components/layout/MainLayout"
import AuthLayout from "./components/auth/AuthLayout"
import ProtectedRoute from "./components/auth/ProtectedRoute"

// Pages
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import DashboardPage from "./pages/DashboardPage"
import IssuesPage from "./pages/IssuesPage"
import IssueDetailsPage from "./pages/IssueDetailsPage"
import CreateIssuePage from "./pages/CreateIssuePage"
import ProfilePage from "./pages/ProfilePage"
import SettingsPage from "./pages/SettingsPage"
import AdminPage from "./pages/AdminPage"
import AdminUsersPage from "./pages/AdminUsersPage"
import AdminIssuesPage from "./pages/AdminIssuesPage"
import AboutPage from "./pages/AboutPage"
import ContactPage from "./pages/ContactPage"
import NotFoundPage from "./pages/NotFoundPage"
import UnauthorizedPage from "./pages/UnauthorizedPage"
import ErrorPage from "./pages/ErrorPage"
import NgoRegisterPage from "./pages/NgoRegisterPage"
import NgoLoginPage from "./pages/NgoLoginPage"
import NgoDashboard from "./pages/NgoDashboard"

// Styles
import "./styles/globals.css"
import "react-toastify/dist/ReactToastify.css"

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              {/* Auth Routes - outside MainLayout */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* NGO Auth Routes */}
              <Route path="/ngo/register" element={<NgoRegisterPage />} />
              <Route path="/ngo/login" element={<NgoLoginPage />} />

              {/* Public Routes */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="issues" element={<IssuesPage />} />
                <Route path="issues/:id" element={<IssueDetailsPage />} />
                <Route path="unauthorized" element={<UnauthorizedPage />} />
                <Route path="error" element={<ErrorPage />} />
                <Route path="404" element={<NotFoundPage />} />
              </Route>

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="issues/new" element={<CreateIssuePage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="issues" element={<AdminIssuesPage />} />
              </Route>

              {/* NGO Protected Routes */}
              <Route
                path="/ngo"
                element={
                  <ProtectedRoute requireRole="NGO">
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<NgoDashboard />} />
              </Route>

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
