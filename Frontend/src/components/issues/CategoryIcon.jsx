import { Wrench, Shield, Leaf, Trees, Bus, Palette, FileText } from "lucide-react"

const CategoryIcon = ({ category, size = "sm" }) => {
  const getCategoryConfig = (category) => {
    switch (category) {
      case "infrastructure":
      case "Infrastructure":
        return {
          icon: Wrench,
          className: "bg-blue-100 text-blue-600",
        }
      case "safety":
      case "Safety":
        return {
          icon: Shield,
          className: "bg-red-100 text-red-600",
        }
      case "environment":
      case "Environment":
        return {
          icon: Leaf,
          className: "bg-green-100 text-green-600",
        }
      case "parks":
      case "Parks":
        return {
          icon: Trees,
          className: "bg-emerald-100 text-emerald-600",
        }
      case "transportation":
      case "Transportation":
        return {
          icon: Bus,
          className: "bg-purple-100 text-purple-600",
        }
      case "vandalism":
      case "Vandalism":
        return {
          icon: Palette,
          className: "bg-orange-100 text-orange-600",
        }
      default:
        return {
          icon: FileText,
          className: "bg-slate-100 text-slate-600",
        }
    }
  }

  const config = getCategoryConfig(category)
  const Icon = config.icon

  const sizeClasses = {
    sm: "w-6 h-6 p-1",
    md: "w-8 h-8 p-1.5",
    lg: "w-10 h-10 p-2",
  }

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  return (
    <div className={`rounded-lg flex items-center justify-center ${config.className} ${sizeClasses[size]}`}>
      <Icon className={iconSizes[size]} />
    </div>
  )
}

export default CategoryIcon
