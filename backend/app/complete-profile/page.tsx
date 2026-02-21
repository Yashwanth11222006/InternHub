"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function CompleteProfile() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [role, setRole] = useState<string | null>(null)
    const [userId, setUserId] = useState<string | null>(null)

    // Shared
    const [bio, setBio] = useState("")

    // Student-specific  → goes into student_profiles table
    const [college, setCollege] = useState("")
    const [degree, setDegree] = useState("")
    const [graduationYear, setGraduationYear] = useState("")
    const [skills, setSkills] = useState("")
    const [resumeUrl, setResumeUrl] = useState("")

    // Recruiter-specific → goes into recruiter_profiles table
    const [companyName, setCompanyName] = useState("")
    const [companyWebsite, setCompanyWebsite] = useState("")
    const [designation, setDesignation] = useState("")
    const [location, setLocation] = useState("")
    const [linkedinUrl, setLinkedinUrl] = useState("")

    useEffect(() => {
        const fetchRole = async () => {
            const { data: authData } = await supabase.auth.getUser()
            if (!authData.user) {
                router.push("/login")
                return
            }

            setUserId(authData.user.id)

            const { data: userData } = await supabase
                .from("users")
                .select("role")
                .eq("id", authData.user.id)
                .single()

            if (userData) setRole(userData.role)
        }

        fetchRole()
    }, [router])

    const handleSubmit = async () => {
        if (!userId) return

        // Validation
        if (!bio.trim()) {
            alert("Please enter a short bio.")
            return
        }

        if (role === "student") {
            if (!college.trim() || !degree.trim()) {
                alert("Please fill in your college and degree.")
                return
            }
        }

        if (role === "recruiter") {
            if (!companyName.trim() || !designation.trim()) {
                alert("Please fill in your company name and designation.")
                return
            }
        }

        setLoading(true)

        try {
            if (role === "student") {
                // Insert into student_profiles table (bio and profile_completed are here now)
                const { error: profileError } = await supabase
                    .from("student_profiles")
                    .insert([
                        {
                            id: userId,
                            full_name: "Student", // Default or fetch
                            university: college.trim(),
                            degree: degree.trim(),
                            graduation_year: parseInt(graduationYear) || null,
                            skills: skills ? skills.split(",").map(s => s.trim()) : [],
                            resume_url: resumeUrl.trim() || null,
                            bio: bio.trim(),
                            profile_completed: true
                        },
                    ])

                if (profileError) throw profileError

            } else if (role === "recruiter") {
                // Insert into recruiter_profiles table
                const { error: profileError } = await supabase
                    .from("recruiter_profiles")
                    .insert([
                        {
                            id: userId,
                            company_name: companyName.trim(),
                            recruiter_name: designation.trim(), // Placeholder
                            company_website: companyWebsite.trim() || null,
                            company_description: bio.trim(),
                            location: location.trim() || null,
                            linkedin_url: linkedinUrl.trim() || null,
                        },
                    ])

                if (profileError) throw profileError
            }

            // Redirect based on role
            if (role === "student") {
                router.push("/student/dashboard")
            } else if (role === "recruiter") {
                router.push("/recruiter/dashboard")
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "An error occurred"
            alert(message)
        } finally {
            setLoading(false)
        }
    }

    if (!role) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 py-10">
            <h1 className="text-2xl font-bold">Complete Your Profile</h1>

            {/* Bio — stored in users.bio (students) or recruiter_profiles.bio (recruiters) */}
            <textarea
                placeholder="Short bio about yourself"
                className="border p-2 w-72 h-24"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
            />

            {/* Student fields → student_profiles table */}
            {role === "student" && (
                <>
                    <input
                        placeholder="College / University *"
                        className="border p-2 w-72"
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                    />
                    <input
                        placeholder="Degree (e.g. B.Tech CS) *"
                        className="border p-2 w-72"
                        value={degree}
                        onChange={(e) => setDegree(e.target.value)}
                    />
                    <input
                        placeholder="Graduation Year (e.g. 2026)"
                        className="border p-2 w-72"
                        value={graduationYear}
                        onChange={(e) => setGraduationYear(e.target.value)}
                    />
                    <input
                        placeholder="Skills (e.g. React, Python)"
                        className="border p-2 w-72"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                    />
                    <input
                        placeholder="Resume URL (optional)"
                        className="border p-2 w-72"
                        value={resumeUrl}
                        onChange={(e) => setResumeUrl(e.target.value)}
                    />
                </>
            )}

            {/* Recruiter fields → recruiter_profiles table */}
            {role === "recruiter" && (
                <>
                    <input
                        placeholder="Company Name *"
                        className="border p-2 w-72"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                    />
                    <input
                        placeholder="Your Designation *"
                        className="border p-2 w-72"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                    />
                    <input
                        placeholder="Company Website (optional)"
                        className="border p-2 w-72"
                        value={companyWebsite}
                        onChange={(e) => setCompanyWebsite(e.target.value)}
                    />
                    <input
                        placeholder="Location (optional)"
                        className="border p-2 w-72"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                    <input
                        placeholder="LinkedIn URL (optional)"
                        className="border p-2 w-72"
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                    />
                </>
            )}

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 disabled:opacity-50"
            >
                {loading ? "Saving..." : "Save & Continue"}
            </button>
        </div>
    )
}