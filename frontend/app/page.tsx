"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <header className="container mx-auto py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center gap-2">
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
          <div className="flex items-center gap-4">
            <Link href="/about" className="text-teal-700 hover:text-teal-500 transition-colors">
              About
            </Link>
            <Link href="/services" className="text-teal-700 hover:text-teal-500 transition-colors">
              Services
            </Link>
            <Link href="/contact" className="text-teal-700 hover:text-teal-500 transition-colors">
              Contact
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" className="border-teal-500 text-teal-700 hover:bg-teal-50">
                Login
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-teal-500 hover:bg-teal-600 text-white">Sign Up</Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1 container mx-auto py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h1 className="text-5xl font-bold text-teal-800 leading-tight">
              Modern Healthcare <br />
              <span className="text-purple-600">At Your Fingertips</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-md">
              Book appointments, consult with doctors, and manage your health records all in one place.
            </p>
            <div className="flex gap-4 pt-4">
              <Link href="/auth/signup?role=patient">
                <Button size="lg" className="bg-teal-500 hover:bg-teal-600 text-white">
                  Register as Patient
                </Button>
              </Link>
              <Link href="/auth/signup?role=doctor">
                <Button size="lg" variant="outline" className="border-purple-500 text-purple-700 hover:bg-purple-50">
                  Join as Doctor
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 bg-white p-6 rounded-2xl shadow-xl">
              <img
                src="/placeholder.svg?height=400&width=500"
                alt="Healthcare professionals"
                className="rounded-xl w-full h-auto"
              />
              <div className="absolute -bottom-6 -right-6 bg-purple-100 p-4 rounded-xl shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-500 text-white p-2 rounded-full">
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
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Trusted by</p>
                    <p className="text-lg font-bold text-purple-700">10,000+ Patients</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute top-1/2 -right-12 transform -translate-y-1/2 bg-orange-100 p-4 rounded-xl shadow-lg z-20">
              <div className="flex items-center gap-3">
                <div className="bg-orange-500 text-white p-2 rounded-full">
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
                    <circle cx="12" cy="12" r="10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Verified</p>
                  <p className="text-lg font-bold text-orange-700">500+ Doctors</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-24 text-center"
        >
          <h2 className="text-3xl font-bold text-teal-700 mb-12">Why Choose YUI Health?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-teal-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
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
                  className="h-8 w-8 text-teal-600"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-teal-700 mb-2">Expert Doctors</h3>
              <p className="text-gray-600">Access to a network of verified and experienced healthcare professionals.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-purple-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
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
                  className="h-8 w-8 text-purple-600"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M3 9h18" />
                  <path d="M9 21V9" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-purple-700 mb-2">Easy Scheduling</h3>
              <p className="text-gray-600">
                Book appointments with just a few clicks and manage your schedule effortlessly.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-orange-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
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
                  className="h-8 w-8 text-orange-600"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-orange-700 mb-2">Secure Records</h3>
              <p className="text-gray-600">Your health data is protected with the highest security standards.</p>
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="bg-teal-800 text-white py-12">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">YUI Health</h3>
              <p className="text-teal-200">Modern healthcare solutions for a healthier tomorrow.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-teal-200 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-teal-200 hover:text-white transition-colors">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="/doctors" className="text-teal-200 hover:text-white transition-colors">
                    Find Doctors
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-teal-200 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Patients</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/auth/signup?role=patient" className="text-teal-200 hover:text-white transition-colors">
                    Register
                  </Link>
                </li>
                <li>
                  <Link href="/auth/login" className="text-teal-200 hover:text-white transition-colors">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/appointments" className="text-teal-200 hover:text-white transition-colors">
                    Book Appointment
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-teal-200 hover:text-white transition-colors">
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Doctors</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/auth/signup?role=doctor" className="text-teal-200 hover:text-white transition-colors">
                    Join Network
                  </Link>
                </li>
                <li>
                  <Link href="/auth/login" className="text-teal-200 hover:text-white transition-colors">
                    Doctor Login
                  </Link>
                </li>
                <li>
                  <Link href="/doctor/dashboard" className="text-teal-200 hover:text-white transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="text-teal-200 hover:text-white transition-colors">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-teal-700 mt-8 pt-8 text-center text-teal-300">
            <p>&copy; {new Date().getFullYear()} YUI Health. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

