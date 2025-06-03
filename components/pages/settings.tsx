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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import jbhunt from "data-base64:~assets/jbhunt.png"
import { ArrowLeft, Loader2Icon } from "lucide-react"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { z } from "zod"

import { Input } from "~components/ui/input"
import { Label } from "~components/ui/label"
import { Switch } from "~components/ui/switch"

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
  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      hoursToWork: 8,
      autoModeEnabled: false,
      k401DeductionEnabled: false,
      k401Percentage: 6
    }
  })

  function onSubmit(values: z.infer<typeof settingsSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

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

                {/* <div className="flex w-full items-center">
                  <Input type="number" defaultValue={8} className="w-1/5" />
                  <Label className="pl-2 text-muted-foreground">
                    Hours to work
                  </Label>
                </div> */}

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

                <div>
                  <div className="flex items-center space-x-2">
                    <Switch id="airplane-mode" />
                    <Label
                      className="text-muted-foreground"
                      htmlFor="airplane-mode">
                      Auto mode
                    </Label>
                  </div>
                </div>

                <Separator className="my-6" />

                <p className="text-sm text-muted-foreground">
                  Further settings to customize your experience
                </p>

                <div>
                  <div className="flex items-center space-x-2">
                    <Switch id="airplane-mode" />
                    <Label
                      className="text-muted-foreground"
                      htmlFor="airplane-mode">
                      Include 401k in deductions?
                    </Label>
                  </div>
                </div>

                <div className="flex w-full items-center">
                  <div className="relative w-1/5">
                    <Input
                      id="k401-percentage"
                      type="number"
                      min={0}
                      max={100}
                      step={1}
                      defaultValue={6}
                      className="pr-px" // More padding for spinner + percent
                    />
                    <span className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      %
                    </span>
                  </div>
                  <Label
                    className="pl-2 text-muted-foreground"
                    htmlFor="k401-percentage">
                    401k percentage
                  </Label>
                </div>

                <div className="flex-1" />
              </div>

              <Separator className="my-6" />

              <div className="justifty-between">
                <Button type="submit" className="float-left">
                  Save Settings
                </Button>

                {/* 
                <Button disabled>
                  <Loader2Icon className="animate-spin" />
                  Save Settings
                </Button> */}

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
