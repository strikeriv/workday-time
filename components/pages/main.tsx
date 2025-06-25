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
import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import { MessageStatus, type Message } from "~background/interfaces/interfaces"
import { StatusBar } from "~components/props/status"
import { type Storage } from "~interfaces/interfaces"
import { Status } from "~lib/constants"
import { evaluateAlarmStatus } from "~lib/data/alarm"
import { getStorage } from "~lib/data/storage"

import { ClockedInPage } from "./views/clocked-in"
import { ClockedOutPage } from "./views/clocked-out"
import { DesyncedPage } from "./views/desynced"

export function Main({
  className,
  ...props
}: Readonly<React.ComponentPropsWithoutRef<"div">>) {
  const [tick, setTick] = useState(0)
  const [refresh, setRefresh] = useState(0)

  const [status, setStatus] = useState<Status>(null)
  const [storage, setStorage] = useState<Storage>(null)

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  async function updateStorageValues(): Promise<Storage> {
    const storage = await getStorage()

    setStorage(storage)
    setStatus(storage.status)

    return storage
  }

  async function handleClockIn() {
    const resp: Message = await sendToBackground({
      name: "clock-in"
    })

    if (resp.status === MessageStatus.Success) {
      console.log("Clocked in successfully.")
      setRefresh((r) => r + 1) // trigger a refresh
    }
  }

  async function handleClockOut() {
    const resp: Message = await sendToBackground({
      name: "clock-out"
    })

    if (resp.status === MessageStatus.Success) {
      console.log("Clocked out successfully.")
      setRefresh((r) => r + 1) // trigger a refresh
    }
  }

  async function handleSyncingData() {
    const resp: Message = await sendToBackground({ name: "sync-data" })
    if (resp.status === MessageStatus.Success) {
      console.log("Data synced successfully.")

      setRefresh((r) => r + 1) // trigger a refresh
    }
  }

  useEffect(() => {
    async function onRefresh() {
      const instantStorage = await updateStorageValues()
      await evaluateAlarmStatus(instantStorage.preferences.notificationsEnabled)
    }

    onRefresh()
  }, [refresh])

  return (
    <div className={cn("flex h-full flex-col", className)} {...props}>
      <Card className="flex h-full flex-col">
        <CardHeader>
          <CardTitle>
            <div className="flex w-full items-center">
              <img src={jbhunt} className="w-32" alt="J.B. Hunt Logo"></img>
              <h1 className="pl-2 text-xl">Workday Time</h1>
              <StatusBar className="float-right ml-auto" storage={storage} />
            </div>
          </CardTitle>
          <CardDescription>
            An extention to make Workday life easier
          </CardDescription>
        </CardHeader>
        <CardContent className="flex h-full flex-1 flex-col">
          <Separator className="relative left-1/2 right-1/2 mb-6 w-[calc(100%+3rem)] -translate-x-1/2" />

          {(() => {
            let content
            if (status === Status.Desynced) {
              content = (
                <DesyncedPage
                  onSyncData={handleSyncingData}
                  storage={storage}
                  className="flex h-full flex-1 flex-col justify-center"
                />
              )
            } else if (status === Status.ClockedIn) {
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
