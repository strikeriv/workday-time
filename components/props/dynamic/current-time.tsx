import { Info } from "lucide-react"
import { useEffect, useState } from "react"

import { calculateCurrentClockedInTime } from "~lib/data/time"

import { CustomTooltip } from "../tooltip"

interface CurrentTimeClockProps extends React.ComponentPropsWithoutRef<"div"> {
  tick: number
  clockedInTime?: number
}

export function CurrentTimeClock({
  className,
  tick,
  clockedInTime,
  ...props
}: Readonly<CurrentTimeClockProps>) {
  const [currentTime, setCurrentTime] = useState<string>("loading...")

  function updateClockedInTimer() {
    const { clockedInHours, clockedInMinutes, clockedInSeconds } =
      calculateCurrentClockedInTime(clockedInTime)

    setCurrentTime(
      `${clockedInHours} hours, ${clockedInMinutes} minutes, ~${clockedInSeconds} seconds`
    )
  }

  useEffect(() => {
    if (clockedInTime == null) return

    updateClockedInTimer()
  }, [tick])

  return (
    <div className={className} {...props}>
      <h2 className="text-base font-bold">Current time worked</h2>

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
