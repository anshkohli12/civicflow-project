import React from "react"
import { cn } from "../../utils/helpers"

const Card = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow",
      className,
    )}
    {...props}
  >
    {children}
  </div>
))

Card.displayName = "Card"

export default Card
