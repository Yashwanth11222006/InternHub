"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Login() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            alert("Please enter your email and password.")
            return
        }

        setLoading(true)

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
        })

        if (error) {
            alert(error.message)
            setLoading(false)
            return
        }

        const user = data.user

        if (!user) {
            setLoading(false)
            return
        }

        const { data: userData, error: fetchError } = await supabase
            .from("users")
            .select("role, profile_completed")
            .eq("id", user.id)
            .single()

        setLoading(false)

        if (fetchError) {
            alert(fetchError.message)
            return
        }

        if (!userData) {
            alert("User profile not found.")
            return
        }

        if (!userData.profile_completed) {
            router.push("/complete-profile")
            return
        }

        if (userData.role === "student") {
            router.push("/student/dashboard")
        } else if (userData.role === "recruiter") {
            router.push("/recruiter/dashboard")
        } else {
            alert("Unknown role. Please contact support.")
        }
    }

    return (
        <div className="flex h-screen flex-col items-center justify-center gap-4">
            <input
                placeholder="Email"
                type="email"
                className="border p-2 w-64"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                className="border p-2 w-64"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button
                onClick={handleLogin}
                disabled={loading}
                className="bg-green-500 px-4 py-2 text-white disabled:opacity-50"
            >
                {loading ? "Logging in..." : "Login"}
            </button>
        </div>
    )
}