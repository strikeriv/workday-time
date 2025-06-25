import { roundToNearestMinutes } from "date-fns"
import { ExternalLink, Settings } from "lucide-react"
import { Link } from "react-router-dom"

import { ClockedStatus } from "~components/props/dynamic/clock"
import { DayTimeClock } from "~components/props/dynamic/day-time"
import { PayPage } from "~components/props/dynamic/pay"
import { TotalTimeClock } from "~components/props/dynamic/total-time"
import { Button } from "~components/ui/button"
import { Separator } from "~components/ui/separator"
import { type Storage } from "~interfaces/interfaces"
import { calculateDayTimeWorked, durationToMilliseconds } from "~lib/data/time"

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
  function calculateClockOutTime(): number {
    const { lastClockedTime, timeWorkedToday, preferences } = storage
    const { hoursToWork } = preferences

    if (
      lastClockedTime === null ||
      timeWorkedToday === null ||
      preferences === null ||
      hoursToWork === null
    )
      return

    const timeRemaining =
      hoursToWork * 3600000 -
      durationToMilliseconds(
        calculateDayTimeWorked(lastClockedTime, timeWorkedToday)
      )

    return roundToNearestMinutes(new Date().getTime() + timeRemaining).getTime()
  }

  return (
    <div className={className} {...props}>
      <p className="text-sm text-muted-foreground">
        At a glance, here is your current time worked, total time worked, and
        estimated pay for the week
      </p>

      <div className="flex items-center justify-between pt-6">
        <ClockedStatus
          tick={tick}
          isClockedIn={true}
          lastClockedTime={storage?.lastClockedTime}
        />
        <div className="flex flex-row items-start gap-2">
          <ClockedStatus
            tick={tick}
            isClockedIn={false}
            isAlternateText={true}
            lastClockedTime={calculateClockOutTime()}
          />
        </div>
      </div>

      <DayTimeClock
        className="pt-6"
        tick={tick}
        lastClockedInTime={storage?.lastClockedTime}
        timeWorkedToday={storage?.timeWorkedToday}
      />
      <TotalTimeClock
        className="pt-6"
        tick={tick}
        isClockedIn={true}
        lastClockedInTime={storage?.lastClockedTime}
        timeWorkedThisWeek={storage?.timeWorkedThisWeek}
      />
      <PayPage
        className="pt-6"
        tick={tick}
        isClockedIn={true}
        hourlyRate={storage?.hourlyRate}
        k401DeductionEnabled={storage?.preferences?.k401DeductionEnabled}
        k401DeductionPercentage={storage?.preferences?.k401Percentage}
        lastClockedInTime={storage?.lastClockedTime}
        timeWorkedThisWeek={storage?.timeWorkedThisWeek}
      />

      <Separator className="relative left-1/2 right-1/2 my-6 w-[calc(100%+3rem)] -translate-x-1/2" />

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
