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
        lastClockedTime={storage?.lastClockedTime}
      />
      <TotalTimeClock
        className="mt-6"
        tick={tick}
        isClockedIn={false}
        lastClockedInTime={storage?.lastClockedTime}
        timeWorkedThisWeek={storage?.timeWorkedThisWeek}
      />
      <PayPage
        className="mt-6"
        tick={tick}
        isClockedIn={false}
        hourlyRate={storage?.hourlyRate}
        k401DeductionPercentage={storage?.preferences?.k401Percentage}
        lastClockedInTime={storage?.lastClockedTime}
        timeWorkedThisWeek={storage?.timeWorkedThisWeek}
      />

      <div className="flex-1" />

      <Separator className="relative left-1/2 right-1/2 my-6 w-[calc(100%+3rem)] -translate-x-1/2" />

      <div className="flex justify-between">
        <Button type="button" className="float-left" onClick={onClockIn}>
          <ExternalLink />
          Clock In
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
