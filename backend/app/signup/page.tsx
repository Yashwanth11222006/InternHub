"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Signup() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("student")

    const handleSignup = async () => {
        // Input validation
        if (!name.trim() || !email.trim() || !password.trim()) {
            alert("Please fill in all fields.")
            return
        }

        if (password.length < 6) {
            alert("Password must be at least 6 characters.")
            return
        }

        setLoading(true)

        const { data, error } = await supabase.auth.signUp({
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
            alert("Signup succeeded but no user was returned. Please try logging in.")
            setLoading(false)
            return
        }

        const { error: insertError } = await supabase.from("users").insert([
            {
                id: user.id,
                email: email.trim(),
                role,
            },
        ])

        setLoading(false)

        if (insertError) {
            alert(insertError.message)
            return
        }

        router.push("/complete-profile")
    }

    return (
        <div className="flex h-screen flex-col items-center justify-center gap-4">
            <input
                placeholder="Name"
                className="border p-2 w-64"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                placeholder="Email"
                className="border p-2 w-64"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password (min 6 chars)"
                className="border p-2 w-64"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <select
                className="border p-2 w-64"
                value={role}
                onChange={(e) => setRole(e.target.value)}
            >
                <option value="student">Student</option>
                <option value="recruiter">Recruiter</option>
            </select>

            <button
                onClick={handleSignup}
                disabled={loading}
                className="bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
            >
                {loading ? "Signing up..." : "Sign Up"}
            </button>
        </div>
    )
}