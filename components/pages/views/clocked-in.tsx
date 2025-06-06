import { ExternalLink, Settings } from "lucide-react"
import { useEffect } from "react"
import { Link } from "react-router-dom"

import { ClockedStatus } from "~components/props/dynamic/clock"
import { CurrentTimeClock } from "~components/props/dynamic/current-time"
import { PayPage } from "~components/props/dynamic/pay"
import { TotalTimeClock } from "~components/props/dynamic/total-time"
import { Button } from "~components/ui/button"
import { Separator } from "~components/ui/separator"
import { type Storage } from "~interfaces/interfaces"

interface ClockedInPageProps extends React.ComponentPropsWithoutRef<"div"> {
  tick: number
  onClockOut: () => void
  storage: Storage
}

export function ClockedInPage({
  className,
  tick,
  onClockOut,
  storage,
  ...props
}: Readonly<ClockedInPageProps>) {
  useEffect(() => {
    if (!storage?.preferences?.autoModeEnabled) return

    const interval = setInterval(() => {
      console.log("auto mode tick")
    }, 1000)

    return () => clearInterval(interval)
  }, [storage?.preferences?.autoModeEnabled])

  return (
    <div className={className} {...props}>
      <p className="text-sm text-muted-foreground">
        At a glance, here is your current time worked, total time worked, and
        estimated pay for the week
      </p>

      <ClockedStatus
        className="mt-6"
        tick={tick}
        isClockedIn={true}
        clockedInTime={storage?.clockedTime}
      />
      <CurrentTimeClock
        className="mt-6"
        tick={tick}
        clockedInTime={storage?.clockedTime}
      />
      <TotalTimeClock
        className="mt-6"
        tick={tick}
        isClockedIn={true}
        clockedInTime={storage?.clockedTime}
        existingTime={storage?.timeWorked}
      />
      <PayPage
        className="mt-6"
        tick={tick}
        isClockedIn={true}
        k401DeductionEnabled={storage?.preferences?.k401DeductionEnabled}
        k401DeductionPercentage={storage?.preferences?.k401Percentage}
        clockedInTime={storage?.clockedTime}
        existingTime={storage?.timeWorked}
      />

      <Separator className="my-6" />

      <div className="justifty-between">
        <Button type="button" className="float-left" onClick={onClockOut}>
          <ExternalLink />
          Clock out
        </Button>

        <Link to="/settings">
          <Button type="button" className="float-right">
            <Settings />
            Settings
          </Button>
        </Link>
      </div>
    </div>
  )
}
