export function NoData({
  className,
  ...props
}: Readonly<React.ComponentPropsWithoutRef<"div">>) {
  return (
    <div className={className} {...props}>
      <h2 className="text-base font-bold">No Data Available</h2>
      <p className="text-gray-500">
        Click the button in the footer below to automatically load your data
        from your Workday profile.
      </p>
    </div>
  )
}
