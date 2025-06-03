interface ClockedStatusProps extends React.ComponentPropsWithoutRef<"div"> {
  isClockedIn: boolean
  clockedTime: string
}

export function ClockedStatus({
  className,
  isClockedIn,
  clockedTime,
  ...props
}: Readonly<ClockedStatusProps>) {
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
