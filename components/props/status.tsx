import { Circle } from "lucide-react"
import { useEffect, useState } from "react"

import { type Storage } from "~interfaces/interfaces"
import { cn } from "~lib/utils"

interface Status extends React.ComponentPropsWithoutRef<"div"> {
  storage: Storage
}

export function StatusBar({
  className,
  storage,
  ...props
}: Readonly<Status>) {
  const [status, setStatus] = useState("Offline")
  const [statusColor, setStatusColor] = useState("gray")

  const statusColorClass = {
    green: "text-green-600",
    gray: "text-gray-400"
  }[statusColor]

  async function evaluateStatus() {
    const clockedInTime = storage.clockedTime
    const timeWorked = storage.timeWorked

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

  useEffect(() => {
    evaluateStatus()
  }, [storage])

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
}
