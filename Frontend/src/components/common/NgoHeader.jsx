import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Menu, X, User, LogOut, Settings, Building, FileText, BarChart3 } from "lucide-react"
import { useAuth } from "../../context/AuthContext"

const NgoHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const isActiveRoute = (path) => location.pathname === path

  const ngoNavItems = [
    {
      path: "/ngo/dashboard",
      label: "Dashboard",
      icon: <BarChart3 className="h-4 w-4" />
    },
    {
      path: "/ngo/issues",
      label: "My Issues",
      icon: <FileText className="h-4 w-4" />
    },
    {
      path: "/issues",
      label: "Browse All",
      icon: <FileText className="h-4 w-4" />
    },
    {
      path: "/issues/new",
      label: "Report Issue",
      icon: <FileText className="h-4 w-4" />
    }
  ]

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/ngo/dashboard" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg">
              <Building className="text-white h-6 w-6" />
            </div>
            <div>
              <span className="text-xl font-bold text-slate-900">CivicFlow</span>
              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                NGO
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {ngoNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-1 font-medium transition-colors ${
                  isActiveRoute(item.path) 
                    ? "text-green-600" 
                    : "text-slate-700 hover:text-green-600"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Building className="w-4 h-4 text-green-600" />
              </div>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-slate-700">
                  {user?.firstName || user?.username}
                </div>
                {user?.organizationName && (
                  <div className="text-xs text-green-600 font-medium truncate max-w-32">
                    {user.organizationName}
                  </div>
                )}
              </div>
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-2">
                <div className="px-4 py-2 border-b border-slate-100">
                  <div className="text-sm font-medium text-slate-900">
                    {user?.organizationName || "Organization"}
                  </div>
                  <div className="text-xs text-green-600">NGO Partner</div>
                </div>
                
                <Link
                  to="/ngo/dashboard"
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Organization Dashboard</span>
                </Link>
                
                <Link
                  to="/ngo/profile"
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <User className="w-4 h-4" />
                  <span>Organization Profile</span>
                </Link>
                
                <Link
                  to="/settings"
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </Link>
                
                <div className="border-t border-slate-100 mt-2 pt-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="md:hidden p-2 rounded-lg hover:bg-slate-100"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-4">
            <nav className="flex flex-col space-y-4">
              {ngoNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center space-x-2 text-slate-700 hover:text-green-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
              
              <div className="border-t border-slate-200 pt-4 mt-4">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-slate-700 hover:text-green-600 font-medium mb-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  <span>Organization Profile</span>
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center space-x-2 text-slate-700 hover:text-green-600 font-medium mb-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="flex items-center space-x-2 text-left text-red-600 hover:text-red-700 font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default NgoHeader