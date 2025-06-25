import type { Duration } from "date-fns"
import { Info } from "lucide-react"
import { useEffect, useState } from "react"

import { calculateTotalTimeWorked, customFormatDuration } from "~lib/data/time"

import { CustomTooltip } from "../tooltip"

interface TotalTimeClockProps extends React.ComponentPropsWithoutRef<"div"> {
  tick: number
  isClockedIn: boolean
  lastClockedInTime?: number
  timeWorkedThisWeek?: Duration
}

export function TotalTimeClock({
  className,
  tick,
  isClockedIn,
  lastClockedInTime,
  timeWorkedThisWeek,
  ...props
}: Readonly<TotalTimeClockProps>) {
  const [totalWorkedTime, setTotalWorkedTime] = useState<string>("loading...")

  function updateTotalTimeWorked() {
    setTotalWorkedTime(
      customFormatDuration(
        calculateTotalTimeWorked(
          lastClockedInTime,
          timeWorkedThisWeek,
          isClockedIn
        )
      )
    )
  }

  useEffect(() => {
    if (lastClockedInTime == null) return
    if (timeWorkedThisWeek == null) return

    updateTotalTimeWorked()
  }, [tick])

  return (
    <div className={className} {...props}>
      <h2 className="text-base font-bold">Time worked this week</h2>

      <div className="flex items-center gap-2">
        <p className="text-sm text-muted-foreground">{totalWorkedTime}</p>
        <CustomTooltip icon={<Info width="1em" height="1em" />}>
          <p>
            Workday does not show seconds in its data.
            <br />
            Hence, why this value is approximate.
          </p>
        </CustomTooltip>
      </div>
    </div>
  )
}
