import { ClockedStatus } from "~components/props/dynamic/clock"
import { CurrentTimeClock } from "~components/props/dynamic/current-time"
import { PayPage } from "~components/props/dynamic/pay"
import { TotalTimeClock } from "~components/props/dynamic/total-time"
import type { Storage } from "~interfaces/interfaces"

interface ClockedInPageProps extends React.ComponentPropsWithoutRef<"div"> {
  tick: number
  storage: Storage
}

export function ClockedInPage({
  className,
  tick,
  storage,
  ...props
}: Readonly<ClockedInPageProps>) {
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
        clockedInTime={storage?.clockedInTime}
      />
      <CurrentTimeClock
        className="mt-6"
        tick={tick}
        clockedInTime={storage?.clockedInTime}
      />
      <TotalTimeClock
        className="mt-6"
        tick={tick}
        clockedInTime={storage?.clockedInTime}
        existingTime={storage?.timeWorked}
      />
      <PayPage
        className="mt-6"
        tick={tick}
        clockedInTime={storage?.clockedInTime}
        existingTime={storage?.timeWorked}
      />
    </div>
  )
}
