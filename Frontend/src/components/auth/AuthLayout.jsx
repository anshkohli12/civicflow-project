import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Link to="/" className="inline-flex items-center text-slate-600 hover:text-blue-600 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to home
        </Link>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">{children}</div>
      </div>

      {/* Footer */}
      <footer className="p-6 text-center text-sm text-slate-500">© 2024 CivicFlow. All rights reserved.</footer>
    </div>
  )
}

export default AuthLayout
