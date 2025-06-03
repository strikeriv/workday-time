import { Info } from "lucide-react"

import { CustomTooltip } from "../tooltip"

interface CurrentTimeClockProps extends React.ComponentPropsWithoutRef<"div"> {
  currentTime: string
}

export function CurrentTimeClock({
  className,
  currentTime,
  ...props
}: Readonly<CurrentTimeClockProps>) {
  return (
    <div className={className} {...props}>
      <h2 className="text-base font-bold">Current time worked</h2>

      <div className="flex items-center gap-2">
        <p className="text-sm text-muted-foreground">{currentTime}</p>
        <CustomTooltip icon={<Info width="1em" height="1em" />}>
          <p>
            Workday does not show seconds in its data.
            <br />
            Hence, why this value is approximate.
          </p>
        </CustomTooltip>
      </div>
    </div>
  )
}
