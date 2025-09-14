const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case "PENDING":
        return {
          text: "Pending",
          className: "bg-amber-100 text-amber-800 border-amber-200",
        }
      case "IN_PROGRESS":
        return {
          text: "In Progress",
          className: "bg-blue-100 text-blue-800 border-blue-200",
        }
      case "RESOLVED":
        return {
          text: "Resolved",
          className: "bg-green-100 text-green-800 border-green-200",
        }
      case "CLOSED":
        return {
          text: "Closed",
          className: "bg-slate-100 text-slate-800 border-slate-200",
        }
      default:
        return {
          text: status,
          className: "bg-slate-100 text-slate-800 border-slate-200",
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}
    >
      {config.text}
    </span>
  )
}

export default StatusBadge
