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
import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"

import { sendToBackground } from "@plasmohq/messaging"

import { StorageKeys } from "~constants"
import type {
  ClockedInDuration,
  Storage,
  TimeWorked,
  TotalTimeDuration
} from "~interfaces/interfaces"

import { Status, type StatusHandle } from "../props/status"
import { ClockedInPage } from "./views/clocked-in"
import { NoData } from "./views/no-data"

const workdayURL = "https://wd501.myworkday.com/jbhunt/d/home.htmld"

export function Main({
  className,
  ...props
}: Readonly<React.ComponentPropsWithoutRef<"div">>) {
  const statusRef = useRef<StatusHandle>(null)

  const [time, setTime] = useState<string>("loading...")
  const [totalTime, setTotalTime] = useState<string>("loading...")
  const [clockedTime, setClockedTime] = useState<string>("loading...")
  const [estimatedPay, setEstimatedPay] = useState<string>("loading...")
  const [estimatedPayWithDeductions, setEstimatedPayWithDeductions] =
    useState<string>("loading...")

  async function retrieveNewTimeData() {
    const resp = await sendToBackground({
      name: "grab-time"
    })

    const { message, status } = resp
    if (status !== "GOOD") {
      console.error("Error grabbing time:", message)
      return
    }

    // refresh the status
    statusRef.current?.evaluateStatus()

    console.log("Time grabbed successfully:", message)
  }

  async function getStorageValues(): Promise<Storage> {
    const clockedInKey = StorageKeys.ClockedInTime
    const timeWorkedKey = StorageKeys.TimeWorked
    return (await chrome.storage.local.get([
      clockedInKey,
      timeWorkedKey
    ])) as Storage
  }

  async function clockOut() {
    const resp = await sendToBackground({
      name: "clock-out"
    })

    const { message, status } = resp
    if (status !== "GOOD") {
      console.error("Error clocking out:", message)
      return
    }
  }

  useEffect(() => {
    const interval = setInterval(async () => {
      const values = await getStorageValues()
      if (values.clockedInTime) {
        const clockedInDuration = updateClockedInTimer(
          new Date(values.clockedInTime)
        )
        const totalTimeDuration = updateTotalTimeWorked(
          values.timeWorked,
          clockedInDuration
        )
        const totalPay = updateTotalEstimatedPay(totalTimeDuration)

        updateClockedInTime(values.clockedInTime)
        updateTotalEstimatedPayWithDeductions(totalPay)
      }
    }, 1000) // every second

    return () => clearInterval(interval) // cleanup on unmount
  }, [])

  function updateClockedInTimer(clockedInDate: Date): ClockedInDuration {
    const currentTime = new Date()
    const timeDifference = currentTime.getTime() - clockedInDate.getTime()
    const hoursWorked = Math.floor(timeDifference / (1000 * 60 * 60))
    const minutesWorked = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    )
    const secondsWorked = Math.floor((timeDifference % (1000 * 60)) / 1000)

    console.log(clockedInDate.getHours() < 12 ? "AM" : "PM")
    setTime(
      `${hoursWorked} hours, ${minutesWorked} minutes, ~${secondsWorked} seconds`
    )

    return {
      clockedInHours: hoursWorked,
      clockedInMinutes: minutesWorked,
      clockedInSeconds: secondsWorked
    }
  }

  function updateTotalTimeWorked(
    timeWorked: TimeWorked,
    clockedInDuration: ClockedInDuration
  ): TotalTimeDuration {
    const { clockedInHours, clockedInMinutes, clockedInSeconds } =
      clockedInDuration
    let timeWorkedHours = timeWorked.hours + clockedInHours
    let timeWorkedMinutes = timeWorked.minutes + clockedInMinutes

    if (timeWorkedMinutes >= 60) {
      timeWorkedHours += Math.floor(timeWorkedMinutes / 60)
      timeWorkedMinutes = timeWorkedMinutes % 60
    }

    setTotalTime(
      `${timeWorkedHours} hours, ${timeWorkedMinutes} minutes, ~${clockedInSeconds} seconds`
    )

    return {
      timeWorkedHours,
      timeWorkedMinutes,
      timeWorkedSeconds: clockedInSeconds
    }
  }

  function updateClockedInTime(clockedInTime: number) {
    const clockedInDate = new Date(clockedInTime)
    setClockedTime(
      `${clockedInDate.getHours()}:${clockedInDate.getMinutes()} ${clockedInDate.getHours() < 12 ? "AM" : "PM"}`
    )
  }

  function updateTotalEstimatedPay(totalTimeDuration: TotalTimeDuration) {
    const payRate = 25

    const totalPay =
      totalTimeDuration.timeWorkedHours * payRate +
      totalTimeDuration.timeWorkedMinutes * (payRate / 60) +
      totalTimeDuration.timeWorkedSeconds * (payRate / 3600)

    setEstimatedPay(`${totalPay.toFixed(2)} USD`)

    return totalPay
  }

  function updateTotalEstimatedPayWithDeductions(totalPay: number) {
    const socialSecurity = totalPay * 0.062 // 6.2%
    const medicare = totalPay * 0.0145 // 1.45%
    const federalWithholding = totalPay * 0.06 // 6%
    const stateTax = totalPay * 0.023 // 2.3%

    const taxes = socialSecurity + medicare + federalWithholding + stateTax

    const deduction = 0.06 * totalPay // 6% deduction for 401k

    const estimatedPayAfterDeductions = totalPay - taxes - deduction
    setEstimatedPayWithDeductions(
      `${estimatedPayAfterDeductions.toFixed(2)} USD`
    )
  }

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
              <ClockedInPage
                clockedTime={clockedTime}
                currentTime={time}
                totalTime={totalTime}
                estimatedPay={estimatedPay}
                estimatedPayWithDeductions={estimatedPayWithDeductions}
              />
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
