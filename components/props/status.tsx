import { Circle } from "lucide-react"
import { useEffect, useState } from "react"

import { type Storage } from "~interfaces/interfaces"
import { Status as StatusType } from "~lib/constants"
import { cn } from "~lib/utils"

interface Status extends React.ComponentPropsWithoutRef<"div"> {
  storage: Storage
}

const statusColors = {
  orange: "text-orange-400",
  green: "text-green-600",
  gray: "text-gray-400"
}

export function StatusBar({ className, storage, ...props }: Readonly<Status>) {
  const [status, setStatus] = useState("Offline")
  const [statusColor, setStatusColor] = useState("gray")

  const color = statusColors[statusColor] ?? statusColors.gray

  async function evaluateStatus() {
    const { lastClockedTime, timeWorkedThisWeek } = storage
    const status = storage.status

    if (lastClockedTime && timeWorkedThisWeek) {
      const clockedInDate = new Date(lastClockedTime)
      const currentTime = new Date()

      if (status === StatusType.Desynced) {
        setStatus("Desynced")
        setStatusColor("orange")
      } else if (currentTime.getTime() > clockedInDate.getTime()) {
        setStatus("Online")
        setStatusColor("green")
      } else {
        setStatus("Offline")
        setStatusColor("gray")
      }
    }
  }

  useEffect(() => {
    if (storage == null) return

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
        <p className={cn("pl-2", color)}>{status}</p>
      </div>
    </div>
  )
}
