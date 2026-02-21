"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../../../lib/supabase"
import { useParams } from "next/navigation"

export default function ApplicantsPage() {
    const { id } = useParams()
    const [applications, setApplications] = useState<any[]>([])

    useEffect(() => {
        const fetchApplicants = async () => {
            const { data } = await supabase
                .from("applications")
                .select("*")
                .eq("internship_id", id)

            if (data) setApplications(data)
        }

        fetchApplicants()
    }, [id])

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-6">Applicants</h1>

            {applications.map((app) => (
                <div key={app.id} className="border p-4 mb-4">
                    <p>Student ID: {app.student_id}</p>

                    <select
                        value={app.status}
                        className="border p-2 mt-2"
                        onChange={async (e) => {
                            const newStatus = e.target.value

                            const { error } = await supabase
                                .from("applications")
                                .update({ status: newStatus })
                                .eq("id", app.id)

                            if (!error) {
                                setApplications((prev) =>
                                    prev.map((item) =>
                                        item.id === app.id ? { ...item, status: newStatus } : item
                                    )
                                )
                            }
                        }}
                    >
                        <option value="applied">Applied</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="interview">Interview</option>
                        <option value="selected">Selected</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            ))}
        </div>
    )
}