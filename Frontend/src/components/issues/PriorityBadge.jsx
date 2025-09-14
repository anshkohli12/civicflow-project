const PriorityBadge = ({ priority }) => {
  const getPriorityConfig = (priority) => {
    switch (priority) {
      case "HIGH":
        return {
          text: "High Priority",
          className: "bg-red-100 text-red-800 border-red-200",
        }
      case "MEDIUM":
        return {
          text: "Medium Priority",
          className: "bg-yellow-100 text-yellow-800 border-yellow-200",
        }
      case "LOW":
        return {
          text: "Low Priority",
          className: "bg-green-100 text-green-800 border-green-200",
        }
      default:
        return {
          text: priority,
          className: "bg-slate-100 text-slate-800 border-slate-200",
        }
    }
  }

  const config = getPriorityConfig(priority)

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}
    >
      {config.text}
    </span>
  )
}

export default PriorityBadge
