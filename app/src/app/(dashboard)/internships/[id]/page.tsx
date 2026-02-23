'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PremiumButton } from '@/components/ui/PremiumButton';
import {
    Clock,
    MapPin,
    DollarSign,
    Calendar,
    Users,
    Briefcase,
    Info,
    CheckCircle,
    ArrowRight,
    ChevronLeft,
    Globe,
    ShieldCheck
} from 'lucide-react';
import { api, Internship } from '@/lib/api';
import { useAuthContext } from '@/lib/auth-context';

interface ProcessedInternship extends Internship {
    company: string;
    applicantCount: number;
    isOpen: boolean;
    skills: string[];
    posted_date: string;
}

export default function InternshipDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const { user } = useAuthContext();

    const [internship, setInternship] = useState<ProcessedInternship | null>(null);
    const [loading, setLoading] = useState(true);
    const [hasApplied, setHasApplied] = useState(false);

    useEffect(() => {
        const fetchInternship = async () => {
            setLoading(true);
            try {
                const internshipData = await api.internships.getById(id);

                setInternship({
                    ...internshipData,
                    company: internshipData.company || 'Individual Recruiter',
                    applicantCount: internshipData.applicant_count || 0,
                    isOpen: internshipData.status === 'open',
                    skills: internshipData.skills_required || [],
                    posted_date: internshipData.created_at,
                    duration: internshipData.duration || 'Flexible',
                    stipend: internshipData.stipend || 'Competitive',
                    location: internshipData.location || 'Remote'
                });

                // Check if user has already applied
                if (user) {
                    try {
                        const applications = await api.applications.getMyApplications();
                        const applied = applications.some(app => app.internship_id === id);
                        if (applied) setHasApplied(true);
                    } catch {
                        // Ignore - user might not be authenticated as student
                    }
                }
            } catch (error: any) {
                console.error('Error fetching internship:', error.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchInternship();
    }, [id]);

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto space-y-12 pt-20 px-6">
                <div className="h-72 bg-[#f5f0e8] rounded-[48px] animate-pulse border border-black/5" />
                <div className="grid lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 h-96 bg-[#f5f0e8] rounded-[48px] animate-pulse" />
                    <div className="h-64 bg-[#f5f0e8] rounded-[48px] animate-pulse" />
                </div>
            </div>
        );
    }

    if (!internship) {
        return (
            <div className="max-w-5xl mx-auto text-center py-40">
                <h2 className="text-4xl font-black text-black italic tracking-tighter">Internship not found.</h2>
                <Button variant="ghost" className="mt-8 bg-[#f5f0e8] rounded-2xl px-10 h-14 text-black" onClick={() => router.back()}>
                    <ChevronLeft className="w-5 h-5 mr-2" /> GO BACK
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto pb-20 pt-10 px-4 md:px-8">
            <button onClick={() => router.back()} className="group inline-flex items-center gap-3 text-black/40 hover:text-black font-black text-[10px] tracking-[0.2em] uppercase transition-all mb-5">
                <div className="w-10 h-10 rounded-full bg-[#f5f0e8] border border-black/5 flex items-center justify-center group-hover:bg-[#ebe5d9] transition-all">
                    <ChevronLeft className="w-5 h-5" />
                </div>
                Back to Opportunities
            </button>
            <Card className="rounded-[32px] bg-white border border-black/5 shadow-sm p-8 md:p-10 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full pointer-events-none" />
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 md:gap-10 relative z-10">
                    <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start text-center md:text-left">
                        <div className="w-24 h-24 bg-white rounded-[28px] border border-black/10 flex items-center justify-center shrink-0 shadow-lg text-black/30 text-4xl font-black italic">
                            {internship.company[0]}
                        </div>
                        <div className="space-y-4 text-left">
                            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                <Badge className="bg-blue-600/10 text-blue-600 border-blue-600/20 rounded-md px-3 py-1 text-[9px] font-black tracking-widest uppercase">Verified Opportunity</Badge>
                                <Badge className="bg-black/5 text-black/50 border-black/10 rounded-md px-3 py-1 text-[9px] font-black tracking-widest uppercase italic">{internship.location}</Badge>
                            </div>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-black tracking-tight leading-snug">{internship.title}</h1>
                            <p className="text-base md:text-lg font-semibold text-black/60">{internship.company}</p>
                        </div>
                    </div>
                    <div className="shrink-0 flex justify-center">
                        {!internship.isOpen ? (
                            <div className="px-10 py-5 bg-white border border-red-500/20 rounded-[28px] text-[11px] font-black text-red-500 tracking-[0.2em] uppercase">Applications Closed</div>
                        ) : hasApplied ? (
                            <div className="px-10 py-5 bg-white border border-emerald-500/20 rounded-[28px] text-[11px] font-black text-emerald-500 tracking-[0.2em] uppercase">Status: Applied</div>
                        ) : (
                            <Link href={`/internships/${internship.id}/apply`}>
                                <PremiumButton glow className="h-16 px-14 bg-white text-black font-black text-xs tracking-[0.2em] uppercase rounded-2xl shadow-2xl">
                                    APPLY NOW
                                </PremiumButton>
                            </Link>
                        )}
                    </div>
                </div>
                <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-black/5 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
                    <div className="space-y-2">
                        <p className="text-xs text-black/50 font-semibold">Application deadline</p>
                        <p className="text-sm md:text-base font-semibold text-black">
                            {internship.deadline ? new Date(internship.deadline).toLocaleDateString() : 'Mar 15, 2026'}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs text-black/50 font-semibold">Total applicants</p>
                        <p className="text-sm md:text-base font-semibold text-black">{internship.applicantCount}</p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs text-black/50 font-semibold">Posted date</p>
                        <p className="text-sm md:text-base font-semibold text-black">
                            {internship.posted_date ? new Date(internship.posted_date).toLocaleDateString() : 'Recently'}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xs text-black/50 font-semibold">Experience level</p>
                        <p className="text-sm md:text-base font-semibold text-black">Junior / entry</p>
                    </div>
                </div>
                <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-black/5 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div>
                        <h2 className="text-lg md:text-xl font-bold text-black mb-3 md:mb-4 flex items-center gap-2 md:gap-3">
                            <Briefcase className="w-5 h-5 md:w-6 md:h-6 text-blue-600" /> Role specification
                        </h2>
                        <div className="rounded-2xl border border-black/5 bg-white/80 px-4 py-3 md:px-5 md:py-4">
                            <p className="text-sm md:text-base text-black/70 leading-relaxed font-medium break-words">
                                {internship.description}
                            </p>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-lg md:text-xl font-bold text-black mb-4 md:mb-5 flex items-center gap-2 md:gap-3">
                            <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-blue-600" /> Required expertise
                        </h2>
                        <div className="space-y-3 md:space-y-4">
                            {internship.skills && internship.skills.length > 0 ? (
                                internship.skills.map((skill: string) => (
                                    <div key={skill} className="flex items-center gap-4 p-5 bg-white border border-black/5 rounded-3xl group hover:border-blue-400/30 transition-all">
                                        <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center group-hover:bg-blue-600/20 transition-colors">
                                            <CheckCircle className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <span className="text-sm font-semibold text-black">{skill}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-black/50 font-medium italic">General engineering skills required.</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-black/5 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div>
                        <h2 className="text-xs md:text-sm font-semibold text-black/50 mb-3 md:mb-4">Organization</h2>
                        <div className="space-y-6">
                            <div className="w-20 h-20 bg-white rounded-[24px] border border-black/10 flex items-center justify-center text-3xl font-black text-black/20 italic">
                                {internship.company[0]}
                            </div>
                            <h3 className="text-lg md:text-2xl font-bold text-black tracking-tight">{internship.company}</h3>
                            <p className="text-sm md:text-base text-black/60 font-medium leading-relaxed">
                                {internship.company} is a forward-thinking organization dedicated to digital innovation and scale.
                            </p>
                            <Button className="w-full h-14 rounded-2xl bg-white border border-black/10 text-black font-black text-[10px] tracking-[0.2em] uppercase hover:bg-[#ebe5d9]">
                                VIEW PROFILE
                            </Button>
                        </div>
                    </div>
                    <div className="relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[50px] group-hover:blur-[80px] transition-all" />
                        <h2 className="text-lg md:text-xl font-bold mb-3 tracking-tight">Support</h2>
                        <p className="text-sm text-black/60 mb-6 font-medium leading-relaxed">
                            Questions about the application process? Our verified network is here to help.
                        </p>
                        <Button className="w-full bg-blue-600 border border-blue-600 text-white font-black text-[10px] tracking-[0.2em] rounded-2xl h-14 uppercase hover:bg-blue-700">
                            CONTACT AGENT
                        </Button>
                    </div>
                </div>
            </Card>
            {/* Sticky Mobile Apply */}
            {internship.isOpen && !hasApplied && (
                <div className="lg:hidden fixed bottom-0 left-0 right-0 p-6 z-50">
                    <div className="bg-white border border-black/10 p-2 rounded-[32px] shadow-2xl">
                        <Link href={`/internships/${internship.id}/apply`}>
                            <PremiumButton className="w-full h-16 bg-white text-black font-black text-xs uppercase tracking-[0.2em] rounded-[28px]">
                                APPLY NOW
                            </PremiumButton>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
