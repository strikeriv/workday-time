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
import { StorageKeys } from "~constants"
import { Status as StatusType, type Storage } from "~interfaces/interfaces"

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

  async function getStorageValues(): Promise<void> {
    let values: Storage = (await chrome.storage.local.get([
      StorageKeys.ClockedInTime,
      StorageKeys.TimeWorked,
      StorageKeys.Preferences,
      StorageKeys.LastUpdated,
      StorageKeys.Status
    ])) as Storage

    // check to see if values exist, if not, set them to default values
    if (!values[StorageKeys.ClockedInTime] || !values[StorageKeys.TimeWorked]) {
      values = {
        [StorageKeys.Preferences]: {
          hoursToWork: 8,
          autoModeEnabled: false,
          k401DeductionEnabled: false,
          k401Percentage: 6
        },
        [StorageKeys.LastUpdated]: Date.now(),
        [StorageKeys.ClockedInTime]: null,
        [StorageKeys.TimeWorked]: null,
        [StorageKeys.Status]: StatusType.Unknown
      }

      await chrome.storage.local.set(values)
    }

    setStorage(values)
    setStatus(values.status)
  }

  async function clockOut() {
    setStatus(
      status === StatusType.ClockedIn
        ? StatusType.ClockedOut
        : StatusType.ClockedIn
    )
    // const resp = await sendToBackground({
    //   name: "clock-out"
    // })

    // const { message, status } = resp
    // if (status !== "GOOD") {
    //   console.error("Error clocking out:", message)
    // }
  }

  useEffect(() => {
    getStorageValues()
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
                  className="flex h-full flex-1 flex-col"
                  tick={tick}
                  storage={storage}
                />
              )
            } else {
              content = (
                <ClockedOutPage
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
