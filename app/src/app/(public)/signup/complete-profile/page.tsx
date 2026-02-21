'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
    User,
    Briefcase,
    GraduationCap,
    Building2,
    Globe,
    Linkedin,
    Github,
    FileText,
    Save,
    MapPin,
    Calendar,
    Target
} from 'lucide-react';
import { PremiumButton } from '@/components/ui/PremiumButton';
import InputField from '@/components/ui/InputField';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

export default function CompleteProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetchingRole, setFetchingRole] = useState(true);
    const [role, setRole] = useState<'student' | 'recruiter' | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    // Shared Form States
    const [bio, setBio] = useState('');
    const [fullName, setFullName] = useState('');
    const [linkedin, setLinkedin] = useState('');

    // Student specific
    const [university, setUniversity] = useState('');
    const [degree, setDegree] = useState('');
    const [branch, setBranch] = useState('');
    const [gradYear, setGradYear] = useState('');
    const [skills, setSkills] = useState('');
    const [github, setGithub] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');

    // Recruiter specific
    const [companyName, setCompanyName] = useState('');
    const [companyWebsite, setCompanyWebsite] = useState('');
    const [designation, setDesignation] = useState(''); // This will map to recruiter_name

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }
            setUserId(user.id);

            const { data: userData, error } = await supabase
                .from('users')
                .select('role')
                .eq('id', user.id)
                .single();

            if (error || !userData) {
                router.push('/login');
                return;
            }

            setRole(userData.role as 'student' | 'recruiter');
            setFetchingRole(false);
        };

        checkUser();
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId || !role) return;

        setLoading(true);
        try {
            if (role === 'student') {
                const { error: profileError } = await supabase
                    .from('student_profiles')
                    .insert([{
                        id: userId,
                        full_name: fullName,
                        university,
                        degree,
                        branch,
                        graduation_year: parseInt(gradYear),
                        skills: skills.split(',').map(s => s.trim()).filter(s => s),
                        github_url: github,
                        linkedin_url: linkedin,
                        resume_url: resumeUrl,
                        bio: bio,
                        profile_completed: true
                    }]);

                if (profileError) throw profileError;

                router.push('/home');
            } else {
                const { error: profileError } = await supabase
                    .from('recruiter_profiles')
                    .insert([{
                        id: userId,
                        company_name: companyName,
                        recruiter_name: designation,
                        company_website: companyWebsite,
                        company_description: bio,
                        linkedin_url: linkedin,
                        is_verified: false
                    }]);

                if (profileError) throw profileError;

                router.push('/recruiter/dashboard');
            }
        } catch (error: any) {
            alert(error.message || 'Error saving profile');
        } finally {
            setLoading(false);
        }
    };

    if (fetchingRole) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-20 px-6 lg:px-24">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[40px] shadow-2xl border border-border/50 overflow-hidden shadow-primary/5"
                >
                    <div className="flex flex-col lg:flex-row h-full">
                        {/* Summary Side */}
                        <div className={cn(
                            "lg:w-1/3 p-12 text-white flex flex-col justify-between",
                            role === 'student' ? "bg-primary" : "bg-slate-900"
                        )}>
                            <div>
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8">
                                    {role === 'student' ? <User className="w-8 h-8" /> : <Briefcase className="w-8 h-8" />}
                                </div>
                                <h1 className="text-3xl font-black tracking-tight mb-4">Complete Your Profile</h1>
                                <p className="text-white/80 font-medium italic">
                                    Almost there! Tell us more about yourself to get the best out of InternHub.
                                </p>
                            </div>

                            <div className="space-y-4 hidden lg:block">
                                <div className="flex items-center gap-3 text-sm font-bold bg-white/10 p-4 rounded-2xl border border-white/10">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    Account Verified
                                </div>
                                <div className="flex items-center gap-3 text-sm font-bold bg-white/10 p-4 rounded-2xl border border-white/10">
                                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                                    Profile 50% Complete
                                </div>
                            </div>
                        </div>

                        {/* Form Side */}
                        <div className="flex-1 p-12 lg:p-16">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <InputField
                                            label="Full Name"
                                            placeholder="John Doe"
                                            icon={<User className="w-4 h-4 text-muted-foreground" />}
                                            required
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <InputField
                                            label={role === 'student' ? "About You" : "Company Description"}
                                            placeholder={role === 'student' ? "Passionate developer looking for..." : "We are a leading tech company..."}
                                            icon={<FileText className="w-4 h-4 text-muted-foreground" />}
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                        />
                                    </div>
                                    {role === 'student' ? (
                                        <>
                                            <InputField
                                                label="University / College"
                                                placeholder="IIT Delhi"
                                                icon={<GraduationCap className="w-4 h-4 text-muted-foreground" />}
                                                required
                                                value={university}
                                                onChange={(e) => setUniversity(e.target.value)}
                                            />
                                            <InputField
                                                label="Degree"
                                                placeholder="B.Tech Computer Science"
                                                icon={<FileText className="w-4 h-4 text-muted-foreground" />}
                                                required
                                                value={degree}
                                                onChange={(e) => setDegree(e.target.value)}
                                            />
                                            <InputField
                                                label="Branch / Specialization"
                                                placeholder="Computer Science"
                                                icon={<Target className="w-4 h-4 text-muted-foreground" />}
                                                value={branch}
                                                onChange={(e) => setBranch(e.target.value)}
                                            />
                                            <InputField
                                                label="Graduation Year"
                                                placeholder="2026"
                                                icon={<Calendar className="w-4 h-4 text-muted-foreground" />}
                                                required
                                                value={gradYear}
                                                onChange={(e) => setGradYear(e.target.value)}
                                            />
                                            <InputField
                                                label="Skills (Comma separated)"
                                                placeholder="React, TypeScript, Figma"
                                                icon={<Save className="w-4 h-4 text-muted-foreground" />}
                                                required
                                                value={skills}
                                                onChange={(e) => setSkills(e.target.value)}
                                            />
                                            <InputField
                                                label="GitHub URL"
                                                placeholder="https://github.com/..."
                                                icon={<Github className="w-4 h-4 text-muted-foreground" />}
                                                value={github}
                                                onChange={(e) => setGithub(e.target.value)}
                                            />
                                            <InputField
                                                label="LinkedIn URL"
                                                placeholder="https://linkedin.com/in/..."
                                                icon={<Linkedin className="w-4 h-4 text-muted-foreground" />}
                                                value={linkedin}
                                                onChange={(e) => setLinkedin(e.target.value)}
                                            />
                                            <InputField
                                                label="Resume URL / Link"
                                                placeholder="Link to your PDF"
                                                icon={<FileText className="w-4 h-4 text-muted-foreground" />}
                                                value={resumeUrl}
                                                onChange={(e) => setResumeUrl(e.target.value)}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <InputField
                                                label="Company Name"
                                                placeholder="TechCorp Solutions"
                                                icon={<Building2 className="w-4 h-4 text-muted-foreground" />}
                                                required
                                                value={companyName}
                                                onChange={(e) => setCompanyName(e.target.value)}
                                            />
                                            <InputField
                                                label="Your Designation"
                                                placeholder="HR Manager / Tech Lead"
                                                icon={<Briefcase className="w-4 h-4 text-muted-foreground" />}
                                                required
                                                value={designation}
                                                onChange={(e) => setDesignation(e.target.value)}
                                            />
                                            <InputField
                                                label="Company Website"
                                                placeholder="https://techcorp.com"
                                                icon={<Globe className="w-4 h-4 text-muted-foreground" />}
                                                value={companyWebsite}
                                                onChange={(e) => setCompanyWebsite(e.target.value)}
                                            />
                                            <InputField
                                                label="LinkedIn Profile"
                                                placeholder="https://linkedin.com/in/..."
                                                icon={<Linkedin className="w-4 h-4 text-muted-foreground" />}
                                                value={linkedin}
                                                onChange={(e) => setLinkedin(e.target.value)}
                                            />
                                        </>
                                    )}
                                </div>

                                <PremiumButton
                                    type="submit"
                                    color="primary"
                                    glow
                                    disabled={loading}
                                    className="w-full h-14 rounded-2xl shadow-xl mt-8"
                                    endContent={<Save className="w-5 h-5" />}
                                >
                                    {loading ? 'Saving Profile...' : 'Complete Registration'}
                                </PremiumButton>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
