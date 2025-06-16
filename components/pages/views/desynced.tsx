import { ExternalLink, Settings } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "~components/ui/button"
import { Separator } from "~components/ui/separator"

interface ClockedOutPageProps extends React.ComponentPropsWithoutRef<"div"> {
  onSyncData: () => void
}

export function DesyncedPage({
  className,
  onSyncData,
  ...props
}: Readonly<ClockedOutPageProps>) {
  return (
    <div className={className} {...props}>
      <div className="flex flex-1 flex-col justify-center">
        <h2 className="text-base font-bold">No Data Available</h2>
        <p className="text-sm text-muted-foreground">
          Click the button in the footer below to automatically load your data
          from your Workday profile.
        </p>
      </div>

      <Separator className="my-6" />

      <div className="justifty-between">
        <Button
          type="button"
          className="jbhunt-blue float-left"
          onClick={onSyncData}>
          <ExternalLink />
          Sync Data
        </Button>

        <Link to="/settings">
          <Button type="button" className="jbhunt-blue float-right">
            <Settings />
            Settings
          </Button>
        </Link>
      </div>
    </div>
  )
}
