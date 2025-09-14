"use client"
import { useState } from "react"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import { cn } from "../../utils/helpers"
import { useAuth } from "../../context/AuthContext"

const VoteButton = ({ votes, userVote, onVote, compact = false, issueId }) => {
  const { user } = useAuth()
  const [isVoting, setIsVoting] = useState(false)

  const handleVote = async (voteType) => {
    if (!user) {
      // Could show login prompt here
      return
    }

    if (isVoting) return

    try {
      setIsVoting(true)
      // The voteType should be "UPVOTE" or "DOWNVOTE" for the backend
      const backendVoteType = voteType === "up" ? "UPVOTE" : "DOWNVOTE"
      await onVote(backendVoteType)
    } catch (error) {
      console.error('Error voting:', error)
    } finally {
      setIsVoting(false)
    }
  }

  if (compact) {
    return (
      <div className="flex flex-col items-center space-y-1">
        <button
          onClick={() => handleVote("up")}
          disabled={!user || isVoting}
          className={cn(
            "p-2 rounded-lg transition-colors",
            !user ? "opacity-50 cursor-not-allowed" :
            userVote === "UPVOTE" ? "bg-green-100 text-green-600" : 
            "text-slate-400 hover:text-green-600 hover:bg-green-50",
            isVoting && "opacity-50 cursor-not-allowed"
          )}
          title={!user ? "Login to vote" : "Upvote this issue"}
        >
          <ThumbsUp className="h-4 w-4" />
        </button>
        
        <span className="text-sm font-medium text-slate-900">{votes || 0}</span>
        
        <button
          onClick={() => handleVote("down")}
          disabled={!user || isVoting}
          className={cn(
            "p-2 rounded-lg transition-colors",
            !user ? "opacity-50 cursor-not-allowed" :
            userVote === "DOWNVOTE" ? "bg-red-100 text-red-600" : 
            "text-slate-400 hover:text-red-600 hover:bg-red-50",
            isVoting && "opacity-50 cursor-not-allowed"
          )}
          title={!user ? "Login to vote" : "Downvote this issue"}
        >
          <ThumbsDown className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2 bg-slate-50 rounded-lg p-2">
      <button
        onClick={() => handleVote("up")}
        disabled={!user || isVoting}
        className={cn(
          "flex items-center space-x-2 px-3 py-2 rounded-md transition-colors",
          !user ? "opacity-50 cursor-not-allowed" :
          userVote === "UPVOTE" ? "bg-green-100 text-green-700" : 
          "text-slate-600 hover:text-green-600 hover:bg-green-50",
          isVoting && "opacity-50 cursor-not-allowed"
        )}
        title={!user ? "Login to vote" : "Upvote this issue"}
      >
        <ThumbsUp className="h-4 w-4" />
        <span className="font-medium">{votes || 0}</span>
      </button>

      <div className="w-px h-6 bg-slate-300" />

      <button
        onClick={() => handleVote("down")}
        disabled={!user || isVoting}
        className={cn(
          "flex items-center space-x-2 px-3 py-2 rounded-md transition-colors",
          !user ? "opacity-50 cursor-not-allowed" :
          userVote === "DOWNVOTE" ? "bg-red-100 text-red-700" : 
          "text-slate-600 hover:text-red-600 hover:bg-red-50",
          isVoting && "opacity-50 cursor-not-allowed"
        )}
        title={!user ? "Login to vote" : "Downvote this issue"}
      >
        <ThumbsDown className="h-4 w-4" />
        <span className="font-medium">0</span>
      </button>
    </div>
  )
}

export default VoteButton
