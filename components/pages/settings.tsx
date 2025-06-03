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
import { ArrowLeft, Loader2Icon } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { z } from "zod"

import { wait } from "~background/util"
import { Input } from "~components/ui/input"
import { Switch } from "~components/ui/switch"
import { type Preferences, type Storage } from "~interfaces/interfaces"
import { StorageKeys } from "~lib/constants"
import { getStorage } from "~lib/data/storage"

import { Status } from "../props/status"

const settingsSchema = z.object({
  hoursToWork: z.number().min(0).max(10),
  autoModeEnabled: z.boolean(),
  k401DeductionEnabled: z.boolean(),
  k401Percentage: z.number().min(0).max(100)
})

export function SettingsPage({
  className,
  ...props
}: Readonly<React.ComponentPropsWithoutRef<"div">>) {
  const [saving, setSaving] = useState<boolean>(false)

  const form = useForm({
    defaultValues: {
      hoursToWork: 8,
      autoModeEnabled: false,
      k401DeductionEnabled: false,
      k401Percentage: 6
    }
  })

  async function onSubmit(values: z.infer<typeof settingsSchema>) {
    setSaving(true)

    await chrome.storage.local.set({ [StorageKeys.Preferences]: values })
    await wait(500) // chrome storage is basically instant, so this is just to show the loading state

    setSaving(false)
  }

  async function updateStorageValues(): Promise<void> {
    const storage = await getStorage()

    form.reset(storage.preferences)
  }

  useEffect(() => {
    updateStorageValues()
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
                          max={10}
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
                              e.key !== "Tab"
                            ) {
                              e.preventDefault()
                            }
                          }}
                          className="w-1/5"
                        />
                      </FormControl>
                      <FormLabel className="!my-0 pl-2 text-muted-foreground">
                        Hours to work
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="autoModeEnabled"
                  render={({ field }) => (
                    <FormItem className="flex items-center">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!my-0 pl-2 text-muted-foreground">
                        Auto Mode
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <Separator className="my-6" />

                <p className="text-sm text-muted-foreground">
                  Further settings to customize your experience
                </p>

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
                              e.key !== "Tab"
                            ) {
                              e.preventDefault()
                            }
                          }}
                          className="w-full pr-px"
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

              <Separator className="my-6" />

              <div className="justifty-between">
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
