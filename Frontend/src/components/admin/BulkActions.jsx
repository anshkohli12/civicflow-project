"use client"

import { useState } from "react"
import Button from "../common/Button"
import { ChevronDown, X } from "lucide-react"

const BulkActions = ({ selectedCount, onAction, actions }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-blue-900">
            {selectedCount} {selectedCount === 1 ? "item" : "items"} selected
          </span>

          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="bg-white border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              Bulk Actions
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>

            {isOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10">
                {actions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => {
                      onAction(action.id)
                      setIsOpen(false)
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${
                      action.variant === "destructive" ? "text-red-600 hover:bg-red-50" : "text-slate-700"
                    }`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAction("clear")}
          className="text-blue-600 hover:text-blue-700"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default BulkActions
