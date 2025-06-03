import { ExternalLink, Settings } from "lucide-react"
import { Link } from "react-router-dom"

import { grabTimeFromWorkday } from "~background"
import { Button } from "~components/ui/button"
import { Separator } from "~components/ui/separator"

export function DesyncedPage({
  className,
  ...props
}: Readonly<React.ComponentPropsWithoutRef<"div">>) {
  return (
    <div className={className} {...props}>
      <h2 className="text-base font-bold">No Data Available</h2>
      <p className="text-sm text-muted-foreground">
        Click the button in the footer below to automatically load your data
        from your Workday profile.
      </p>

      <div className="flex-1" />

      <Separator className="my-6" />

      <div className="justifty-between">
        <Button
          type="button"
          className="float-left"
          onClick={grabTimeFromWorkday}>
          <ExternalLink />
          Sync Data
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
