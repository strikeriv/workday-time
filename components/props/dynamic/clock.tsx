import { format, isSameDay, isSameWeek } from "date-fns"
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
    // see if the last clocked time is a previous day
    if (!isSameWeek(new Date(lastClockedTime), new Date())) {
      setTime(`Last ${format(new Date(lastClockedTime), "EEEE, h:mm a")}`)
    } else if (isSameDay(new Date(lastClockedTime), new Date())) {
      setTime(`Today, ${format(new Date(lastClockedTime), "h:mm a")}`)
    } else {
      // format between yesterday and previous days
      const yesterday = new Date()
      yesterday.setDate(new Date().getDate() - 1)

      if (isSameDay(new Date(lastClockedTime), new Date(yesterday))) {
        setTime(`Yesterday, ${format(new Date(lastClockedTime), "h:mm a")}`)
      } else {
        setTime(format(new Date(lastClockedTime), "EEEE, h:mm a"))
      }
    }
  }

  useEffect(() => {
    if (lastClockedTime == null) return

    updateClockedTime()
  }, [tick])

  let buttonText = "Clocked in"
  if (!isClockedIn) {
    if (isAlternateText) {
      buttonText = "Clocking out"
    } else {
      buttonText = "Clocked out"
    }
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
