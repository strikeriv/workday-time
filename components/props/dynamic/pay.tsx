import { useEffect, useState } from "react"

import type { TimeWorked } from "~interfaces/interfaces"
import { calculateTotalTimeWorked } from "~lib/data/time"

interface PayPageProps extends React.ComponentPropsWithoutRef<"div"> {
  tick: number
  isClockedIn: boolean
  hourlyRate: number
  k401DeductionEnabled?: boolean
  k401DeductionPercentage?: number
  clockedInTime: number
  existingTime: TimeWorked
}

export function PayPage({
  className,
  tick,
  isClockedIn,
  hourlyRate,
  k401DeductionEnabled,
  k401DeductionPercentage,
  clockedInTime,
  existingTime,
  ...props
}: Readonly<PayPageProps>) {
  const [estimatedPay, setEstimatedPay] = useState<string>("loading...")
  const [estimatedDeductionsPay, setEstimatedDeductionsPay] =
    useState<string>("loading...")

  function updatePayEstimation(pay: number) {
    setEstimatedPay(`${pay.toFixed(2)} USD`)
  }

  function updatePayWithDeductionsEstimation(pay: number) {
    const socialSecurity = pay * 0.062 // 6.2%
    const medicare = pay * 0.0145 // 1.45%
    const federalWithholding = pay * 0.06 // 6%
    const stateTax = pay * 0.023 // 2.3%

    const taxes = socialSecurity + medicare + federalWithholding + stateTax
    const deductions = k401DeductionEnabled
      ? (k401DeductionPercentage / 100) * pay
      : 0

    const deductionPay = pay - taxes - deductions

    setEstimatedDeductionsPay(`${deductionPay.toFixed(2)} USD`)
  }

  function calculatePay() {
    const { timeWorkedHours, timeWorkedMinutes, timeWorkedSeconds } =
      calculateTotalTimeWorked(clockedInTime, existingTime, isClockedIn)

    const totalPay =
      timeWorkedHours * hourlyRate +
      timeWorkedMinutes * (hourlyRate / 60) +
      timeWorkedSeconds * (hourlyRate / 3600)

    return totalPay
  }

  useEffect(() => {
    if (clockedInTime == null) return
    if (clockedInTime == null) return

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
          {estimatedDeductionsPay} ( with deductions )
        </p>
      </div>
    </div>
  )
}
