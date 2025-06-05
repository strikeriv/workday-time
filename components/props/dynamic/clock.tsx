import { useEffect, useState } from "react"

interface ClockedStatusProps extends React.ComponentPropsWithoutRef<"div"> {
  tick: number
  isClockedIn: boolean
  clockedInTime?: number
}

export function ClockedStatus({
  className,
  tick,
  isClockedIn,
  clockedInTime,
  ...props
}: Readonly<ClockedStatusProps>) {
  const [clockedTime, setClockedTime] = useState<string>("loading...")

  function updateClockedTime() {
    const clockedInDate = new Date(clockedInTime)
    const hours = clockedInDate.getHours()
    const hour12 = hours % 12 === 0 ? 12 : hours % 12
    const minutes = String(clockedInDate.getMinutes()).padStart(2, "0")
    const isAM = hours < 12

    setClockedTime(`${hour12}:${minutes} ${isAM ? "AM" : "PM"}`)
  }

  useEffect(() => {
    if (clockedInTime == null) return

    updateClockedTime()
  }, [tick])

  return (
    <div className={className} {...props}>
      <div>
        <h2 className="text-base font-bold">
          {isClockedIn ? "Clocked in" : "Clocked out"} at
        </h2>

        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">{clockedTime}</p>
        </div>
      </div>
    </div>
  )
}
