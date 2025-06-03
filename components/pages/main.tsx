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

import { sendToBackground } from "@plasmohq/messaging"

import { StorageKeys } from "~constants"
import type { Storage } from "~interfaces/interfaces"

import { Status } from "../props/status"
import { ClockedInPage } from "./views/clocked-in"
import { NoData } from "./views/no-data"

const workdayURL = "https://wd501.myworkday.com/jbhunt/d/home.htmld"

export function Main({
  className,
  ...props
}: Readonly<React.ComponentPropsWithoutRef<"div">>) {
  const [tick, setTick] = useState(0)
  const [storage, setStorage] = useState<Storage>(null)

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  async function getStorageValues(): Promise<void> {
    const clockedInKey = StorageKeys.ClockedInTime
    const timeWorkedKey = StorageKeys.TimeWorked

    setStorage(
      (await chrome.storage.local.get([clockedInKey, timeWorkedKey])) as Storage
    )
  }

  async function clockOut() {
    const resp = await sendToBackground({
      name: "clock-out"
    })

    const { message, status } = resp
    if (status !== "GOOD") {
      console.error("Error clocking out:", message)
    }
  }

  useEffect(() => {
    getStorageValues()
  }, [])

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
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
        <CardContent className="flex h-full flex-col">
          <div className="flex h-full flex-col">
            <Separator className="mb-6" />

            {false ? (
              <NoData />
            ) : (
              <ClockedInPage tick={tick} storage={storage} />
            )}

            <Separator className="my-6" />

            <div className="justifty-between">
              <Button type="button" className="float-left" onClick={clockOut}>
                <ExternalLink />
                Clock out
              </Button>

              <Link to="/settings">
                <Button type="button" className="float-right">
                  <Settings />
                  Settings
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
