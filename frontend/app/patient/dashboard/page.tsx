"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Bell, CalendarIcon, Clock, FileText, Home, LogOut, MessageSquare, Settings, User, Users } from "lucide-react"

export default function PatientDashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  // Mock data for appointments
  const upcomingAppointments = [
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      date: "2023-06-15",
      time: "10:00 AM",
      status: "confirmed",
    },
    {
      id: 2,
      doctor: "Dr. Michael Chen",
      specialty: "Dermatology",
      date: "2023-06-20",
      time: "2:30 PM",
      status: "pending",
    },
  ]

  const pastAppointments = [
    {
      id: 3,
      doctor: "Dr. Emily Wilson",
      specialty: "General Medicine",
      date: "2023-05-28",
      time: "9:15 AM",
      status: "completed",
    },
    {
      id: 4,
      doctor: "Dr. Robert Davis",
      specialty: "Orthopedics",
      date: "2023-05-10",
      time: "11:45 AM",
      status: "completed",
    },
  ]

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:flex w-64 flex-col bg-white h-screen fixed border-r">
          <div className="p-4 border-b">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-teal-500 text-white p-1.5 rounded-lg">
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
                  className="h-5 w-5"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <span className="text-xl font-bold text-teal-700">YUI Health</span>
            </Link>
          </div>

          <div className="flex flex-col justify-between flex-1 p-4">
            <nav className="space-y-1">
              <Link
                href="/patient/dashboard"
                className="flex items-center gap-3 px-3 py-2 text-teal-700 bg-teal-50 rounded-md"
              >
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/patient/appointments"
                className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-teal-700 hover:bg-teal-50 rounded-md transition-colors"
              >
                <CalendarIcon className="h-5 w-5" />
                <span>Appointments</span>
              </Link>
              <Link
                href="/patient/doctors"
                className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-teal-700 hover:bg-teal-50 rounded-md transition-colors"
              >
                <Users className="h-5 w-5" />
                <span>Find Doctors</span>
              </Link>
              <Link
                href="/patient/messages"
                className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-teal-700 hover:bg-teal-50 rounded-md transition-colors"
              >
                <MessageSquare className="h-5 w-5" />
                <span>Messages</span>
              </Link>
              <Link
                href="/patient/records"
                className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-teal-700 hover:bg-teal-50 rounded-md transition-colors"
              >
                <FileText className="h-5 w-5" />
                <span>Medical Records</span>
              </Link>
              <Link
                href="/patient/profile"
                className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-teal-700 hover:bg-teal-50 rounded-md transition-colors"
              >
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Link>
              <Link
                href="/patient/settings"
                className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-teal-700 hover:bg-teal-50 rounded-md transition-colors"
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </nav>

            <div>
              <Link
                href="/auth/login"
                className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 md:ml-64">
          {/* Header */}
          <header className="bg-white border-b sticky top-0 z-10">
            <div className="flex items-center justify-between p-4">
              <h1 className="text-2xl font-bold text-teal-700">Patient Dashboard</h1>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                </Button>
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Patient" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium">John Doe</p>
                    <p className="text-xs text-gray-500">Patient</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Dashboard content */}
          <main className="p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Welcome card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="md:col-span-2"
              >
                <Card className="border-teal-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-2xl text-teal-700">Welcome back, John!</CardTitle>
                    <CardDescription>Here's a summary of your health activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-5 w-5 text-blue-500" />
                          <span className="text-sm font-medium text-blue-700">Upcoming</span>
                        </div>
                        <p className="text-2xl font-bold mt-2">{upcomingAppointments.length}</p>
                        <p className="text-sm text-gray-500">Appointments</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-green-500" />
                          <span className="text-sm font-medium text-green-700">Recent</span>
                        </div>
                        <p className="text-2xl font-bold mt-2">3</p>
                        <p className="text-sm text-gray-500">Prescriptions</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-5 w-5 text-purple-500" />
                          <span className="text-sm font-medium text-purple-700">Unread</span>
                        </div>
                        <p className="text-2xl font-bold mt-2">2</p>
                        <p className="text-sm text-gray-500">Messages</p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-700">Next Appointment</h3>
                        <Link href="/patient/appointments">
                          <Button variant="ghost" className="text-teal-600 hover:text-teal-700 p-0 h-auto">
                            View all
                          </Button>
                        </Link>
                      </div>

                      {upcomingAppointments.length > 0 ? (
                        <div className="bg-white border rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-teal-100 text-teal-700">
                                  {upcomingAppointments[0].doctor
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{upcomingAppointments[0].doctor}</p>
                                <p className="text-sm text-gray-500">{upcomingAppointments[0].specialty}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <CalendarIcon className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm">{upcomingAppointments[0].date}</span>
                                  <Clock className="h-4 w-4 text-gray-400 ml-2" />
                                  <span className="text-sm">{upcomingAppointments[0].time}</span>
                                </div>
                              </div>
                            </div>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                              {upcomingAppointments[0].status}
                            </Badge>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Button size="sm" variant="outline" className="text-sm">
                              Reschedule
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-sm text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500">No upcoming appointments</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Calendar card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="border-teal-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-teal-700">Calendar</CardTitle>
                    <CardDescription>Schedule and manage your appointments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
                    <div className="mt-4">
                      <Link href="/patient/appointments/book">
                        <Button className="w-full bg-teal-500 hover:bg-teal-600">Book Appointment</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Appointments tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6"
            >
              <Card className="border-teal-100">
                <CardHeader>
                  <CardTitle className="text-xl text-teal-700">My Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="upcoming">
                    <TabsList className="mb-4">
                      <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                      <TabsTrigger value="past">Past</TabsTrigger>
                    </TabsList>

                    <TabsContent value="upcoming">
                      {upcomingAppointments.length > 0 ? (
                        <div className="space-y-4">
                          {upcomingAppointments.map((appointment) => (
                            <div
                              key={appointment.id}
                              className="flex items-center justify-between p-4 border rounded-lg"
                            >
                              <div className="flex items-center gap-4">
                                <Avatar>
                                  <AvatarFallback className="bg-teal-100 text-teal-700">
                                    {appointment.doctor
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{appointment.doctor}</p>
                                  <p className="text-sm text-gray-500">{appointment.specialty}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm">{appointment.date}</span>
                                    <Clock className="h-4 w-4 text-gray-400 ml-2" />
                                    <span className="text-sm">{appointment.time}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge
                                  className={
                                    appointment.status === "confirmed"
                                      ? "bg-green-100 text-green-700 hover:bg-green-100"
                                      : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                                  }
                                >
                                  {appointment.status}
                                </Badge>
                                <Button size="sm" variant="ghost" className="text-gray-500">
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
                                    className="h-4 w-4"
                                  >
                                    <circle cx="12" cy="12" r="1" />
                                    <circle cx="19" cy="12" r="1" />
                                    <circle cx="5" cy="12" r="1" />
                                  </svg>
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-8">No upcoming appointments</p>
                      )}
                    </TabsContent>

                    <TabsContent value="past">
                      {pastAppointments.length > 0 ? (
                        <div className="space-y-4">
                          {pastAppointments.map((appointment) => (
                            <div
                              key={appointment.id}
                              className="flex items-center justify-between p-4 border rounded-lg"
                            >
                              <div className="flex items-center gap-4">
                                <Avatar>
                                  <AvatarFallback className="bg-gray-100 text-gray-700">
                                    {appointment.doctor
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{appointment.doctor}</p>
                                  <p className="text-sm text-gray-500">{appointment.specialty}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm">{appointment.date}</span>
                                    <Clock className="h-4 w-4 text-gray-400 ml-2" />
                                    <span className="text-sm">{appointment.time}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
                                  {appointment.status}
                                </Badge>
                                <Button size="sm" variant="outline" className="text-sm">
                                  View Details
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-8">No past appointments</p>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
}

