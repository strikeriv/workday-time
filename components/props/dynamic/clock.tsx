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

    setClockedTime(
      `${clockedInDate.getHours()}:${clockedInDate.getMinutes()} ${clockedInDate.getHours() < 12 ? "AM" : "PM"}`
    )
  }

  useEffect(() => {
    if (!clockedInTime) return

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
