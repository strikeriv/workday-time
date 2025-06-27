import { ExternalLink, Settings } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "~components/ui/button"
import { Separator } from "~components/ui/separator"
import type { Storage } from "~interfaces/interfaces"
import { doStorageKeysExist } from "~lib/data/storage"

interface ClockedOutPageProps extends React.ComponentPropsWithoutRef<"div"> {
  storage: Storage
  onSyncData: () => void
}

export function DesyncedPage({
  className,
  storage,
  onSyncData,
  ...props
}: Readonly<ClockedOutPageProps>) {
  const isDataAvailable = doStorageKeysExist(storage)

  return (
    <div className={className} {...props}>
      <div className="flex flex-1 flex-col justify-center">
        <div className="flex flex-1 flex-col justify-center">
          {isDataAvailable ? (
            <>
              <h2 className="text-base font-bold">Data Out Of Sync</h2>
              <p className="text-sm text-muted-foreground">
                The data in your browser is out of sync with your Workday
                profile.
                <br />
                <br />
                This can happen if you have not synced your data in a while or
                if there was an error during the last sync.
                <br />
                <br />
                Click the button in the footer below to automatically load your
                data from your Workday profile.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-base font-bold">No Data Available</h2>
              <p className="text-sm text-muted-foreground">
                Click the button in the footer below to automatically load your
                data from your Workday profile.
              </p>
            </>
          )}
        </div>
      </div>

      <Separator className="relative left-1/2 right-1/2 my-6 w-[calc(100%+3rem)] -translate-x-1/2" />

      <div className="justifty-between">
        <Button type="button" className="float-left" onClick={onSyncData}>
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
