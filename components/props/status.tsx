import { Circle } from "lucide-react"
import { forwardRef, useEffect, useImperativeHandle, useState } from "react"

import { StorageKeys } from "~constants"
import { cn } from "~lib/utils"

export type StatusHandle = {
  evaluateStatus: () => void
}

export const Status = forwardRef<
  StatusHandle,
  Readonly<React.ComponentPropsWithoutRef<"div">>
>(({ className, ...props }, ref) => {
  const [status, setStatus] = useState("Offline")
  const [statusColor, setStatusColor] = useState("gray")

  const statusColorClass = {
    green: "text-green-600",
    gray: "text-gray-400"
  }[statusColor]

  const clockedInKey = StorageKeys.ClockedInTime
  const timeWorkedKey = StorageKeys.TimeWorked

  async function evaluateStatus() {
    const savedValues = await chrome.storage.local.get([
      clockedInKey,
      timeWorkedKey
    ])
    const clockedInTime = savedValues[clockedInKey]
    const timeWorked = savedValues[timeWorkedKey]

    if (clockedInTime && timeWorked) {
      const clockedInDate = new Date(clockedInTime)
      const currentTime = new Date()
      if (currentTime.getTime() > clockedInDate.getTime()) {
        setStatus("Online")
        setStatusColor("green")
      } else {
        setStatus("Offline")
        setStatusColor("gray")
      }
    }
  }

  // expose evaluateStatus to parent
  useImperativeHandle(ref, () => ({
    evaluateStatus
  }))

  // run once on mount
  useEffect(() => {
    evaluateStatus()
  }, [])

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex items-center py-4">
        <Circle
          color={statusColor}
          fill={statusColor}
          width="1em"
          height="1em"
        />
        <p className={cn("pl-2", statusColorClass)}>{status}</p>
      </div>
    </div>
  )
})
