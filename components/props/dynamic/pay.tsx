interface PayPageProps extends React.ComponentPropsWithoutRef<"div"> {
  estimatedPay: string
  estimatedPayWithDeductions: string
}

export function PayPage({
  className,
  estimatedPay,
  estimatedPayWithDeductions,
  ...props
}: Readonly<PayPageProps>) {
  return (
    <div className={className} {...props}>
      <h2 className="text-base font-bold">Estimated pay</h2>

      <div className="flex flex-col">
        <p className="text-sm text-muted-foreground">{estimatedPay}</p>
        <p className="text-sm text-muted-foreground">
          {estimatedPayWithDeductions} ( with deductions )
        </p>
      </div>
    </div>
  )
}
