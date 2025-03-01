"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft } from "lucide-react"

export default function DoctorAvailability() {
  const router = useRouter()
  
  // Mock data for time slots
  const timeSlots = [
    { id: 1, day: "Monday", start: "09:00", end: "10:00" },
    { id: 2, day: "Monday", start: "10:30", end: "11:30" },
    { id: 3, day: "Monday", start: "13:00", end: "14:00" },
    { id: 4, day: "Monday", start: "14:30", end: "15:30" },
    { id: 5, day: "Tuesday", start: "09:00", end: "10:00" },
    { id: 6, day: "Tuesday", start: "10:30", end: "11:30" },
    { id: 7, day: "Wednesday", start: "13:00", end: "14:00" },
    { id: 8, day: "Wednesday", start: "14:30", end: "15:30" },
    { id: 9, day: "Thursday", start: "09:00", end: "10:00" },
    { id: 10, day: "Thursday", start: "10:30", end: "11:30" },
    { id: 11, day: "Friday", start: "13:00", end: "14:00" },
    { id: 12, day: "Friday", start: "14:30", end: "15:30" },
  ]
  
  const [slots, setSlots] = useState(timeSlots)
  const [newSlot, setNewSlot] = useState({ day: "Monday", start: "09:00", end: "10:00" })
  
  const handleAddSlot = () => {
    const id = Math.max(...slots.map(slot => slot.id), 0) + 1
    setSlots([...slots, { id, ...newSlot }])
  }
  
  const handleDeleteSlot = (id: number) => {
    setSlots(slots.filter(slot => slot.id !== id))
  }
  
  const handleSaveAvailability = () => {
    setTimeout(() => {
      router.push("/doctor/dashboard")
    }, 1500)
  }
  
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  return (
    <div className="min-h-screen bg-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="text-purple-700">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-purple-100 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-700">Manage Availability</CardTitle>
              <CardDescription>Set your working hours and appointment slots</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="weekly">
                <TabsList className="mb-6">
                  <TabsTrigger value="weekly">Weekly Schedule</TabsTrigger>
                  <TabsTrigger value="specific">Specific Dates</TabsTrigger>
                </TabsList>
                
                <TabsContent value="weekly" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1 space-y-2">
                        <Label htmlFor="day">Day</Label>
                        <Select value={newSlot.day} onValueChange={(value) => setNewSlot({ ...newSlot, day: value })}>
                          <SelectTrigger id="day">
                            <SelectValue placeholder="Select day" />
                          </SelectTrigger>
                          <SelectContent>
                            {days.map((day) => (
                              <SelectItem key={day} value={day}>{day}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1 space-y-2">
                        <Label htmlFor="start-time">Start Time</Label>
                        <Select value={newSlot.start} onValueChange={(value) => setNewSlot({ ...newSlot, start: value })}>
                          <SelectTrigger id="start-time">
                            <SelectValue placeholder="Select start time" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 }).map((_, i) => {
                              const hour = i.toString().padStart(2, '0')
                              return (
                                <SelectItem key={`${hour}:00`} value={`${hour}:00`}>{`${hour}:00`}</SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1 space-y-2">
                        <Label htmlFor="end-time">End Time</Label>
                        <Select value={newSlot.end} onValueChange={(value) => setNewSlot({ ...newSlot, end: value })}>
                          <SelectTrigger id="end-time">
                            <SelectValue placeholder="Select end time" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 }).map((_, i) => {
                              const hour = i.toString().padStart(2, '0')
                              return (
                                <SelectItem key={`${hour}:00`} value={`${hour}:00`}>{`${hour}:00`}</SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button onClick={handleAddSlot} className="bg-purple-700 text-white w-full">Add Time Slot</Button>
                  </div>

                  <div className="space-y-4 mt-6">
                    {slots.map(slot => (
                      <div key={slot.id} className="flex justify-between items-center border p-3 rounded-lg shadow-sm">
                        <span>{slot.day}: {slot.start} - {slot.end}</span>
                        <Button onClick={() => handleDeleteSlot(slot.id)} variant="destructive">Remove</Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              <Button onClick={handleSaveAvailability} className="mt-6 bg-purple-700 text-white w-full">
                Save Availability
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
