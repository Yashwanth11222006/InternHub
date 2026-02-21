"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../../lib/supabase"
import { useRouter } from "next/navigation"


export default function StudentDashboard() {
    const router = useRouter()
    const [internships, setInternships] = useState<any[]>([])

    useEffect(() => {
        const checkAccess = async () => {
            const { data } = await supabase.auth.getUser()
            if (!data.user) return

            const { data: userData } = await supabase
                .from("users")
                .select("role")
                .eq("id", data.user.id)
                .single()

            if (userData?.role !== "student") {
                window.location.href = "/login"
                return
            }

            const { data: internshipsData } = await supabase
                .from("internships")
                .select("*")
                .eq("status", "active")

            if (internshipsData) setInternships(internshipsData)
        }

        checkAccess()
    }, [])

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-6">Available Internships</h1>
            <button
                onClick={() => router.push("/student/applications")}
                className="bg-green-500 text-white px-4 py-2 mb-6"
            >
                My Applications
            </button>

            {internships.length === 0 && <p>No internships available</p>}

            {internships.map((internship) => (
                <div
                    key={internship.id}
                    className="border p-4 mb-4 rounded"
                >
                    <h2 className="text-lg font-semibold">{internship.title}</h2>
                    <p>{internship.description}</p>
                    <p>Status: {internship.status}</p>

                    <button
                        className="bg-blue-500 text-white px-3 py-1 mt-3"
                        onClick={async () => {
                            const { data } = await supabase.auth.getUser()
                            if (!data.user) return

                            const { error } = await supabase
                                .from("applications")
                                .insert([
                                    {
                                        internship_id: internship.id,
                                        student_id: data.user.id,
                                    },
                                ])

                            if (error) {
                                if (error.code === "23505") {
                                    alert("You have already applied to this internship.")
                                } else {
                                    alert(error.message)
                                }
                            } else {
                                alert("Application submitted successfully.")
                            }
                        }}
                    >
                        Apply
                    </button>
                </div>
            ))}
        </div>
    )
}