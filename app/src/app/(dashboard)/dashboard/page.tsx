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
import { api, Application } from '@/lib/api';

interface ProcessedApplication extends Application {
    internshipTitle: string;
    company: string;
    appliedDate: string;
}

export default function StudentDashboard() {
    const [applications, setApplications] = useState<ProcessedApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState<string | 'All'>('All');

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const appData = await api.applications.getMyApplications();

                // Process the applications with enriched data from joins
                const processed = appData.map(app => ({
                    ...app,
                    internshipTitle: app.internships?.title || 'Unknown Role',
                    company: 'Company', // Company name would need to be fetched separately or included in API join
                    appliedDate: app.applied_at
                }));
                setApplications(processed);
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
        { label: 'Applied', value: stats.applied, status: 'applied', icon: Zap },
        { label: 'Shortlisted', value: stats.shortlisted, status: 'shortlisted', icon: Star },
        { label: 'Interviews', value: stats.interview, status: 'interview', icon: PlayCircle },
        { label: 'Offered', value: stats.offered, status: 'offered', icon: CheckCircle2 }
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
                <Loader2 className="w-8 h-8 text-black/40 animate-spin" />
                <p className="font-semibold text-black/50 tracking-wide text-xs">Loading your workspace…</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-fade-in pb-16 pt-8">
            {/* ── Heading ── */}
            <div>
                <h1 className="text-3xl md:text-4xl font-black text-black tracking-tight font-sans">Application Workspace</h1>
                <p className="text-black/60 text-sm mt-1">Track and manage your professional opportunities in one place.</p>
            </div>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                {statCards.map((stat, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedStatus(selectedStatus === stat.status ? 'All' : stat.status)}
                    >
                        <Card className={cn(
                            "p-5 md:p-6 border transition-all rounded-2xl cursor-pointer flex flex-col gap-4 bg-white shadow-sm hover:shadow-md",
                            selectedStatus.toLowerCase() === stat.status.toLowerCase() && "border-black/40 shadow-md"
                        )}>
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm bg-white border border-black/10">
                                <stat.icon className="w-5 h-5 text-black/70" />
                            </div>
                            <div>
                                <p className="text-2xl md:text-3xl font-black tracking-tight leading-none mb-1 text-black">{stat.value}</p>
                                <p className="text-[11px] font-semibold uppercase tracking-wide leading-none text-black/60">{stat.label}</p>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* ── Feed Section ── */}
            <section className="space-y-8">
                <div className="flex items-center justify-between px-1 border-b border-slate-100 pb-6">
                    <h2 className="text-2xl font-black text-black tracking-tight font-sans uppercase">
                        {selectedStatus === 'All' ? 'Application Activity' : `${selectedStatus} Roles`}
                    </h2>
                    {applications.length > 0 && (
                        <Link href="/activity" className="text-xs font-semibold text-black/60 hover:text-black uppercase tracking-wide">
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
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                        >
                            {filteredApplications.map((app) => (
                                <Link key={app.id} href="/activity">
                                    <Card className="p-5 md:p-6 border border-black/10 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl bg-white h-full flex flex-col overflow-hidden">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-12 h-12 bg-white rounded-xl border border-black/10 shadow-sm flex items-center justify-center text-lg font-black text-black/30">
                                                {app.company[0]}
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide border",
                                                    app.status === 'offered' ? 'text-emerald-500 border-emerald-100 bg-emerald-50/50' :
                                                        app.status === 'rejected' ? 'text-rose-500 border-rose-100 bg-rose-50/50' : 'text-amber-500 border-amber-100 bg-amber-50/50'
                                                )}
                                            >
                                                {app.status}
                                            </Badge>
                                        </div>

                                        <h4 className="text-base md:text-lg font-bold text-black line-clamp-2 leading-snug mb-1 font-sans break-words">{app.internshipTitle}</h4>
                                        <p className="text-[11px] text-black/50 mb-6 break-words">{app.company} • Applied {new Date(app.appliedDate).toLocaleDateString()}</p>

                                        <div className="mt-auto pt-4 border-t border-black/5 flex items-center justify-between">
                                            <span className="text-[10px] font-semibold text-black/40 uppercase tracking-wide leading-none">Status tracking</span>
                                            <div className="w-9 h-9 rounded-lg bg-[#f5f0e8] flex items-center justify-center text-black/40 shadow-sm">
                                                <ArrowUpRight className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </motion.div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl text-center px-8 border border-dashed border-black/10">
                            <SearchX className="w-12 h-12 text-black/20 mb-4" />
                            <h3 className="text-xl font-black text-black">Workspace empty</h3>
                            <p className="text-sm text-black/55 mt-2">You don&apos;t have any roles in the <b>{selectedStatus}</b> stage.</p>
                            <Button
                                variant="ghost"
                                size="lg"
                                className="mt-6 text-xs font-semibold uppercase tracking-wide text-black/60 hover:text-black"
                                onClick={() => setSelectedStatus('All')}
                            >
                                Clear workspace filter
                            </Button>
                        </div>
                    )}
                </AnimatePresence>
            </section>
        </div>
    );
}
