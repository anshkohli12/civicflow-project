"use client"
import { Link } from "react-router-dom"
import Button from "../components/common/Button"

const ErrorPage = ({ error, resetError }) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
        <p className="text-gray-600 mb-6">
          We're sorry, but something unexpected happened. Please try refreshing the page or contact support if the
          problem persists.
        </p>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-sm text-red-600 font-mono">{error.message}</p>
          </div>
        )}
        <div className="space-y-4">
          <Button onClick={resetError} className="w-full">
            Try Again
          </Button>
          <Link to="/">
            <Button variant="outline" className="w-full bg-transparent">
              Go Back Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage
