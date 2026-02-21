"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../../lib/supabase"
import { useRouter } from "next/navigation"

export default function RecruiterDashboard() {
    const [internships, setInternships] = useState<any[]>([])
    const router = useRouter()

    useEffect(() => {
        const fetchInternships = async () => {
            const { data: userData } = await supabase.auth.getUser()
            if (!userData.user) return

            const { data } = await supabase
                .from("internships")
                .select("*")
                .eq("recruiter_id", userData.user.id)

            if (data) setInternships(data)
        }

        fetchInternships()
    }, [])

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-6">Your Internships</h1>

            {internships.map((internship) => (
                <div key={internship.id} className="border p-4 mb-4">
                    <h2 className="text-lg font-semibold">{internship.title}</h2>

                    <button
                        className="bg-blue-500 text-white px-3 py-1 mt-3"
                        onClick={() =>
                            router.push(`/recruiter/applicants/${internship.id}`)
                        }
                    >
                        View Applicants
                    </button>
                </div>
            ))}

            <button
                onClick={() => router.push("/recruiter/create")}
                className="bg-green-500 text-white px-4 py-2 mt-6"
            >
                Create Internship
            </button>
        </div>
    )
}