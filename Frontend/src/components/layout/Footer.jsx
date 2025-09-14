import { Link } from "react-router-dom"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold">CivicFlow</span>
            </div>
            <p className="text-slate-300 mb-6 max-w-md">
              Empowering citizens to report civic issues and helping administrators manage them efficiently. Building
              better communities together.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* User Pages */}
          <div>
            <h3 className="text-lg font-semibold mb-4">User Pages</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-slate-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-slate-300 hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-slate-300 hover:text-white transition-colors">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/issues" className="text-slate-300 hover:text-white transition-colors">
                  Browse Issues
                </Link>
              </li>
              <li>
                <Link to="/create-issue" className="text-slate-300 hover:text-white transition-colors">
                  Create Issue
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Admin & Auth */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Admin & Auth</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="text-slate-300 hover:text-white transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-slate-300 hover:text-white transition-colors">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-slate-300 hover:text-white transition-colors">
                  Admin Panel
                </Link>
              </li>
              <li>
                <Link to="/admin/users" className="text-slate-300 hover:text-white transition-colors">
                  Admin Users
                </Link>
              </li>
              <li>
                <Link to="/admin/issues" className="text-slate-300 hover:text-white transition-colors">
                  Admin Issues
                </Link>
              </li>
              <li>
                <Link to="/unauthorized" className="text-slate-300 hover:text-white transition-colors">
                  Unauthorized
                </Link>
              </li>
              <li>
                <Link to="/error" className="text-slate-300 hover:text-white transition-colors">
                  Error Page
                </Link>
              </li>
              <li>
                <Link to="/404" className="text-slate-300 hover:text-white transition-colors">
                  404 Page
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-slate-400" />
                <span className="text-slate-300">support@civicflow.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-slate-400" />
                <span className="text-slate-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span className="text-slate-300">123 Civic Center, City, State</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">© 2024 CivicFlow. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-slate-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-slate-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
            <Link to="/cookies" className="text-slate-400 hover:text-white text-sm transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
