import { formatDate } from "../../utils/helpers"
import { MapPin, Calendar, User } from "lucide-react"

const WelcomeSection = ({ user }) => {
  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening"

  return (
    <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-2xl p-6 lg:p-8 text-white mb-8 shadow-xl">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">
                {greeting}, {user?.username || user?.firstName || 'Citizen'}!
              </h1>
              <p className="text-blue-100">Ready to make a difference in your community?</p>
            </div>
          </div>
          <p className="text-blue-200 text-sm flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(new Date())}</span>
          </p>
        </div>

        <div className="mt-6 lg:mt-0 lg:ml-8">
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
            <div className="text-center">
              <p className="text-3xl font-bold mb-1">🏙️</p>
              <p className="text-white font-semibold">CivicFlow</p>
              <p className="text-blue-200 text-sm">Community Platform</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WelcomeSection
