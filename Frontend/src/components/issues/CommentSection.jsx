"use client"

import { useState } from "react"
import { useAuth } from "../../hooks/useAuth"
import Button from "../common/Button"
import LoadingSpinner from "../common/LoadingSpinner"
import { MessageSquare, Reply, Flag } from "lucide-react"
import { formatRelativeTime, getInitials } from "../../utils/helpers"

const CommentSection = ({ issueId, comments, onAddComment }) => {
  const { user } = useAuth()
  const [newComment, setNewComment] = useState("")
  const [replyTo, setReplyTo] = useState(null)
  const [replyContent, setReplyContent] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setLoading(true)
    try {
      await onAddComment(newComment)
      setNewComment("")
    } catch (error) {
      console.error("Error adding comment:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReply = async (e, commentId) => {
    e.preventDefault()
    if (!replyContent.trim()) return

    setLoading(true)
    try {
      // Handle reply submission
      console.log("Reply to comment:", commentId, replyContent)
      setReplyTo(null)
      setReplyContent("")
    } catch (error) {
      console.error("Error adding reply:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <div className="flex items-center space-x-2 mb-6">
        <MessageSquare className="h-5 w-5 text-slate-600" />
        <h2 className="text-xl font-bold text-slate-900">Comments ({comments.length})</h2>
      </div>

      {/* Add Comment Form */}
      {user ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              {user.avatar ? (
                <img
                  src={user.avatar || "/placeholder.svg"}
                  alt="Your avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-blue-600 font-medium text-sm">{getInitials(user.firstName, user.lastName)}</span>
              )}
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <div className="flex justify-end mt-3">
                <Button
                  type="submit"
                  disabled={!newComment.trim() || loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Posting...</span>
                    </div>
                  ) : (
                    "Post Comment"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-8 text-center">
          <p className="text-slate-600 mb-4">Sign in to join the conversation</p>
          <Button variant="outline" onClick={() => (window.location.href = "/login")}>
            Sign In
          </Button>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="space-y-4">
              {/* Main Comment */}
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                  {comment.author.avatar ? (
                    <img
                      src={comment.author.avatar || "/placeholder.svg"}
                      alt={comment.author.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-slate-600 font-medium text-sm">
                      {getInitials(comment.author.name.split(" ")[0], comment.author.name.split(" ")[1])}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-slate-900">{comment.author.name}</span>
                        <span className="text-slate-500 text-sm">@{comment.author.username}</span>
                      </div>
                      <span className="text-slate-500 text-sm">{formatRelativeTime(comment.createdAt)}</span>
                    </div>
                    <p className="text-slate-700">{comment.content}</p>
                  </div>

                  <div className="flex items-center space-x-4 mt-2">
                    <button
                      onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                      className="text-slate-500 hover:text-blue-600 text-sm flex items-center space-x-1"
                    >
                      <Reply className="h-4 w-4" />
                      <span>Reply</span>
                    </button>
                    <button className="text-slate-500 hover:text-red-600 text-sm flex items-center space-x-1">
                      <Flag className="h-4 w-4" />
                      <span>Report</span>
                    </button>
                  </div>

                  {/* Reply Form */}
                  {replyTo === comment.id && user && (
                    <form onSubmit={(e) => handleSubmitReply(e, comment.id)} className="mt-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 font-medium text-xs">
                            {getInitials(user.firstName, user.lastName)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder={`Reply to ${comment.author.name}...`}
                            rows={2}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                          />
                          <div className="flex justify-end space-x-2 mt-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setReplyTo(null)
                                setReplyContent("")
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              size="sm"
                              disabled={!replyContent.trim() || loading}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              </div>

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-14 space-y-4">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                        {reply.author.avatar ? (
                          <img
                            src={reply.author.avatar || "/placeholder.svg"}
                            alt={reply.author.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-slate-600 font-medium text-xs">
                            {getInitials(reply.author.name.split(" ")[0], reply.author.name.split(" ")[1])}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="bg-slate-50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-slate-900 text-sm">{reply.author.name}</span>
                              <span className="text-slate-500 text-xs">@{reply.author.username}</span>
                            </div>
                            <span className="text-slate-500 text-xs">{formatRelativeTime(reply.createdAt)}</span>
                          </div>
                          <p className="text-slate-700 text-sm">{reply.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default CommentSection
