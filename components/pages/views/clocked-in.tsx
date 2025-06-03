import { ClockedStatus } from "~components/props/dynamic/clock"
import { CurrentTimeClock } from "~components/props/dynamic/current-time"
import { PayPage } from "~components/props/dynamic/pay"
import { TotalTimeClock } from "~components/props/dynamic/total-time"

interface ClockedInPageProps extends React.ComponentPropsWithoutRef<"div"> {
  clockedTime: string
  currentTime: string
  totalTime: string
  estimatedPay: string
  estimatedPayWithDeductions: string
}

export function ClockedInPage({
  className,
  clockedTime,
  currentTime,
  totalTime,
  estimatedPay,
  estimatedPayWithDeductions,
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
        isClockedIn={true}
        clockedTime={clockedTime}
      />
      <CurrentTimeClock className="mt-6" currentTime={currentTime} />
      <TotalTimeClock className="mt-6" totalTime={totalTime} />
      <PayPage
        className="mt-6"
        estimatedPay={estimatedPay}
        estimatedPayWithDeductions={estimatedPayWithDeductions}
      />
    </div>
  )
}
