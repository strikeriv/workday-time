import { format } from "date-fns"
import { Info } from "lucide-react"
import { useEffect, useState } from "react"

import { CustomTooltip } from "../tooltip"

interface ClockedStatusProps extends React.ComponentPropsWithoutRef<"div"> {
  tick: number
  isClockedIn: boolean
  isAlternateText?: boolean
  lastClockedTime?: number
}

export function ClockedStatus({
  className,
  tick,
  isClockedIn,
  isAlternateText,
  lastClockedTime,
  ...props
}: Readonly<ClockedStatusProps>) {
  const [time, setTime] = useState<string>("loading...")

  function updateClockedTime() {
    setTime(format(new Date(lastClockedTime), "h:mm a"))
  }

  useEffect(() => {
    if (lastClockedTime == null) return

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
