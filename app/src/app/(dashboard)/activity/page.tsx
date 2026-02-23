'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    Calendar,
    SearchX,
    Building2,
    ArrowUpRight,
    ArrowRight,
    Trophy,
    Clock,
    Layout,
    CheckCircle2,
    Loader2
} from 'lucide-react';
import Card from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { api, Application } from '@/lib/api';

const filters = ['All', 'applied', 'shortlisted', 'interview', 'offered', 'rejected'];

interface ActivityApplication extends Application {
    applied_date: string;
    internship: {
        id?: string;
        title: string;
        location?: string;
        company: string;
    } | null;
}

export default function ActivityPage() {
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeAppId, setActiveAppId] = useState<string | null>(null);
    const [applications, setApplications] = useState<ActivityApplication[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const data = await api.applications.getMyApplications();

            // Transform API data to activity format
            const processed: ActivityApplication[] = data.map(app => ({
                ...app,
                applied_date: app.applied_at,
                internship: app.internships ? {
                    id: app.internship_id,
                    title: app.internships.title,
                    location: app.internships.location,
                    company: (app as any).company_name || 'Company'
                } : null
            }));

            setApplications(processed);
        } catch (err: any) {
            console.error('Error fetching applications:', err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const filteredApplications = applications.filter(app => {
        const matchesFilter = activeFilter === 'All' || app.status.toLowerCase() === activeFilter.toLowerCase();
        const matchesSearch = (app.internship?.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (app.internship?.company || '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="space-y-10 animate-fade-in pb-20 pt-10 px-4 md:px-0">
            {/* ── Page Header ── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
                <div>
                    <h1 className="text-4xl font-black text-black tracking-tight font-sans">Activity Stream</h1>
                    <p className="text-black/60 text-sm font-bold uppercase tracking-widest mt-1">Detailed journey of your professional applications.</p>
                </div>

                <div className="flex gap-6 items-center">
                    <div className="text-right">
                        <p className="text-[10px] font-black text-black/60 uppercase tracking-widest leading-none mb-1">Submissions</p>
                        <p className="text-3xl font-black text-black leading-none">{applications.length}</p>
                    </div>
                </div>
            </div>

            {/* ── Sub-Navigation ── */}
            <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-3 rounded-[32px] border border-black/10 shadow-sm">
                <div className="flex-1 flex gap-1 overflow-x-auto w-full md:w-auto scrollbar-hide px-1">
                    {filters.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={cn(
                                "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border",
                                activeFilter === filter
                                    ? "bg-black text-white border-black shadow-lg"
                                    : "bg-white text-black/60 border-black/10 hover:bg-[#f5f0e8]"
                            )}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-80 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40 group-focus-within:text-black transition-colors" />
                    <input
                        type="text"
                        placeholder="Search applications..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-14 pl-14 pr-6 bg-white border border-black/30 rounded-[20px] text-xs font-black uppercase tracking-widest focus:ring-4 focus:ring-black/10 outline-none transition-all placeholder:text-black/30 text-black"
                    />
                </div>
            </div>

            {/* ── Card Grid ── */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => <div key={i} className="h-80 bg-white rounded-[40px] animate-pulse border border-black/10" />)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredApplications.length > 0 ? (
                        filteredApplications.map((app) => (
                            <div key={app.id} className="relative group">
                                <Card
                                    className={cn(
                                        "p-8 border shadow-sm transition-all rounded-[40px] bg-white h-full flex flex-col group/app hover:shadow-2xl hover:-translate-y-1 cursor-pointer",
                                        activeAppId === app.id ? "border-black/60 bg-[#f5f0e8]" : "border-black/10"
                                    )}
                                    onClick={() => setActiveAppId(activeAppId === app.id ? null : app.id)}
                                >
                                    <div className="flex justify-between items-start mb-10">
                                        <div className="w-16 h-16 bg-white rounded-2xl border border-black/10 shadow-sm flex items-center justify-center text-xl font-black text-black/40">
                                            {app.internship?.company[0]}
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border-2",
                                                app.status === 'offered' ? "text-emerald-500 border-emerald-100 bg-emerald-50/50" :
                                                    app.status === 'rejected' ? "text-rose-500 border-rose-100 bg-rose-50/50" : "text-amber-500 border-amber-100 bg-amber-50/50"
                                            )}
                                        >
                                            {app.status}
                                        </Badge>
                                    </div>

                                    <h3 className="text-xl font-black text-black mb-2 group-hover/app:text-black transition-colors leading-tight line-clamp-2 font-sans break-words">
                                        {app.internship?.title}
                                    </h3>
                                    <p className="text-[10px] font-black text-black/60 uppercase tracking-widest mb-10 break-words">
                                        {app.internship?.company} • Applied {new Date(app.applied_date).toLocaleDateString()}
                                    </p>

                                    <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-black/40">
                                            <Clock className="w-4 h-4" />
                                            <span className="text-[10px] font-black uppercase tracking-tighter">Live Updates</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] font-black text-black uppercase tracking-widest group-hover/app:gap-2 transition-all">
                                            Track Status <ArrowRight className="w-3.5 h-3.5" />
                                        </div>
                                    </div>
                                </Card>

                                {/* Simple Timeline Overlay */}
                                <AnimatePresence>
                                    {activeAppId === app.id && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute inset-0 z-10 bg-white/98 backdrop-blur-md p-10 rounded-[40px] border-2 border-black/20 shadow-2xl flex flex-col pointer-events-auto overflow-hidden"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <div className="flex justify-between items-center mb-8">
                                                <h4 className="text-[10px] font-black text-black/60 uppercase tracking-widest">Journey Tracking</h4>
                                                <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-black/5 text-black/60 hover:text-black transition-colors" onClick={() => setActiveAppId(null)}>✕</button>
                                            </div>

                                            <div className="flex-1 space-y-8 overflow-y-auto pr-2 scrollbar-hide">
                                                <div className="relative pl-10 before:absolute before:left-3 before:top-4 before:bottom-[-32px] before:w-1 before:bg-emerald-50">
                                                    <div className="absolute left-0 top-0.5 w-6 h-6 rounded-full bg-emerald-500 border-4 border-emerald-50 shadow-lg shadow-emerald-200" />
                                                    <p className="text-base font-black text-black leading-none mb-1 uppercase tracking-tight">{app.status}</p>
                                                    <p className="text-[10px] text-black/60 font-bold uppercase tracking-widest">Current Stage</p>
                                                </div>
                                                <div className="relative pl-10">
                                                    <div className="absolute left-1 top-1.5 w-4 h-4 rounded-full bg-slate-200" />
                                                    <p className="text-base font-black text-black/70 leading-none mb-1 uppercase tracking-tight italic">Application Sent</p>
                                                    <p className="text-[10px] text-black/60 font-bold uppercase tracking-widest">{new Date(app.applied_date).toLocaleDateString()}</p>
                                                </div>
                                            </div>

                                            <div className="mt-10 space-y-3">
                                                <Link href={`/internships/${app.internship?.id}`} className="block">
                                                    <Button variant="primary" className="w-full h-14 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/10">View Original Posting</Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    className="w-full h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest text-black/60 hover:text-rose-600 hover:bg-rose-50"
                                                    onClick={() => alert('Withdrawal feature coming soon')}
                                                >
                                                    Withdraw Application
                                                </Button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-32 text-center bg-white rounded-[40px] border-4 border-dashed border-black/10">
                            <SearchX className="w-16 h-16 text-black/20 mx-auto mb-6" />
                            <h2 className="text-2xl font-black text-black">No submissions yet</h2>
                            <p className="text-sm text-black/60 mt-2 max-w-xs mx-auto font-bold uppercase tracking-widest italic">Ready to start your ascent? Find an internship and apply!</p>
                            <Link href="/home">
                                <Button
                                    variant="primary"
                                    className="mt-10 rounded-2xl px-10 h-14 font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/10"
                                >
                                    Explore Internships
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
