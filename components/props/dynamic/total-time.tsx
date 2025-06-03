import { Info } from "lucide-react"

import { CustomTooltip } from "../tooltip"

interface TotalTimeClockProps extends React.ComponentPropsWithoutRef<"div"> {
  totalTime: string
}

export function TotalTimeClock({
  className,
  totalTime,
  ...props
}: Readonly<TotalTimeClockProps>) {
  return (
    <div className={className} {...props}>
      <h2 className="text-base font-bold">Total time worked</h2>

      <div className="flex items-center gap-2">
        <p className="text-sm text-muted-foreground">{totalTime}</p>
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
