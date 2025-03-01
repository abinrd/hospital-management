"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"

export default function SignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get("role") || "patient"
  
  const [isLoading, setIsLoading] = useState(false)

  const handleSignup = async (role: string, e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate signup process
    setTimeout(() => {
      setIsLoading(false)
      // Redirect to login
      router.push(`/auth/login?role=${role}`)
    }, 1500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="flex items-center justify-center gap-2">
              <div className="bg-teal-500 text-white p-2 rounded-lg">
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
                  className="h-6 w-6"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-teal-700">YUI Health</span>
            </div>
          </Link>
        </div>

        <Tabs defaultValue={defaultRole} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="patient">Patient</TabsTrigger>
            <TabsTrigger value="doctor">Doctor</TabsTrigger>
          </TabsList>
          
          <TabsContent value="patient">
            <Card className="border-teal-100 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-teal-700">Patient Registration</CardTitle>
                <CardDescription>Create a new patient account to book appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => handleSignup("patient", e)}>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="patient-first-name">First Name</Label>
                        <Input id="patient-first-name" placeholder="John" required />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="patient-last-name">Last Name</Label>
                        <Input id="patient-last-name" placeholder="Doe" required />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="patient-email">Email</Label>
                      <Input id="patient-email" type="email" placeholder="name@example.com" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="patient-password">Password</Label>
                      <Input id="patient-password" type="password" placeholder="••••••••" required />
                    </div>
                    <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-600" disabled={isLoading}>
                      {isLoading ? "Creating account..." : "Create Account"}
                    </Button>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col items-center gap-2">
                <div className="text-sm text-gray-500">
                  Already have an account?{" "}
                  <Link href="/auth/login?role=patient" className="text-teal-600 hover:text-teal-800 font-medium">
                    Sign in
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="doctor">
            <Card className="border-purple-100 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-purple-700">Doctor Registration</CardTitle>
                <CardDescription>Join our network of healthcare professionals</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => handleSignup("doctor", e)}>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="doctor-first-name">First Name</Label>
                        <Input id="doctor-first-name" placeholder="Jane" required />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="doctor-last-name">Last Name</Label>
                        <Input id="doctor-last-name" placeholder="Smith" required />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="doctor-email">Email</Label>
                      <Input id="doctor-email" type="email" placeholder="name@example.com" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="doctor-password">Password</Label>
                      <Input id="doctor-password" type="password" placeholder="••••••••" required />
                    </div>
                    <Button type="submit" className="w-full bg-purple-500 hover:bg-purple-600" disabled={isLoading}>
                      {isLoading ? "Creating account..." : "Create Account"}
                    </Button>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col items-center gap-2">
                <div className="text-sm text-gray-500">
                  Already have an account?{" "}
                  <Link href="/auth/login?role=doctor" className="text-purple-600 hover:text-purple-800 font-medium">
                    Sign in
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
