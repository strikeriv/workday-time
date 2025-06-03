import { useEffect, useState } from "react"

import type { TimeWorked } from "~interfaces/interfaces"
import { calculateTotalTimeWorked } from "~lib/data/time"

interface PayPageProps extends React.ComponentPropsWithoutRef<"div"> {
  tick: number
  clockedInTime?: number
  existingTime?: TimeWorked
}

export function PayPage({
  className,
  tick,
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

    // TODO: pull from storage
    const deduction = 0.06 * pay // 6% deduction for 401k

    const deductionPay = pay - taxes - deduction

    setEstimatedDeductionsPay(`${deductionPay.toFixed(2)} USD`)
  }

  function calculatePay() {
    const payRate = 25

    const { timeWorkedHours, timeWorkedMinutes, timeWorkedSeconds } =
      calculateTotalTimeWorked(clockedInTime, existingTime)

    const totalPay =
      timeWorkedHours * payRate +
      timeWorkedMinutes * (payRate / 60) +
      timeWorkedSeconds * (payRate / 3600)

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
