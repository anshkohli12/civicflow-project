import { Link } from "react-router-dom"
import { Plus, Search, User } from "lucide-react"

const QuickActions = () => {
  const actions = [
    {
      title: "Report Issue",
      description: "Report a civic issue in your community",
      icon: Plus,
      link: "/issues/create",
      variant: "default",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Browse Issues",
      description: "View and vote on community issues",
      icon: Search,
      link: "/issues",
      variant: "outline",
    },
    {
      title: "My Profile",
      description: "Manage your account settings",
      icon: User,
      link: "/profile",
      variant: "outline",
    },
  ]

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Quick Actions</h2>
        <div className="hidden sm:block w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {actions.map((action, index) => {
          const Icon = action.icon
          return (
            <Link
              key={index}
              to={action.link}
              className="group relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 lg:p-6 hover:from-blue-50 hover:to-blue-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-slate-200 hover:border-blue-200"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 ${
                    action.variant === "default" 
                      ? "bg-blue-500 text-white group-hover:bg-blue-600" 
                      : "bg-white text-slate-600 group-hover:text-blue-600 shadow-sm"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                    {action.title}
                  </h3>
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                {action.description}
              </p>
              <div className="flex items-center justify-between">
                <div
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    action.variant === "default"
                      ? "bg-blue-600 text-white group-hover:bg-blue-700"
                      : "bg-slate-200 text-slate-700 group-hover:bg-blue-100 group-hover:text-blue-700"
                  }`}
                >
                  {action.title}
                </div>
                <div className="w-6 h-6 rounded-full bg-slate-200 group-hover:bg-blue-200 flex items-center justify-center transition-all">
                  <div className="w-1.5 h-1.5 bg-slate-400 group-hover:bg-blue-500 rounded-full transition-all"></div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default QuickActions
