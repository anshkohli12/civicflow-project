"use client"

import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Menu, X, User, LogOut, Settings } from "lucide-react"
import { useAuth } from "../../hooks/useAuth"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, logout, isAuthenticated, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const isActiveRoute = (path) => location.pathname === path

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-2xl font-bold text-slate-900">CivicFlow</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                {user?.role === 'NGO' ? (
                  <Link
                    to="/ngo/dashboard"
                    className={`font-medium transition-colors ${
                      isActiveRoute("/ngo/dashboard") ? "text-blue-600" : "text-slate-700 hover:text-blue-600"
                    }`}
                  >
                    NGO Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className={`font-medium transition-colors ${
                      isActiveRoute("/dashboard") ? "text-blue-600" : "text-slate-700 hover:text-blue-600"
                    }`}
                  >
                    Dashboard
                  </Link>
                )}
                <Link
                  to="/issues"
                  className={`font-medium transition-colors ${
                    isActiveRoute("/issues") ? "text-blue-600" : "text-slate-700 hover:text-blue-600"
                  }`}
                >
                  Issues
                </Link>
                {isAdmin && (
                  <>
                    <Link
                      to="/admin"
                      className={`font-medium transition-colors ${
                        isActiveRoute("/admin") ? "text-blue-600" : "text-slate-700 hover:text-blue-600"
                      }`}
                    >
                      Admin
                    </Link>
                    <Link
                      to="/admin/users"
                      className={`font-medium transition-colors ${
                        isActiveRoute("/admin/users") ? "text-blue-600" : "text-slate-700 hover:text-blue-600"
                      }`}
                    >
                      Admin Users
                    </Link>
                    <Link
                      to="/admin/issues"
                      className={`font-medium transition-colors ${
                        isActiveRoute("/admin/issues") ? "text-blue-600" : "text-slate-700 hover:text-blue-600"
                      }`}
                    >
                      Admin Issues
                    </Link>
                  </>
                )}
              </>
            ) : (
              <>
                <Link to="/issues" className="text-slate-700 hover:text-blue-600 font-medium">
                  Browse Issues
                </Link>
                <Link to="/about" className="text-slate-700 hover:text-blue-600 font-medium">
                  About
                </Link>
                <Link to="/contact" className="text-slate-700 hover:text-blue-600 font-medium">
                  Contact
                </Link>
                <Link to="/login" className="text-slate-700 hover:text-blue-600 font-medium">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Sign Up
                </Link>
                <Link to="/ngo/login" className="text-slate-700 hover:text-blue-600 font-medium">
                  NGO Login
                </Link>
              </>
            )}
          </nav>

          {/* User Menu */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <span className="hidden md:block text-sm font-medium text-slate-700">
                  {user?.firstName || user?.username}
                </span>
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    <span>View Profile</span>
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : null}

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 rounded-lg hover:bg-slate-100">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-4">
            <nav className="flex flex-col space-y-4">
              {isAuthenticated ? (
                <>
                  {user?.role === 'NGO' ? (
                    <Link
                      to="/ngo/dashboard"
                      className="text-slate-700 hover:text-blue-600 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      NGO Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/dashboard"
                      className="text-slate-700 hover:text-blue-600 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  <Link
                    to="/issues"
                    className="text-slate-700 hover:text-blue-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Issues
                  </Link>
                  <Link
                    to="/profile"
                    className="text-slate-700 hover:text-blue-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  {isAdmin && (
                    <>
                      <Link
                        to="/admin"
                        className="text-slate-700 hover:text-blue-600 font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin
                      </Link>
                      <Link
                        to="/admin/users"
                        className="text-slate-700 hover:text-blue-600 font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin Users
                      </Link>
                      <Link
                        to="/admin/issues"
                        className="text-slate-700 hover:text-blue-600 font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin Issues
                      </Link>
                    </>
                  )}
                  <button onClick={handleLogout} className="text-left text-red-600 hover:text-red-700 font-medium">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/issues"
                    className="text-slate-700 hover:text-blue-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Browse Issues
                  </Link>
                  <Link
                    to="/about"
                    className="text-slate-700 hover:text-blue-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link
                    to="/contact"
                    className="text-slate-700 hover:text-blue-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contact
                  </Link>
                  <Link
                    to="/login"
                    className="text-slate-700 hover:text-blue-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                  <Link
                    to="/ngo/login"
                    className="text-slate-700 hover:text-blue-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    NGO Login
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
