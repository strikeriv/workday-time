import { type Duration } from "date-fns"
import { Info } from "lucide-react"
import { useEffect, useState } from "react"

import { calculateDayTimeWorked, customFormatDuration } from "~lib/data/time"

import { CustomTooltip } from "../tooltip"

interface DayTimeClockProps extends React.ComponentPropsWithoutRef<"div"> {
  tick: number
  lastClockedInTime?: number
  timeWorkedToday?: Duration
}

export function DayTimeClock({
  className,
  tick,
  lastClockedInTime,
  timeWorkedToday,
  ...props
}: Readonly<DayTimeClockProps>) {
  const [currentTime, setCurrentTime] = useState<string>("loading...")

  function updateClockedInTimer() {
    setCurrentTime(
      customFormatDuration(
        calculateDayTimeWorked(lastClockedInTime, timeWorkedToday)
      )
    )
  }

  useEffect(() => {
    if (lastClockedInTime == null) return
    if (timeWorkedToday == null) return

    updateClockedInTimer()
  }, [tick])

  return (
    <div className={className} {...props}>
      <h2 className="text-base font-bold">Time worked today</h2>

      <div className="flex items-center gap-2">
        <p className="text-sm text-muted-foreground">{currentTime}</p>
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
