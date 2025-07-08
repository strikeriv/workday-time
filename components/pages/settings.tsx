import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import jbhunt from "data-base64:~assets/jbhunt.png"
import { ArrowLeft, Info, Loader2Icon } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { z } from "zod"

import { wait } from "~background/util/misc"
import { CustomTooltip } from "~components/props/tooltip"
import { Input } from "~components/ui/input"
import { Switch } from "~components/ui/switch"
import { type Preferences, type Storage } from "~interfaces/interfaces"
import { StorageKeys } from "~lib/constants"
import { evaluateAlarmStatus } from "~lib/data/alarm"
import { getStorage, updateStorage } from "~lib/data/storage"

import { StatusBar } from "../props/status"

const settingsSchema = z.object({
  hoursToWork: z.number().min(0).max(10),
  notificationsEnabled: z.boolean(),
  k401DeductionEnabled: z.boolean(),
  k401Percentage: z.number().min(0).max(100)
})

export function SettingsPage({
  className,
  ...props
}: Readonly<React.ComponentPropsWithoutRef<"div">>) {
  const [saving, setSaving] = useState<boolean>(false)

  const [storage, setStorage] = useState<Storage>(null)

  const form = useForm({
    defaultValues: {
      hoursToWork: 8,
      notificationsEnabled: false,
      k401DeductionEnabled: false,
      k401Percentage: 6
    }
  })

  async function onSubmit(values: z.infer<typeof settingsSchema>) {
    setSaving(true)

    const previousHours = storage?.preferences?.hoursToWork ?? 8
    await updateStorage({ [StorageKeys.Preferences]: values as Preferences })

    // evaluate whether we need to create or update the alarm
    // TODO: come back and see if we can match directly on top of the clock in time
    await evaluateAlarmStatus(values.notificationsEnabled, {
      shouldRecreateAlarm: values.hoursToWork !== previousHours
    })

    await updateStorageValues()
    await wait(500) // instant save, purely for UI feedback

    // reupdate storage values
    setSaving(false)
  }

  function calculateAlarmDelay() {
    const { lastClockedTime } = storage
    const clockedInMs = new Date(lastClockedTime).getTime()
    const normalTime = clockedInMs + 30000 // 30 seconds after clocked in time;

    const currentTime = new Date().getTime()
    const delay = normalTime - currentTime

    return delay

    // these milliseconds
  }

  async function updateStorageValues(): Promise<void> {
    const storage = await getStorage()

    setStorage(storage)
    form.reset(storage.preferences)
  }

  useEffect(() => {
    updateStorageValues()
  }, [])

  return (
    <div className={cn("flex h-full flex-col", className)} {...props}>
      <Card className="flex h-full flex-col rounded-none">
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

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-1 flex-col space-y-6">
                <p className="text-sm text-muted-foreground">
                  Adjust your settings below to customize the extension
                </p>

                <FormField
                  control={form.control}
                  name="hoursToWork"
                  render={({ field }) => (
                    <FormItem className="flex w-full items-center">
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          max={11}
                          step={0.25}
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                          onKeyDown={(e) => {
                            if (
                              e.key !== "ArrowUp" &&
                              e.key !== "ArrowDown" &&
                              e.key !== "Tab" &&
                              e.key !== "Enter" // allow Enter key for saving
                            ) {
                              e.preventDefault()
                            }
                          }}
                          className="w-1/4"
                        />
                      </FormControl>
                      <FormLabel className="!my-0 pl-2 text-muted-foreground">
                        Hours to work
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center space-x-2">
                  <FormField
                    control={form.control}
                    name="notificationsEnabled"
                    render={({ field }) => (
                      <FormItem className="flex items-center">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="!my-0 pl-2 text-muted-foreground">
                          Enable notifications
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <CustomTooltip icon={<Info width="1em" height="1em" />}>
                    <p>
                      This setting will enable or disable notifications
                      <br />
                      for when you are close to clocking out, based on your
                      <br />
                      "hours to work" preference above, at the following
                      intervals:
                      <br />
                      <br />
                      <ul className="list-disc pl-6">
                        <li>15 minutes before clocking out</li>
                        <li>5 minutes before clocking out</li>
                        <li>1 minute before clocking out</li>
                        <li>every 30 seconds after clock out time</li>
                      </ul>
                    </p>
                  </CustomTooltip>
                </div>

                <Separator className="relative left-1/2 right-1/2 my-6 w-[calc(100%+3rem)] -translate-x-1/2" />

                <p className="text-sm text-muted-foreground">
                  Further settings to customize your experience
                </p>

                <div className="flex items-center space-x-2">
                  <FormField
                    control={form.control}
                    name="k401DeductionEnabled"
                    render={({ field }) => (
                      <FormItem className="flex items-center">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="!my-0 pl-2 text-muted-foreground">
                          Include 401k into deduction
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <CustomTooltip icon={<Info width="1em" height="1em" />}>
                    <p>
                      If you have a 401k deduction, you can
                      <br />
                      enable this setting
                      <br />
                      <br />
                      Generally, only annual interns will have
                      <br />a 401k set up
                      <br />
                    </p>
                  </CustomTooltip>
                </div>
                <FormField
                  control={form.control}
                  name="k401Percentage"
                  render={({ field }) => (
                    <FormItem className="flex w-full items-center">
                      <div className="relative w-1/5">
                        <Input
                          type="number"
                          min={0}
                          max={99}
                          step={1}
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                          onKeyDown={(e) => {
                            if (
                              e.key !== "ArrowUp" &&
                              e.key !== "ArrowDown" &&
                              e.key !== "Tab" &&
                              e.key !== "Enter" // allow Enter key for saving
                            ) {
                              e.preventDefault()
                            }
                          }}
                          className="w-full pr-px"
                          disabled={!form.watch("k401DeductionEnabled")}
                        />
                        <span className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                          %
                        </span>
                      </div>
                      <FormLabel className="!my-0 pl-2 text-muted-foreground">
                        401k percentage
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex-1" />
              </div>

              <Separator className="relative left-1/2 right-1/2 my-6 w-[calc(100%+3rem)] -translate-x-1/2" />

              <div className="flex justify-between">
                {saving ? (
                  <Button disabled>
                    <Loader2Icon className="animate-spin" />
                    Saving Settings...
                  </Button>
                ) : (
                  <Button type="submit" className="float-left">
                    Save Settings
                  </Button>
                )}

                <Link to="/">
                  <Button type="button" className="float-right">
                    <ArrowLeft />
                    Back
                  </Button>
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
