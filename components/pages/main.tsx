import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import jbhunt from "data-base64:~assets/jbhunt.png"
import { ExternalLink, Settings } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { Status } from "~components/props/status"
import { Status as StatusType, type Storage } from "~interfaces/interfaces"
import { StorageKeys } from "~lib/constants"
import { getStorage } from "~lib/data/storage"

import { ClockedInPage } from "./views/clocked-in"
import { ClockedOutPage } from "./views/clocked-out"
import { DesyncedPage } from "./views/desynced"

const workdayURL = "https://wd501.myworkday.com/jbhunt/d/home.htmld"

export function Main({
  className,
  ...props
}: Readonly<React.ComponentPropsWithoutRef<"div">>) {
  const [tick, setTick] = useState(0)
  const [status, setStatus] = useState<StatusType>(null)
  const [storage, setStorage] = useState<Storage>(null)

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  async function updateStorageValues(): Promise<void> {
    const storage = await getStorage()

    setStorage(storage)
    setStatus(storage.status)
  }

  async function handleClockIn() {
    await chrome.storage.local.set({
      [StorageKeys.Status]: StatusType.ClockedIn
    })
    // Optionally re-fetch storage here
    setStatus(StatusType.ClockedIn)
  }

  async function handleClockOut() {
    await chrome.storage.local.set({
      [StorageKeys.Status]: StatusType.ClockedOut
    })
    // Optionally re-fetch storage here
    setStatus(StatusType.ClockedOut)
  }

  useEffect(() => {
    updateStorageValues()
  }, [])

  return (
    <div className={cn("flex h-full flex-col", className)} {...props}>
      <Card className="flex h-full flex-col">
        <CardHeader>
          <CardTitle>
            <div className="flex w-full items-center">
              <img src={jbhunt} className="w-32" alt="J.B. HUNT Logo"></img>
              <h1 className="pl-2 text-xl">Workday Time</h1>
              <Status className="float-right ml-auto" />
            </div>
          </CardTitle>
          <CardDescription>
            An extention to make Workday life easier
          </CardDescription>
        </CardHeader>
        <CardContent className="flex h-full flex-1 flex-col">
          <Separator className="mb-6" />

          {(() => {
            let content
            if (status === StatusType.Unknown) {
              content = <DesyncedPage className="flex h-full flex-1 flex-col" />
            } else if (status === StatusType.ClockedIn) {
              content = (
                <ClockedInPage
                  onClockOut={handleClockOut}
                  className="flex h-full flex-1 flex-col"
                  tick={tick}
                  storage={storage}
                />
              )
            } else {
              content = (
                <ClockedOutPage
                  onClockIn={handleClockIn}
                  className="flex h-full flex-1 flex-col"
                  tick={tick}
                  storage={storage}
                />
              )
            }
            return content
          })()}
        </CardContent>
      </Card>
    </div>
  )
}
