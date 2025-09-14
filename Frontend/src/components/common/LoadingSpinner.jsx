import { cn } from "../../utils/helpers"

const LoadingSpinner = ({ size = "default", className }) => {
  const sizes = {
    sm: "w-4 h-4",
    default: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  }

  return (
    <div
      className={cn("animate-spin rounded-full border-2 border-slate-300 border-t-blue-600", sizes[size], className)}
    />
  )
}

export default LoadingSpinner
