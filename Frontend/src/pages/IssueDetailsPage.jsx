"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { issueService } from "../services/issueService"
import VoteButton from "../components/issues/VoteButton"
import StatusBadge from "../components/issues/StatusBadge"
import CategoryIcon from "../components/issues/CategoryIcon"
import Button from "../components/common/Button"
import LoadingSpinner from "../components/common/LoadingSpinner"
import { ArrowLeft, MapPin, Calendar, User, Edit, Flag, Share, AlertTriangle } from "lucide-react"
import { formatRelativeTime } from "../utils/helpers"

const IssueDetailsPage = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [issue, setIssue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userVote, setUserVote] = useState(null)
  const [voteSummary, setVoteSummary] = useState(null)

  // Mock issue data
  const mockIssue = {
    id: Number.parseInt(id),
    title: "Broken streetlight on Main Street",
    description:
      "The streetlight at the intersection of Main Street and 5th Avenue has been out for over a week, creating safety concerns for pedestrians. This is particularly dangerous during evening hours when visibility is poor. Several residents have reported near-miss incidents with vehicles due to the lack of proper lighting.",
    category: "Infrastructure",
    status: "IN_PROGRESS",
    priority: "HIGH",
    location: "Main Street & 5th Ave",
    coordinates: { lat: 40.7128, lng: -74.006 },
    votes: 15,
    upvotes: 15,
    downvotes: 0,
    comments: 3,
    images: ["/broken-streetlight-night.png", "/dark-intersection-safety-hazard.jpg"],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    author: {
      id: 1,
      name: "John Doe",
      username: "johndoe",
      avatar: null,
    },
    timeline: [
      {
        id: 1,
        status: "PENDING",
        message: "Issue reported and under review",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        user: "System",
      },
      {
        id: 2,
        status: "IN_PROGRESS",
        message: "Issue assigned to Public Works Department",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        user: "Admin",
      },
    ],
  }

  useEffect(() => {
    const loadIssue = async () => {
      try {
        setLoading(true)
        setError(null)

        // Load issue details from backend
        const issueData = await issueService.getIssueById(id)
        setIssue(issueData)

        // Load voting summary if user is authenticated
        if (user) {
          try {
            const votingData = await issueService.getVoteSummary(id)
            setVoteSummary(votingData)
            setUserVote(votingData.userVote) // Backend returns user's current vote
          } catch (voteError) {
            console.warn('Could not load voting data:', voteError)
          }
        }

      } catch (err) {
        console.error('Error loading issue:', err)
        setError('Failed to load issue details. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadIssue()
    }
  }, [id, user])

  const handleVote = async (voteType) => {
    if (!user) {
      navigate("/login")
      return
    }

    try {
      // Call the backend voting API
      const response = await issueService.voteOnIssue(id, voteType)
      
      // Update local state with the response
      setUserVote(response.type)
      
      // Reload voting summary to get updated counts
      const updatedVoteSummary = await issueService.getVoteSummary(id)
      setVoteSummary(updatedVoteSummary)
      
      // Update issue vote count
      setIssue(prev => ({
        ...prev,
        voteCount: updatedVoteSummary.totalVotes
      }))

    } catch (error) {
      console.error('Error voting:', error)
      // You could show a toast notification here
    }
  }

  const handleRemoveVote = async () => {
    if (!user) return

    try {
      await issueService.removeVote(id)
      setUserVote(null)
      
      // Reload voting summary
      const updatedVoteSummary = await issueService.getVoteSummary(id)
      setVoteSummary(updatedVoteSummary)
      
      // Update issue vote count
      setIssue(prev => ({
        ...prev,
        voteCount: updatedVoteSummary.totalVotes
      }))

    } catch (error) {
      console.error('Error removing vote:', error)
    }
  }

  // Handle location display
  const getLocationText = () => {
    if (issue?.latitude && issue?.longitude) {
      return `${issue.latitude.toFixed(4)}, ${issue.longitude.toFixed(4)}`
    }
    return "Location not specified"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !issue) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600">{error || 'Issue not found'}</p>
          </div>
          <Link to="/issues">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Back to Issues
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: issue.title,
        text: issue.description,
        url: window.location.href,
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!issue) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Issue Not Found</h2>
          <p className="text-slate-600 mb-4">The issue you're looking for doesn't exist.</p>
          <Link to="/issues">
            <Button variant="outline">Back to Issues</Button>
          </Link>
        </div>
      </div>
    )
  }

  const isAuthor = user?.id === issue.createdBy?.id
  const canEdit = isAuthor || user?.role === "ADMIN"

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/issues"
          className="inline-flex items-center text-slate-600 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Issues
        </Link>

        {/* Issue Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <CategoryIcon category={issue.category} />
                <StatusBadge status={issue.status} />
                {issue.critical && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Critical
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-bold text-slate-900 mb-4 text-balance">{issue.title}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-6">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>By {issue.createdBy ? issue.createdBy.username : 'Anonymous'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {issue.latitude && issue.longitude 
                      ? `${issue.latitude.toFixed(6)}, ${issue.longitude.toFixed(6)}`
                      : 'Location not specified'
                    }
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatRelativeTime(issue.createdAt)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <VoteButton
                votes={issue.voteCount || 0}
                upvotes={voteSummary.upvotes || 0}
                downvotes={voteSummary.downvotes || 0}
                userVote={userVote}
                onVote={handleVote}
              />

              <Button variant="outline" onClick={handleShare}>
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>

              {canEdit && (
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}

              <Button variant="outline">
                <Flag className="h-4 w-4 mr-2" />
                Report
              </Button>
            </div>
          </div>

          {/* Issue Images */}
          {issue.imageUrl && (
            <div className="mb-6">
              <img
                src={`http://localhost:8080${issue.imageUrl}`}
                alt="Issue image"
                className="w-full h-64 object-cover rounded-lg border border-slate-200"
                onError={(e) => {
                  console.error('Failed to load image:', issue.imageUrl);
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Issue Description */}
          <div className="prose max-w-none">
            <p className="text-slate-700 leading-relaxed text-pretty">{issue.description}</p>
          </div>
        </div>

        {/* Issue Status and Voting */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Issue Status</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">Current Status:</span>
              <StatusBadge status={issue.status} />
              {issue.assignedNgo && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-600">Assigned to:</span>
                  <span className="text-sm font-medium text-slate-900">{issue.assignedNgo.username}</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">Total Votes:</span>
              <span className="text-lg font-bold text-slate-900">{issue.voteCount || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IssueDetailsPage
