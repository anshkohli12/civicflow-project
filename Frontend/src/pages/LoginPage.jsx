import AuthLayout from "../components/auth/AuthLayout"
import LoginForm from "../components/auth/LoginForm"
import { Link } from "react-router-dom"

const LoginPage = () => {
  return (
    <AuthLayout>
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">CF</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h2>
          <p className="text-slate-600">Sign in to your CivicFlow account</p>
        </div>

        <LoginForm />

        <div className="text-center">
          <p className="text-slate-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  )
}

export default LoginPage
