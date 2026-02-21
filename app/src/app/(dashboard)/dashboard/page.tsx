'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap,
    Star,
    TrendingUp,
    CheckCircle2,
    Calendar,
    ArrowRight,
    SearchX,
    ArrowUpRight,
    PlayCircle,
    Loader2
} from 'lucide-react';
import Card from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function StudentDashboard() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState<string | 'All'>('All');

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data: appData, error: appError } = await supabase
                    .from('applications')
                    .select('*')
                    .eq('student_id', user.id)
                    .order('applied_at', { ascending: false });

                if (appError) throw appError;

                if (appData && appData.length > 0) {
                    const internshipIds = [...new Set(appData.map(a => a.internship_id))];
                    const { data: intData } = await supabase
                        .from('internships')
                        .select('id, title, recruiter_id')
                        .in('id', internshipIds);

                    const recruiterIds = [...new Set(intData?.map(i => i.recruiter_id) || [])];
                    const { data: recData } = await supabase
                        .from('recruiter_profiles')
                        .select('id, company_name')
                        .in('id', recruiterIds);

                    const processed = appData.map(app => {
                        const internship = intData?.find(i => i.id === app.internship_id);
                        const recruiter = recData?.find(r => r.id === internship?.recruiter_id);
                        return {
                            ...app,
                            internshipTitle: internship?.title || 'Unknown Role',
                            company: recruiter?.company_name || 'Individual Recruiter',
                            appliedDate: app.applied_at
                        };
                    });
                    setApplications(processed);
                }
            } catch (err: any) {
                console.error('Error fetching dashboard data:', err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const stats = useMemo(() => {
        return {
            applied: applications.length,
            shortlisted: applications.filter(a => a.status === 'shortlisted').length,
            interview: applications.filter(a => a.status === 'interview').length,
            offered: applications.filter(a => a.status === 'offered').length,
        };
    }, [applications]);

    const filteredApplications = useMemo(() => {
        if (selectedStatus === 'All') return applications;
        return applications.filter(a => a.status.toLowerCase() === selectedStatus.toLowerCase());
    }, [selectedStatus, applications]);

    const statCards = [
        { label: 'Applied', value: stats.applied, status: 'applied', icon: Zap, color: 'text-blue-500' },
        { label: 'Shortlisted', value: stats.shortlisted, status: 'shortlisted', icon: Star, color: 'text-amber-500' },
        { label: 'Interviews', value: stats.interview, status: 'interview', icon: PlayCircle, color: 'text-rose-500' },
        { label: 'Offered', value: stats.offered, status: 'offered', icon: CheckCircle2, color: 'text-emerald-500' }
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Assembling Workspace...</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-fade-in pb-20 pt-10">
            {/* ── Heading ── */}
            <div>
                <h1 className="text-4xl font-black text-[#383838] tracking-tight font-sans">Application Workspace</h1>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-1 italic">Track and manage your professional opportunities in one place.</p>
            </div>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedStatus(selectedStatus === stat.status ? 'All' : stat.status)}
                    >
                        <Card className={cn(
                            "p-8 border-none md:shadow-sm border transition-all rounded-[40px] cursor-pointer flex flex-col gap-6",
                            selectedStatus.toLowerCase() === stat.status.toLowerCase() ? "bg-[#383838] text-white shadow-2xl" : "bg-white hover:shadow-xl border-slate-100"
                        )}>
                            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm", selectedStatus.toLowerCase() === stat.status.toLowerCase() ? "bg-white/10" : "bg-slate-50")}>
                                <stat.icon className={cn("w-6 h-6", selectedStatus.toLowerCase() === stat.status.toLowerCase() ? "text-white" : stat.color)} />
                            </div>
                            <div>
                                <p className="text-4xl font-black tracking-tighter leading-none mb-2">{stat.value}</p>
                                <p className={cn("text-[10px] font-black uppercase tracking-widest leading-none", selectedStatus.toLowerCase() === stat.status.toLowerCase() ? "text-white/60" : "text-slate-400")}>{stat.label}</p>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* ── Feed Section ── */}
            <section className="space-y-8">
                <div className="flex items-center justify-between px-1 border-b border-slate-100 pb-6">
                    <h2 className="text-2xl font-black text-[#383838] tracking-tight font-sans uppercase">
                        {selectedStatus === 'All' ? 'Application Activity' : `${selectedStatus} Roles`}
                    </h2>
                    {applications.length > 0 && (
                        <Link href="/activity" className="text-xs font-black text-primary hover:underline uppercase tracking-widest">
                            View All Activity
                        </Link>
                    )}
                </div>

                <AnimatePresence mode="wait">
                    {filteredApplications.length > 0 ? (
                        <motion.div
                            key={selectedStatus}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {filteredApplications.map((app) => (
                                <Link key={app.id} href="/activity" className="group">
                                    <Card className="p-8 border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[40px] bg-white h-full flex flex-col group border-b-4 hover:border-b-primary overflow-hidden">
                                        <div className="flex justify-between items-start mb-10">
                                            <div className="w-16 h-16 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center text-xl font-black text-slate-300">
                                                {app.company[0]}
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border-2",
                                                    app.status === 'offered' ? 'text-emerald-500 border-emerald-100 bg-emerald-50/50' :
                                                        app.status === 'rejected' ? 'text-rose-500 border-rose-100 bg-rose-50/50' : 'text-amber-500 border-amber-100 bg-amber-50/50'
                                                )}
                                            >
                                                {app.status}
                                            </Badge>
                                        </div>

                                        <h4 className="text-lg font-black text-[#383838] group-hover:text-primary transition-colors line-clamp-2 leading-tight mb-2 font-sans break-words">{app.internshipTitle}</h4>
                                        <p className="text-[10px] font-black text-slate-400 mb-10 uppercase tracking-widest break-words">{app.company} • Applied {new Date(app.appliedDate).toLocaleDateString()}</p>

                                        <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none">Status Tracking</span>
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                                <ArrowUpRight className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 bg-slate-50 rounded-[40px] text-center px-10 border-4 border-dashed border-slate-200">
                            <SearchX className="w-16 h-16 text-slate-200 mb-4" />
                            <h3 className="text-2xl font-black text-[#383838] uppercase">Workspace Empty</h3>
                            <p className="text-sm text-slate-400 mt-2 font-bold uppercase tracking-widest italic">You don&apos;t have any roles in the <b>{selectedStatus}</b> stage.</p>
                            <Button variant="ghost" size="lg" className="mt-8 text-xs font-black uppercase tracking-widest" onClick={() => setSelectedStatus('All')}>Clear Workspace Filter</Button>
                        </div>
                    )}
                </AnimatePresence>
            </section>
        </div>
    );
}
