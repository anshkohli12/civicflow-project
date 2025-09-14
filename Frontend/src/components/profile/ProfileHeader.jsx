"use client"

import { useState } from "react"
import { useAuth } from "../../hooks/useAuth"
import { getInitials, formatDate } from "../../utils/helpers"
import { Camera, Edit } from "lucide-react"
import Button from "../common/Button"

const ProfileHeader = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false)
  const { updateUser } = useAuth()

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Mock avatar upload - in real app, upload to server
      const reader = new FileReader()
      reader.onload = (e) => {
        updateUser({ avatar: e.target.result })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center space-x-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-blue-600">{getInitials(user?.firstName, user?.lastName)}</span>
              )}
            </div>
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
              <Camera className="h-4 w-4 text-white" />
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </label>
          </div>

          {/* User Info */}
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-slate-600 text-lg">@{user?.username}</p>
            <p className="text-slate-500 text-sm mt-1">Member since {formatDate(user?.createdAt)}</p>
            <div className="flex items-center space-x-4 mt-3">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user?.role === "ADMIN" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                }`}
              >
                {user?.role === "ADMIN" ? "Administrator" : "Community Member"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 md:mt-0">
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)} className="flex items-center space-x-2">
            <Edit className="h-4 w-4" />
            <span>Edit Profile</span>
          </Button>
        </div>
      </div>

      {/* Profile Stats */}
      <div className="mt-8 pt-6 border-t border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">12</div>
            <div className="text-slate-600 text-sm">Issues Reported</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">28</div>
            <div className="text-slate-600 text-sm">Votes Cast</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">8</div>
            <div className="text-slate-600 text-sm">Issues Resolved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">156</div>
            <div className="text-slate-600 text-sm">Community Points</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader
