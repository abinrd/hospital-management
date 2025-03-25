"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function DoctorRegister() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [formData, setFormData] = useState({ name: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return alert("Invalid token!");

    const response = await fetch("http://localhost:5500/api/v1/auth/complete-doctor-registration", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, token }),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Registration Successful!");
    } else {
      alert(data.message || "Registration failed.");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Complete Your Registration</h1>
      <form onSubmit={handleSubmit} className="mt-4 p-6 border rounded-lg shadow-lg">
        <input type="text" name="name" placeholder="Full Name" className="p-2 border rounded w-full" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" className="p-2 border rounded w-full mt-2" onChange={handleChange} required />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 mt-4 rounded">Register</button>
      </form>
    </main>
  );
}
