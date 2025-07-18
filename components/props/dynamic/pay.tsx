import { type Duration } from "date-fns"
import { useEffect, useState } from "react"

import { DeductionPercentages } from "~lib/constants"
import {
  calculateTotalTimeWorked,
  durationToMilliseconds
} from "~lib/data/time"

interface PayPageProps extends React.ComponentPropsWithoutRef<"div"> {
  tick: number
  isClockedIn: boolean
  hourlyRate: number
  k401DeductionEnabled?: boolean
  k401DeductionPercentage?: number
  lastClockedInTime: number
  timeWorkedThisWeek: Duration
}

export function PayPage({
  className,
  tick,
  isClockedIn,
  hourlyRate,
  k401DeductionEnabled,
  k401DeductionPercentage,
  lastClockedInTime,
  timeWorkedThisWeek,
  ...props
}: Readonly<PayPageProps>) {
  const [estimatedPay, setEstimatedPay] = useState<string>("loading...")
  const [estimatedDeductionsPay, setEstimatedDeductionsPay] =
    useState<string>("loading...")

  function updatePayEstimation(pay: number) {
    setEstimatedPay(`${pay.toFixed(2)} USD`)
  }

  function updatePayWithDeductionsEstimation(pay: number) {
    const socialSecurity = pay * DeductionPercentages.SocialSecurity
    const medicare = pay * DeductionPercentages.Medicare
    const federalWithholding = DeductionPercentages.FederalWitholding
    const stateTax = pay * DeductionPercentages.StateTax

    const taxes = socialSecurity + medicare + federalWithholding + stateTax
    const deductions = k401DeductionEnabled
      ? (k401DeductionPercentage / 100) * pay
      : 0

    const deductionPay = pay - taxes - deductions

    setEstimatedDeductionsPay(`${deductionPay.toFixed(2)} USD`)
  }

  function calculatePay() {
    const timeWorkedInMilliseconds = durationToMilliseconds(
      calculateTotalTimeWorked(
        lastClockedInTime,
        timeWorkedThisWeek,
        isClockedIn
      )
    )

    return (timeWorkedInMilliseconds / 3600000) * hourlyRate
  }

  useEffect(() => {
    if (lastClockedInTime == null) return
    if (timeWorkedThisWeek == null) return

    const pay = calculatePay()

    updatePayEstimation(pay)
    updatePayWithDeductionsEstimation(pay)
  }, [tick])

  return (
    <div className={className} {...props}>
      <h2 className="text-base font-bold">Estimated pay</h2>

      <div className="flex flex-col">
        <p className="text-sm text-muted-foreground">{estimatedPay}</p>
        <p className="text-sm text-muted-foreground">
          {estimatedDeductionsPay} (with included deductions)
        </p>
      </div>
    </div>
  )
}
