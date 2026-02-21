'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Plus,
    Users,
    Briefcase,
    CheckCircle2,
    TrendingUp,
    Calendar,
    ArrowRight,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

export default function RecruiterDashboard() {
    const [internships, setInternships] = useState<any[]>([]);
    const [stats, setStats] = useState({
        activeListings: 0,
        totalApplicants: 0,
        shortlisted: 0,
        selected: 0
    });
    const [companyName, setCompanyName] = useState('Recruiter');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                // 1. Fetch Company Name
                const { data: profile } = await supabase
                    .from('recruiter_profiles')
                    .select('company_name')
                    .eq('id', user.id)
                    .single();

                if (profile) setCompanyName(profile.company_name);

                // 2. Fetch Internships with applicant count
                const { data: jobs, error: jobsError } = await supabase
                    .from('internships')
                    .select('*, applications(count)')
                    .eq('recruiter_id', user.id);

                if (jobsError) throw jobsError;

                // 3. Process Job Data
                const processedJobs = jobs.map((job: any) => ({
                    ...job,
                    applicantCount: job.applications?.[0]?.count || 0
                }));

                setInternships(processedJobs);

                // 4. Calculate Stats
                const activeCount = processedJobs.filter((j: any) => j.status === 'open').length;
                const totalAppCount = processedJobs.reduce((acc: number, curr: any) => acc + curr.applicantCount, 0);

                setStats(prev => ({
                    ...prev,
                    activeListings: activeCount,
                    totalApplicants: totalAppCount
                }));

            } catch (err: any) {
                console.error('Error fetching dashboard data:', err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="space-y-12 animate-fade-in">
            {/* ── Greeting & CTA ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-foreground tracking-tight">Welcome back, {companyName} 👋</h1>
                    <p className="text-muted-foreground mt-2 font-medium">Here&apos;s what&apos;s happening with your hiring pipeline today.</p>
                </div>
                <Link href="/recruiter/create">
                    <Button variant="primary" size="lg" className="rounded-2xl px-8 h-14 font-black shadow-xl shadow-primary/20">
                        <Plus className="w-5 h-5 mr-3" /> Create Internship
                    </Button>
                </Link>
            </div>

            {/* ── 4 Stat Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: 'Active Listings', value: stats.activeListings, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Total Applicants', value: stats.totalApplicants, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: 'Shortlisted', value: stats.shortlisted, icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Offers Sent', value: stats.selected, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' }
                ].map((stat, i) => (
                    <Card key={i} className="p-8 border-none shadow-sm flex flex-col items-start gap-4 transition-all hover:shadow-xl rounded-[32px] bg-white group">
                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg)}>
                            <stat.icon className={cn("w-7 h-7", stat.color)} />
                        </div>
                        <div className="mt-2">
                            <p className="text-4xl font-black text-foreground tracking-tighter">{loading ? '...' : stat.value}</p>
                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-[0.15em] mt-1">{stat.label}</p>
                        </div>
                    </Card>
                ))}
            </div>

            {/* ── List of Internships ── */}
            <section>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-foreground tracking-tight">Active Listings</h2>
                    <Link href="/recruiter/manage" className="text-primary font-bold hover:underline flex items-center gap-1">
                        Manage All Listings <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => <div key={i} className="h-64 bg-white rounded-[40px] animate-pulse border border-slate-100" />)}
                    </div>
                ) : internships.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {internships.slice(0, 3).map((internship) => (
                            <Card key={internship.id} className="p-8 border-none shadow-md hover:shadow-2xl transition-all rounded-[40px] bg-white flex flex-col">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="p-3 bg-muted/30 rounded-2xl">
                                        <Briefcase className="w-8 h-8 text-muted-foreground/60" />
                                    </div>
                                    <Badge variant="outline" className="rounded-full px-4 py-1.5 border-2 border-emerald-100 text-emerald-600 font-black text-[10px] uppercase">
                                        {internship.status === 'open' ? 'Open' : 'Closed'}
                                    </Badge>
                                </div>

                                <h3 className="text-2xl font-black text-foreground mb-4 leading-tight">{internship.title}</h3>

                                <div className="space-y-4 mb-8 flex-1">
                                    <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground">
                                        <Calendar className="w-4 h-4 text-primary" />
                                        Deadline: {internship.deadline ? new Date(internship.deadline).toLocaleDateString() : 'TBD'}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground">
                                        <Users className="w-4 h-4 text-primary" />
                                        {internship.applicantCount} Applicants
                                    </div>
                                </div>

                                <Link href={`/recruiter/internships/${internship.id}/applicants`}>
                                    <Button variant="primary" className="w-full h-12 rounded-2xl font-black shadow-lg shadow-primary/10">Manage Applicants</Button>
                                </Link>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="p-20 text-center bg-white rounded-[40px] border border-dashed border-slate-200">
                        <h3 className="text-xl font-black text-slate-900 mb-2">No internships posted yet</h3>
                        <Link href="/recruiter/create">
                            <Button variant="primary" className="mt-4 rounded-xl px-8 h-12 font-black">Post Your First Job</Button>
                        </Link>
                    </div>
                )}
            </section>
        </div>
    );
}
