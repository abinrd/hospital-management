"use client"

import type React from "react"

import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { Stethoscope, Calendar, User, Lock, Award, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Toaster } from "sonner"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

type TimeSlot = {
  day: string
  slots: string[]
}

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const timeSlots = [
  "09:00-09:30",
  "09:30-10:00",
  "10:00-10:30",
  "10:30-11:00",
  "11:00-11:30",
  "11:30-12:00",
  "14:00-14:30",
  "14:30-15:00",
  "15:00-15:30",
  "15:30-16:00",
  "16:00-16:30",
  "16:30-17:00",
]

export default function DoctorRegister() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentTab, setCurrentTab] = useState("personal")

  const [formData, setFormData] = useState<{
    name: string
    password: string
    specialization: string
    availableTimeSlots: TimeSlot[]
  }>({
    name: "",
    password: "",
    specialization: "",
    availableTimeSlots: [],
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleTimeSlotChange = (day: string, slot: string) => {
    setFormData((prev) => {
      const updatedSlots = [...prev.availableTimeSlots]
      const dayIndex = updatedSlots.findIndex((d) => d.day === day)

      if (dayIndex !== -1) {
        // If the day exists, update its slots
        const slots = updatedSlots[dayIndex].slots
        if (slots.includes(slot)) {
          updatedSlots[dayIndex].slots = slots.filter((s) => s !== slot)
        } else {
          updatedSlots[dayIndex].slots.push(slot)
        }
      } else {
        // If the day doesn't exist, add it
        updatedSlots.push({ day, slots: [slot] })
      }

      return { ...prev, availableTimeSlots: updatedSlots }
    })
  }

  const isSlotSelected = (day: string, slot: string) => {
    return formData.availableTimeSlots.some((d) => d.day === day && d.slots.includes(slot))
  }

  const resetDaySlots = (day: string) => {
    setFormData((prev) => {
      const updatedSlots = prev.availableTimeSlots.filter((d) => d.day !== day)
      return { ...prev, availableTimeSlots: updatedSlots }
    })
    toast.success(`Time slots for ${day} have been reset`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) {
      toast.error("Invalid token", {
        description: "Please use a valid registration link.",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("http://localhost:5500/api/v1/auth/complete-doctor-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, token }),
      })

      const data = await response.json()
      if (response.ok) {
        toast.success("Registration Successful!", {
          description: "You can now log in to your account.",
        })
      } else {
        toast.error("Registration failed", {
          description: data.message || "Please try again later.",
        })
      }
    } catch (error) {
      toast.error("Error", {
        description: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextTab = () => {
    if (currentTab === "personal") setCurrentTab("schedule")
  }

  const prevTab = () => {
    if (currentTab === "schedule") setCurrentTab("personal")
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <Toaster position="top-center" />
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-center mb-8">
          <div className="bg-primary/10 p-3 rounded-full">
            <Stethoscope className="h-8 w-8 text-primary" />
          </div>
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary">Complete Your Registration</CardTitle>
            <CardDescription className="text-muted-foreground text-lg">
              Set up your profile and availability to start accepting appointments
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
              <div className="px-6">
                <TabsList className="grid grid-cols-2 w-full mb-6">
                  <TabsTrigger
                    value="personal"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Personal Info
                  </TabsTrigger>
                  <TabsTrigger
                    value="schedule"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Availability
                  </TabsTrigger>
                </TabsList>
              </div>

              <CardContent>
                <TabsContent value="personal" className="space-y-4 mt-0">
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          name="name"
                          placeholder="Dr. Jane Smith"
                          className="pl-10"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          placeholder="Create a secure password"
                          className="pl-10"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="specialization">Specialization</Label>
                      <div className="relative">
                        <Award className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="specialization"
                          name="specialization"
                          placeholder="e.g. Cardiology, Pediatrics"
                          className="pl-10"
                          value={formData.specialization}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button type="button" onClick={nextTab}>
                      Next: Set Availability
                      <Calendar className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="schedule" className="mt-0">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Select Your Available Time Slots</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Click on the time slots when you're available to see patients. You can update this later.
                      </p>
                    </div>

                    <div className="space-y-6">
                      {weekdays.map((day) => (
                        <div key={day} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-primary">{day}</h4>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => resetDaySlots(day)}
                              className="h-7 text-xs text-muted-foreground hover:text-destructive"
                            >
                              Reset Day
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {timeSlots.map((slot) => {
                              const selected = isSlotSelected(day, slot)
                              return (
                                <Badge
                                  key={`${day}-${slot}`}
                                  variant={selected ? "default" : "outline"}
                                  className={cn(
                                    "cursor-pointer transition-all hover:bg-primary/90 hover:text-primary-foreground",
                                    selected ? "bg-primary text-primary-foreground" : "bg-background",
                                  )}
                                  onClick={() => handleTimeSlotChange(day, slot)}
                                >
                                  {selected && <Check className="mr-1 h-3 w-3" />}
                                  {slot}
                                </Badge>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between mt-6">
                    <Button type="button" variant="outline" onClick={prevTab}>
                      Back to Personal Info
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Registering...
                        </>
                      ) : (
                        <>Complete Registration</>
                      )}
                    </Button>
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </form>

          <CardFooter className="flex justify-center border-t p-6">
            <p className="text-sm text-muted-foreground">
              By registering, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}

