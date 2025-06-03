import type { Storage } from "~interfaces/interfaces"

interface ClockedInPageProps extends React.ComponentPropsWithoutRef<"div"> {
  tick: number
  storage: Storage
}

export function ClockedOutPage({
  className,
  tick,
  storage,
  ...props
}: Readonly<ClockedInPageProps>) {
  return (
    <div className={className} {...props}>
      <p className="text-sm text-muted-foreground">
        You are currently clocked out
        <br />
        At a glance, here is your last clocked time, current time worked, total
        time worked, and estimated pay for the week
        <br />
      </p>

      {tick}
      {storage?.preferences?.k401Percentage}

      {/* <ClockedStatus
        className="mt-6"
        isClockedIn={false}
        clockedTime={clockedTime}
      /> */}
      {/* <CurrentTimeClock className="mt-6" currentTime={currentTime} />
      <TotalTimeClock className="mt-6" totalTime={totalTime} />
      <PayPage
        className="mt-6"
        estimatedPay={estimatedPay}
        estimatedPayWithDeductions={estimatedPayWithDeductions}
      /> */}
    </div>
  )
}
