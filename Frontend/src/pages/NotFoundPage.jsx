import { Link } from "react-router-dom"
import Button from "../components/common/Button"

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="text-6xl font-bold text-blue-600 mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the
          wrong URL.
        </p>
        <div className="space-y-4">
          <Link to="/">
            <Button className="w-full">Go Back Home</Button>
          </Link>
          <Link to="/issues">
            <Button variant="outline" className="w-full bg-transparent">
              Browse Issues
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
