"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function CreateInternship() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [duration, setDuration] = useState("")
    const [eligibility, setEligibility] = useState("")

    const handleCreate = async () => {
        // Input validation
        if (!title.trim() || !description.trim() || !duration.trim() || !eligibility.trim()) {
            alert("Please fill in all fields before posting.")
            return
        }

        setLoading(true)

        const { data } = await supabase.auth.getUser()

        if (!data.user) {
            alert("Not authenticated. Please log in again.")
            setLoading(false)
            router.push("/login")
            return
        }

        const { error } = await supabase.from("internships").insert([
            {
                title: title.trim(),
                description: description.trim(),
                duration: duration.trim(),
                eligibility: eligibility.trim(),
                recruiter_id: data.user.id,
            },
        ])

        setLoading(false)

        if (error) {
            alert(error.message)
            return
        }

        alert("Internship created successfully!")
        router.push("/recruiter/dashboard")
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            <h1 className="text-xl font-bold">Create Internship</h1>

            <input
                placeholder="Title"
                className="border p-2 w-72"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
                placeholder="Description"
                className="border p-2 w-72 h-28"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            <input
                placeholder="Duration (e.g. 3 months)"
                className="border p-2 w-72"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
            />

            <input
                placeholder="Eligibility"
                className="border p-2 w-72"
                value={eligibility}
                onChange={(e) => setEligibility(e.target.value)}
            />

            <button
                onClick={handleCreate}
                disabled={loading}
                className="bg-green-500 text-white px-4 py-2 disabled:opacity-50"
            >
                {loading ? "Posting..." : "Post Internship"}
            </button>
        </div>
    )
}