import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "~components/ui/tooltip"

type CustomTooltipProps = {
  icon: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function CustomTooltip({
  icon,
  children,
  className
}: Readonly<CustomTooltipProps>) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{icon}</TooltipTrigger>
        <TooltipContent className={className}>{children}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
