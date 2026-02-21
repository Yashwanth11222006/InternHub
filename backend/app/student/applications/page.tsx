"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../../lib/supabase"

export default function StudentApplications() {
    const [applications, setApplications] = useState<any[]>([])

    useEffect(() => {
        const fetchApplications = async () => {
            const { data: userData } = await supabase.auth.getUser()
            if (!userData.user) return

            const { data } = await supabase
                .from("applications")
                .select("*, internships(title)")
                .eq("student_id", userData.user.id)

            if (data) setApplications(data)
        }

        fetchApplications()
    }, [])

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-6">My Applications</h1>

            {applications.length === 0 && <p>No applications yet</p>}

            {applications.map((app) => (
                <div key={app.id} className="border p-4 mb-4">
                    <h2 className="font-semibold">
                        {app.internships?.title}
                    </h2>
                    <p>Status: {app.status}</p>
                </div>
            ))}
        </div>
    )
}