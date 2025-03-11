"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
function Admin() {
    const [name,setName]=React.useState("");
    const [email,setEmail]=React.useState("");
    const [error,setError]=React.useState("");
    const [success,setSuccess]=React.useState("");
    const router = useRouter();
    const handleSubmit = async (e: React.FormEvent)=> {
        e.preventDefault();
        setError("");
        setSuccess("");
        try{
            if(!name){
                setError("Please fill name");
                return;
            }
            if(!email){
                setError("Please enter email");
                return;
            }
       const res = await fetch("/api/v1/auth/invite-doctor",{
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({name,email})
       })
       if(!res.ok){
        setError("Failed to invite doctor");
        return;
       }
       setSuccess("Invitation send sucessfully");
    }catch(e){
        console.log(e);
        setError("Error sending invite")
    }
    }
    
  return (
    <>
    <main className="bg-gray-900 h-screen flex flex-col justify-center items-center">
    <div className="flex items-center gap-2 p-5">
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
        <div className="flex flex-col justify-center items-center">
        <Card className="w-[350px] md:w-[30vw]">
        {error && (
            <div className="p-5 text-center text-red-900 w-full bg-red-700/30">
                <p>{error}</p>
            </div>
        )}
        { success && (
            <div className="p-5 text-center text-green-600 bg-green-600/30">
                <p>{success}</p>
            </div>
        )}
      <CardHeader>
     
        <CardTitle>Invite Doctor</CardTitle>
        <CardDescription>Send invitation to doctors to join this reputed hosptial.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" onChange={(e)=>setName(e.target.value)} placeholder="Name of your doctor" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" onChange={(e)=>setEmail(e.target.value)} placeholder="Email of your doctor" />
            </div>
          </div>
          <div className="flex mt-3 justify-between">
          <Button onClick={()=>router.push("/")} variant="outline">Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>Send</Button>
          </div>
        </form>
      </CardContent>
    </Card>
        </div>
    </main>
    </>
  )
}

export default Admin