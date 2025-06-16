import { ExternalLink, Settings } from "lucide-react"
import { Link } from "react-router-dom"

import { ClockedStatus } from "~components/props/dynamic/clock"
import { PayPage } from "~components/props/dynamic/pay"
import { TotalTimeClock } from "~components/props/dynamic/total-time"
import { Button } from "~components/ui/button"
import { Separator } from "~components/ui/separator"
import { type Storage } from "~interfaces/interfaces"

interface ClockedOutPageProps extends React.ComponentPropsWithoutRef<"div"> {
  tick: number
  onClockIn: () => void
  storage: Storage
}

export function ClockedOutPage({
  className,
  tick,
  onClockIn,
  storage,
  ...props
}: Readonly<ClockedOutPageProps>) {
  return (
    <div className={className} {...props}>
      <p className="text-sm text-muted-foreground">
        You are currently clocked out
        <br />
        At a glance, here is your time information and estimated pay for the
        week
        <br />
      </p>

      <ClockedStatus
        className="mt-6"
        tick={tick}
        isClockedIn={false}
        clockedInTime={storage?.clockedTime}
      />
      <TotalTimeClock
        className="mt-6"
        tick={tick}
        isClockedIn={false}
        clockedInTime={storage?.clockedTime}
        existingTime={storage?.timeWorked}
      />
      <PayPage
        className="mt-6"
        tick={tick}
        isClockedIn={false}
        k401DeductionPercentage={storage?.preferences?.k401Percentage}
        clockedInTime={storage?.clockedTime}
        existingTime={storage?.timeWorked}
      />

      <div className="flex-1" />

      <Separator className="my-6" />

      <div className="justifty-between">
        <Button
          type="button"
          className="jbhunt-blue float-left"
          onClick={onClockIn}>
          <ExternalLink />
          Clock in
        </Button>

        <Link to="/settings">
          <Button type="button" className="jbhunt-blue float-right">
            <Settings />
            Settings
          </Button>
        </Link>
      </div>
    </div>
  )
}
