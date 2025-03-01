"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import {
  Bell,
  CalendarIcon,
  CheckCircle,
  Clock,
  FileText,
  Home,
  LogOut,
  MessageSquare,
  Settings,
  User,
  Users,
  XCircle,
} from "lucide-react"

export default function DoctorDashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  // Mock data for appointments
  const pendingAppointments = [
    {
      id: 1,
      patient: "Emily Johnson",
      age: 34,
      reason: "Chest pain and shortness of breath",
      date: "2023-06-15",
      time: "10:00 AM",
      status: "pending",
    },
    {
      id: 2,
      patient: "Michael Brown",
      age: 45,
      reason: "Follow-up on medication",
      date: "2023-06-15",
      time: "11:30 AM",
      status: "pending",
    },
  ]

  const upcomingAppointments = [
    {
      id: 3,
      patient: "Sarah Wilson",
      age: 28,
      reason: "Annual checkup",
      date: "2023-06-16",
      time: "9:15 AM",
      status: "confirmed",
    },
    {
      id: 4,
      patient: "Robert Davis",
      age: 52,
      reason: "Blood pressure monitoring",
      date: "2023-06-16",
      time: "2:45 PM",
      status: "confirmed",
    },
    {
      id: 5,
      patient: "Jennifer Lee",
      age: 41,
      reason: "Migraine consultation",
      date: "2023-06-17",
      time: "11:00 AM",
      status: "confirmed",
    },
  ]

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:flex w-64 flex-col bg-white h-screen fixed border-r">
          <div className="p-4 border-b">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-purple-500 text-white p-1.5 rounded-lg">
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
              <span className="text-xl font-bold text-purple-700">YUI Health</span>
            </Link>
          </div>

          <div className="flex flex-col justify-between flex-1 p-4">
            <nav className="space-y-1">
              <Link
                href="/doctor/dashboard"
                className="flex items-center gap-3 px-3 py-2 text-purple-700 bg-purple-50 rounded-md"
              >
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/doctor/appointments"
                className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-md transition-colors"
              >
                <CalendarIcon className="h-5 w-5" />
                <span>Appointments</span>
              </Link>
              <Link
                href="/doctor/patients"
                className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-md transition-colors"
              >
                <Users className="h-5 w-5" />
                <span>My Patients</span>
              </Link>
              <Link
                href="/doctor/messages"
                className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-md transition-colors"
              >
                <MessageSquare className="h-5 w-5" />
                <span>Messages</span>
              </Link>
              <Link
                href="/doctor/records"
                className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-md transition-colors"
              >
                <FileText className="h-5 w-5" />
                <span>Medical Records</span>
              </Link>
              <Link
                href="/doctor/profile"
                className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-md transition-colors"
              >
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Link>
              <Link
                href="/doctor/settings"
                className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-md transition-colors"
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
              <h1 className="text-2xl font-bold text-purple-700">Doctor Dashboard</h1>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                </Button>
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Doctor" />
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium">Dr. Sarah Johnson</p>
                    <p className="text-xs text-gray-500">Cardiologist</p>
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
                <Card className="border-purple-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-2xl text-purple-700">Welcome back, Dr. Johnson!</CardTitle>
                    <CardDescription>Here's your schedule for today</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-5 w-5 text-purple-500" />
                          <span className="text-sm font-medium text-purple-700">Today's</span>
                        </div>
                        <p className="text-2xl font-bold mt-2">5</p>
                        <p className="text-sm text-gray-500">Appointments</p>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-orange-500" />
                          <span className="text-sm font-medium text-orange-700">Pending</span>
                        </div>
                        <p className="text-2xl font-bold mt-2">{pendingAppointments.length}</p>
                        <p className="text-sm text-gray-500">Approvals</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-5 w-5 text-blue-500" />
                          <span className="text-sm font-medium text-blue-700">Unread</span>
                        </div>
                        <p className="text-2xl font-bold mt-2">3</p>
                        <p className="text-sm text-gray-500">Messages</p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-700">Pending Approvals</h3>
                        <Link href="/doctor/appointments/pending">
                          <Button variant="ghost" className="text-purple-600 hover:text-purple-700 p-0 h-auto">
                            View all
                          </Button>
                        </Link>
                      </div>

                      {pendingAppointments.length > 0 ? (
                        <div className="space-y-4">
                          {pendingAppointments.map((appointment) => (
                            <div key={appointment.id} className="bg-white border rounded-lg p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                  <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-orange-100 text-orange-700">
                                      {appointment.patient
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{appointment.patient}</p>
                                    <p className="text-sm text-gray-500">Age: {appointment.age}</p>
                                    <p className="text-sm text-gray-600 mt-1">{appointment.reason}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                      <CalendarIcon className="h-4 w-4 text-gray-400" />
                                      <span className="text-sm">{appointment.date}</span>
                                      <Clock className="h-4 w-4 text-gray-400 ml-2" />
                                      <span className="text-sm">{appointment.time}</span>
                                    </div>
                                  </div>
                                </div>
                                <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                                  {appointment.status}
                                </Badge>
                              </div>
                              <div className="flex gap-2 mt-4">
                                <Button size="sm" className="text-sm bg-green-500 hover:bg-green-600">
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-sm text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Decline
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No pending appointments</p>
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
                <Card className="border-purple-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-purple-700">Calendar</CardTitle>
                    <CardDescription>Manage your availability</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
                    <div className="mt-4">
                      <Link href="/doctor/availability">
                        <Button className="w-full bg-purple-500 hover:bg-purple-600">Set Availability</Button>
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
              <Card className="border-purple-100">
                <CardHeader>
                  <CardTitle className="text-xl text-purple-700">Upcoming Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="today">
                    <TabsList className="mb-4">
                      <TabsTrigger value="today">Today</TabsTrigger>
                      <TabsTrigger value="tomorrow">Tomorrow</TabsTrigger>
                      <TabsTrigger value="week">This Week</TabsTrigger>
                    </TabsList>

                    <TabsContent value="today">
                      {upcomingAppointments.length > 0 ? (
                        <div className="space-y-4">
                          {upcomingAppointments.map((appointment) => (
                            <div
                              key={appointment.id}
                              className="flex items-center justify-between p-4 border rounded-lg"
                            >
                              <div className="flex items-center gap-4">
                                <Avatar>
                                  <AvatarFallback className="bg-purple-100 text-purple-700">
                                    {appointment.patient
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{appointment.patient}</p>
                                  <p className="text-sm text-gray-500">Age: {appointment.age}</p>
                                  <p className="text-sm text-gray-600">{appointment.reason}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Clock className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm">{appointment.time}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
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
                        <p className="text-gray-500 text-center py-8">No appointments for today</p>
                      )}
                    </TabsContent>

                    <TabsContent value="tomorrow">
                      <p className="text-gray-500 text-center py-8">No appointments scheduled for tomorrow</p>
                    </TabsContent>

                    <TabsContent value="week">
                      <p className="text-gray-500 text-center py-8">Loading this week's schedule...</p>
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

