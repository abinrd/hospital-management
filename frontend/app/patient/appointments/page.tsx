"use client"

import type React from "react"

import { useState,useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import { ChevronLeft, Clock, Search } from "lucide-react"
import { cn,fetchData } from "@/lib/utils"
import { AnyARecord } from "node:dns"

export default function BookAppointment() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [date, setDate] = useState<Date>()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null)
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [reason, setReason] = useState("")
  const [doctors, setDoctors] = useState<any[]>(() => []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetchData("/api/v1/users/approved-doctors");
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const text = await response.text();
        console.log("📥 Raw API Response (Text):", text);
  
        const data = JSON.parse(text);
        console.log("📥 Parsed API Response:", data);
  
        if (!data || typeof data !== "object") {
          throw new Error("Invalid API response: Expected an object");
        }
  
        if (!("data" in data) || !("doctors" in data.data)) {
          throw new Error("Invalid API response: 'doctors' field missing");
        }
  
        if (!Array.isArray(data.data.doctors)) {
          throw new Error("Invalid API response: 'doctors' is not an array");
        }
  
        setDoctors(data.data.doctors);
        console.log("✅ Doctors Updated in State:", data.data.doctors);
      } catch (error) {
        console.error("❌ Fetch Error:", error);
      }
    };
  
    fetchDoctors();
  }, []);
  
  

  console.log("Doctors in State:", doctors);

  const filteredDoctors = (doctors || []).filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSelectDoctor = (doctor: any) => {
    setSelectedDoctor(doctor)
    setSelectedTime(""); // Reset selected time when choosing a new doctor
    setDate(undefined); // Reset date
    setStep(2);
  };
  

  const handleSelectTime = (time: string) => {
    setSelectedTime(time)
  }

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || !selectedTime || !selectedDoctor || !reason) {
      setError("All fields are required")
      return
    }

    try {
      setLoading(true)
      setError("")

      const response = await fetchData("/api/v1/book/", {
        method: "POST",
        headers: { "Content-Type": "application/json" ,"Authorization": `Bearer ${localStorage.getItem("token")}`},
        body: JSON.stringify({
          doctor: selectedDoctor._id,
          date: format(date, "yyyy-MM-dd"),
          timeSlot: selectedTime,
          reason
        }),
      })

      if (!response.ok) throw new Error("Failed to book appointment")

      router.push("/patient/dashboard")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="text-teal-700">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="border-teal-100 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-teal-700">Book an Appointment</CardTitle>
              <CardDescription>
                {step === 1
                  ? "Select a doctor for your appointment"
                  : step === 2
                    ? "Choose a date and time"
                    : "Confirm your appointment details"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {step === 1 && (
                <div className="space-y-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by doctor name or specialty"
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredDoctors.map((doctor) => (
                        <div
                          key={doctor._id}
                          className="border rounded-lg p-4 hover:border-teal-200 hover:bg-teal-50 cursor-pointer transition-colors"
                          onClick={() => handleSelectDoctor(doctor)}
                        >
                          <div className="flex items-start gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={`/placeholder.svg?height=48&width=48`} alt={doctor.name} />
                              <AvatarFallback className="bg-teal-100 text-teal-700">
                                {doctor.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{doctor.name}</p>
                              <p className="text-sm text-gray-500">{doctor.specialty}</p>
                              <div className="flex items-center gap-1 mt-1">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="h-4 w-4 text-yellow-400 fill-yellow-400"
                                >
                                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                </svg>
                                <span className="text-sm font-medium">{doctor.rating}</span>
                                <span className="text-xs text-gray-500">({doctor.reviews} reviews)</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {filteredDoctors.length === 0 && (
                      <p className="text-center text-gray-500 py-8">No doctors found matching your search</p>
                    )}
                  </div>
                </div>
              )}

              {step === 2 && selectedDoctor && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-teal-50 rounded-lg">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`/placeholder.svg?height=48&width=48`} alt={selectedDoctor.name} />
                      <AvatarFallback className="bg-teal-100 text-teal-700">
                        {selectedDoctor.name
                          .split(" ")
                          .map((n:any) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedDoctor.name}</p>
                      <p className="text-sm text-gray-500">{selectedDoctor.specialty}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="mb-2 block">Select Date</Label>
                      <div className="border rounded-md p-1">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={(date) => {
                            // Disable past dates and weekends
                            const today = new Date()
                            today.setHours(0, 0, 0, 0)
                            const day = date.getDay()
                            return date < today || day === 0 || day === 6
                          }}
                          className="rounded-md"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="mb-2 block">Select Time</Label>

                   

                      {date && selectedDoctor?.availableTimeSlots?.length ? (
                        <div className="grid grid-cols-2 gap-2">
                          {selectedDoctor.availableTimeSlots
                            .filter(slot => slot.day === format(date, "EEEE")) // Match day
                            .flatMap(slot => slot.slots) // Extract slot array
                            .map((time: string) => (
                              <Button
                                key={time}
                                type="button"
                                variant={selectedTime === time ? "default" : "outline"}
                                className={cn(
                                  "justify-start text-left font-normal",
                                  selectedTime === time && "bg-teal-500 text-white hover:bg-teal-600",
                                )}
                                onClick={() => handleSelectTime(time)}
                              >
                                <Clock className="mr-2 h-4 w-4" />
                                {time}
                              </Button>
                            ))}
                        </div>
                      ) : (
                      <p className="text-gray-500">Select a doctor to see available time slots.</p>
                    )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="reason">Reason for Visit</Label>
                    <Textarea
                      id="reason"
                      placeholder="Please describe your symptoms or reason for the appointment"
                      className="mt-1"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button
                      onClick={() => setStep(3)}
                      disabled={!date || !selectedTime || !reason}
                      className="bg-teal-500 hover:bg-teal-600"
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && selectedDoctor && date && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="bg-teal-50 p-4 rounded-lg space-y-4">
                    <h3 className="font-semibold text-teal-700">Appointment Summary</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Doctor</p>
                        <p className="font-medium">{selectedDoctor.name}</p>
                        <p className="text-sm text-gray-500">{selectedDoctor.specialty}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Date & Time</p>
                        <p className="font-medium">{format(date, "PPP")}</p>
                        <p className="text-sm">{selectedTime}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Reason for Visit</p>
                      <p>{reason}</p>
                    </div>

                    <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
                      <p className="text-sm text-yellow-700">
                        <strong>Note:</strong> Your appointment will be pending until approved by the doctor.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep(2)}>
                      Back
                    </Button>
                    <Button type="submit" className="bg-teal-500 hover:bg-teal-600">
                      Confirm Appointment
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

