import { Info } from "lucide-react"
import { useEffect, useState } from "react"

import { CustomTooltip } from "../tooltip"

interface ClockedStatusProps extends React.ComponentPropsWithoutRef<"div"> {
  tick: number
  isClockedIn: boolean
  isAlternateText?: boolean
  clockedTime?: number
}

export function ClockedStatus({
  className,
  tick,
  isClockedIn,
  isAlternateText,
  clockedTime,
  ...props
}: Readonly<ClockedStatusProps>) {
  const [time, setTime] = useState<string>("loading...")

  function updateClockedTime() {
    const clockedInDate = new Date(clockedTime)
    const hours = clockedInDate.getHours()
    const hour12 = hours % 12 === 0 ? 12 : hours % 12
    const minutes = String(clockedInDate.getMinutes()).padStart(2, "0")
    const isAM = hours < 12

    setTime(`${hour12}:${minutes} ${isAM ? "AM" : "PM"}`)
  }

  useEffect(() => {
    if (time == null) return

    updateClockedTime()
  }, [tick])

  let buttonText = "Clocked in"
  if (!isClockedIn) {
    buttonText = isAlternateText ? "Clocking out" : "Clocked out"
  }

  return (
    <div className={className} {...props}>
      <div>
        <h2 className="text-base font-bold">{buttonText} at</h2>

        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">{time}</p>

          {isAlternateText && (
            <CustomTooltip
              className="pt-1"
              icon={<Info width="1em" height="1em" />}>
              <p>
                Time to clock out based on your
                <br />
                "hours to work" preference
              </p>
            </CustomTooltip>
          )}
        </div>
      </div>
    </div>
  )
}
