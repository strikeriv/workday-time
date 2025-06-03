import { Info } from "lucide-react"
import { useEffect, useState } from "react"

import type { ClockedInDuration, TimeWorked } from "~interfaces/interfaces"
import {
  calculateCurrentClockedInTime,
  calculateTotalTimeWorked
} from "~lib/data/time"

import { CustomTooltip } from "../tooltip"

interface TotalTimeClockProps extends React.ComponentPropsWithoutRef<"div"> {
  tick: number
  clockedInTime?: number
  existingTime?: TimeWorked
}

export function TotalTimeClock({
  className,
  tick,
  clockedInTime,
  existingTime,
  ...props
}: Readonly<TotalTimeClockProps>) {
  const [totalWorkedTime, setTotalWorkedTime] = useState<string>("loading...")

  function updateTotalTimeWorked() {
    const { timeWorkedHours, timeWorkedMinutes, timeWorkedSeconds } =
      calculateTotalTimeWorked(clockedInTime, existingTime)

    setTotalWorkedTime(
      `${timeWorkedHours} hours, ${timeWorkedMinutes} minutes, ~${timeWorkedSeconds} seconds`
    )
  }

  useEffect(() => {
    if (clockedInTime == null) return
    if (clockedInTime == null) return

    updateTotalTimeWorked()
  }, [tick])

  return (
    <div className={className} {...props}>
      <h2 className="text-base font-bold">Total time worked</h2>

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
