'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '@/components/ui/Accordion';
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
    ChevronLeft
} from 'lucide-react';
import { supabase, Internship } from '@/lib/supabase';

export default function InternshipDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [internship, setInternship] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [hasApplied, setHasApplied] = useState(false);

    useEffect(() => {
        const fetchInternship = async () => {
            setLoading(true);
            try {
                // Fetch core internship data first to bypass join relationship issues
                const { data: internshipData, error: intError } = await supabase
                    .from('internships')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (intError) throw intError;

                if (internshipData) {
                    // Fetch related data in parallel
                    const [recRes, appsRes] = await Promise.all([
                        supabase.from('recruiter_profiles').select('company_name').eq('id', internshipData.recruiter_id).single(),
                        supabase.from('applications').select('count', { count: 'exact', head: true }).eq('internship_id', id)
                    ]);

                    setInternship({
                        ...internshipData,
                        company: recRes.data?.company_name || 'Individual Recruiter',
                        applicantCount: appsRes.count || 0,
                        isOpen: internshipData.status === 'open',
                        skills: internshipData.skills_required || [],
                        posted_date: internshipData.created_at,
                        duration: internshipData.duration || 'Flexible',
                        stipend: internshipData.stipend || 'Competitive',
                        location: internshipData.location || 'Remote'
                    });

                    // Check if current user has applied
                    const { data: { user } } = await supabase.auth.getUser();
                    if (user) {
                        const { data: existingApp } = await supabase
                            .from('applications')
                            .select('id')
                            .eq('internship_id', id)
                            .eq('student_id', user.id)
                            .maybeSingle();

                        if (existingApp) setHasApplied(true);
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
            <div className="max-w-4xl mx-auto space-y-6 pt-10">
                <div className="h-64 bg-white rounded-[40px] animate-pulse border border-slate-100" />
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 h-96 bg-white rounded-[40px] animate-pulse" />
                    <div className="h-48 bg-white rounded-[40px] animate-pulse" />
                </div>
            </div>
        );
    }

    if (!internship) {
        return (
            <div className="max-w-4xl mx-auto text-center py-20">
                <h2 className="text-2xl font-black text-slate-900">Internship not found</h2>
                <Button variant="ghost" className="mt-4" onClick={() => router.back()}>
                    <ChevronLeft className="w-4 h-4 mr-2" /> Go Back
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-slide-up pb-20 pt-10 px-4 md:px-0">
            <Button variant="ghost" className="mb-2 text-slate-500 hover:text-primary font-bold" onClick={() => router.back()}>
                <ChevronLeft className="w-4 h-4 mr-2" /> Back to Search
            </Button>

            {/* ── Header ── */}
            <Card padding="lg" className="rounded-[40px] border-none shadow-sm">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex gap-5">
                        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-primary/20 text-white text-2xl font-black">
                            {internship.company[0]}
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-foreground tracking-tight leading-tight">{internship.title}</h1>
                            <p className="text-lg text-muted-foreground font-bold">{internship.company}</p>

                            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground font-bold">
                                <span className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4 text-primary" />
                                    {internship.duration}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    {internship.location}
                                </span>
                                <span className="flex items-center gap-1.5 font-black text-foreground">
                                    <DollarSign className="w-4 h-4 text-emerald-500" />
                                    {internship.stipend}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="shrink-0">
                        {!internship.isOpen ? (
                            <Badge variant="destructive" className="px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest">Applications Closed</Badge>
                        ) : hasApplied ? (
                            <Badge variant="secondary" className="px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest border-2 border-emerald-100 bg-emerald-50 text-emerald-600">Already Applied</Badge>
                        ) : (
                            <Link href={`/internships/${internship.id}/apply`}>
                                <Button variant="primary" size="lg" className="w-full md:w-auto shadow-xl shadow-primary/20 rounded-2xl h-14 px-8 font-black">
                                    Apply Now
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-2">
                    {internship.skills?.map((skill: string) => (
                        <Badge key={skill} variant="secondary" className="px-4 py-1.5 rounded-xl bg-slate-100 text-slate-700 border-none font-bold">{skill}</Badge>
                    ))}
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Deadline</p>
                        <p className="text-sm font-black flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-primary" />
                            {internship.deadline ? new Date(internship.deadline).toLocaleDateString() : 'TBD'}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Applicants</p>
                        <p className="text-sm font-black flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-primary" />
                            {internship.applicantCount}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Posted On</p>
                        <p className="text-sm font-black">
                            {internship.posted_date ? new Date(internship.posted_date).toLocaleDateString() : 'Recently'}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Level</p>
                        <p className="text-sm font-black">Entry Level</p>
                    </div>
                </div>
            </Card>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="rounded-[40px] border-none shadow-sm p-8">
                        <h2 className="text-xl font-black text-foreground mb-4 uppercase tracking-tight">Role Overview</h2>
                        <p className="text-slate-600 leading-relaxed whitespace-pre-line font-medium italic break-words">
                            {internship.description}
                        </p>
                    </Card>

                    <Card className="rounded-[40px] border-none shadow-sm p-8">
                        <h2 className="text-xl font-black text-foreground mb-4 uppercase tracking-tight">Requirements & Eligibility</h2>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4 p-5 bg-primary/5 rounded-2xl border border-primary/10">
                                <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-black text-primary uppercase tracking-widest mb-1">Eligibility</p>
                                    <p className="text-sm text-slate-700 font-bold leading-relaxed break-words">
                                        {internship.eligibility || 'Open to all current university students and recent graduates.'}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Technical Requirements</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {internship.skills && internship.skills.length > 0 ? (
                                        internship.skills.map((skill: string) => (
                                            <div key={skill} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                                                <span className="text-sm font-bold text-slate-700 break-words">{skill} Proficiency</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-slate-500 font-medium italic">No specific technical skills mentioned.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card className="rounded-[40px] border-none shadow-sm p-8">
                        <h2 className="text-lg font-black text-foreground mb-4 uppercase tracking-tight">About {internship.company}</h2>
                        <div className="space-y-5">
                            <p className="text-sm text-slate-600 font-medium leading-relaxed italic">
                                {internship.company} is a forward-thinking organization dedicated to innovation and professional growth.
                            </p>
                            <Link href="#" className="flex items-center gap-2 text-sm font-black text-primary hover:underline group">
                                View Company Profile
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </Card>

                    <Card className="bg-slate-900 border-none rounded-[40px] p-8 text-white">
                        <h2 className="text-lg font-black mb-2 uppercase tracking-tight">Need Help?</h2>
                        <p className="text-sm text-slate-400 mb-6 font-medium">
                            Have questions about this role or the application process?
                        </p>
                        <Button variant="primary" size="lg" className="w-full rounded-2xl h-12 font-black">Contact Support</Button>
                    </Card>
                </div>
            </div>

            {/* ── Sticky Apply (Mobile) ── */}
            {internship.isOpen && (
                <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 z-30">
                    {hasApplied ? (
                        <div className="text-center p-3 bg-emerald-50 rounded-2xl border-2 border-emerald-100 text-emerald-600 font-black text-xs uppercase tracking-widest">
                            Already Applied
                        </div>
                    ) : (
                        <Link href={`/internships/${internship.id}/apply`}>
                            <Button size="lg" className="w-full shadow-lg shadow-primary/20 rounded-2xl h-14 font-black">Apply Now</Button>
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
