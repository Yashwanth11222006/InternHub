'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    MapPin,
    Filter,
    ArrowUpRight,
    Globe,
    Clock,
    Briefcase,
    Sparkles,
    Zap,
    TrendingUp,
    Timer,
    Share2,
    Heart,
    ChevronDown,
    ArrowRight,
    Award,
    Wallet,
    Users,
    Calendar
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { internships as mockInternships } from '@/lib/mockData';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { supabase, Internship } from '@/lib/supabase';

// ── Sub-components & Variants (Moved outside for better performance & scope safety) ──

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const getCompanyLogo = (company: string) => (
    <div className="w-12 h-12 bg-slate-50 rounded-xl border border-slate-100/50 flex items-center justify-center p-2.5 overflow-hidden shadow-sm">
        <div className="text-[15px] font-black text-slate-400 tracking-tighter uppercase">{company ? company[0] : 'I'}</div>
    </div>
);

const InternshipCard = ({ internship, mounted }: { internship: any, mounted: boolean }) => (
    <div className="w-full transition-all duration-300 hover:-translate-y-1">
        <Link href={`/internships/${internship.id}`} className="block group">
            <div className="p-6 border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-500 rounded-[24px] bg-white flex flex-col relative border-b-2 hover:border-b-primary">
                <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1 flex-1 pr-4">
                        <h3 className="text-xl font-black text-[#383838] leading-tight group-hover:text-primary transition-colors tracking-tight font-sans break-words">
                            {internship.title}
                        </h3>
                        <p className="text-sm font-extrabold text-[#383838]/70 tracking-tight font-sans break-words">
                            {internship.company}
                        </p>
                    </div>
                    <div className="shrink-0">
                        {getCompanyLogo(internship.company)}
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center gap-2.5">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-black text-slate-400 leading-none mb-1">Start Date</span>
                            <span className="text-xs font-black text-[#383838]">Immediate</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-black text-slate-400 leading-none mb-1">Duration</span>
                            <span className="text-xs font-black text-[#383838]">{internship.duration}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <Wallet className="w-4 h-4 text-slate-400" />
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-black text-slate-400 leading-none mb-1">Stipend</span>
                            <span className="text-xs font-black text-[#383838]">{internship.stipend}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-black text-slate-400 leading-none mb-1">Location</span>
                            <span className="text-xs font-black text-[#383838]">{internship.location}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                    {internship.skills?.slice(0, 3).map((skill: string) => (
                        <Badge key={skill} variant="secondary" className="bg-slate-50 text-slate-600 border-slate-100 rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-tight">
                            {skill}
                        </Badge>
                    ))}
                    <div className="flex items-center gap-1.5 ml-auto text-primary font-black">
                        <Users className="w-4 h-4" />
                        <span className="text-xs">{internship.applicantCount || 0} applied</span>
                    </div>
                </div>

                <div className="pt-5 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                            <Timer className="w-3 h-3" />
                            Apply by {mounted && internship.deadline ? new Date(internship.deadline).toLocaleDateString() : 'Mar 15, 2026'}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" className="h-9 w-9 p-0 rounded-xl hover:bg-slate-50">
                            <Share2 className="w-4 h-4 text-slate-400" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-9 w-9 p-0 rounded-xl hover:bg-slate-50">
                            <Heart className="w-4 h-4 text-slate-400" />
                        </Button>
                        <div className="h-9 px-6 bg-[#383838] text-white rounded-xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all shadow-sm">
                            View Details
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    </div>
);

const FilterButton = ({ label, icon: Icon, badge }: { label: string, icon?: any, badge?: string | number }) => (
    <button suppressHydrationWarning className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-colors shrink-0">
        {Icon && <Icon className="w-3.5 h-3.5 text-slate-500" />}
        <span className="text-[12px] font-bold text-slate-700">{label}</span>
        {badge && (
            <span className="w-4 h-4 bg-primary text-white text-[9px] font-black rounded-full flex items-center justify-center">
                {badge}
            </span>
        )}
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
    </button>
);

export default function StudentHome() {
    const [searchQuery, setSearchQuery] = useState('');
    const [internships, setInternships] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const fetchInternships = async () => {
            setLoading(true);
            try {
                // Fetch all internships - removed filters for maximum visibility
                const { data: rawInternships, error: intError } = await supabase
                    .from('internships')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (intError) throw intError;

                let finalInternships = [];

                if (rawInternships && rawInternships.length > 0) {
                    const recIds = [...new Set(rawInternships.map(i => i.recruiter_id))];
                    const intIds = rawInternships.map(i => i.id);

                    // Fetch related recruiter and application data in parallel
                    const [recsRes, appsRes] = await Promise.all([
                        supabase.from('recruiter_profiles').select('id, company_name').in('id', recIds),
                        supabase.from('applications').select('internship_id').in('internship_id', intIds)
                    ]);

                    finalInternships = rawInternships.map(i => {
                        const recruiter = recsRes.data?.find(r => r.id === i.recruiter_id);
                        const appCount = appsRes.data?.filter(a => a.internship_id === i.id).length || 0;

                        return {
                            ...i,
                            company: recruiter?.company_name || 'Individual Recruiter',
                            applicantCount: appCount,
                            skills: i.skills_required || [],
                            posted_date: i.created_at,
                            duration: i.duration || 'Flexible',
                            stipend: i.stipend || 'Competitive',
                            location: i.location || 'Remote'
                        };
                    });
                } else {
                    // Fallback to mock data if the DB table is empty
                    // This creates a better first impression and confirms structural correctness
                    finalInternships = mockInternships.map(i => ({
                        ...i,
                        skills: i.skills || [],
                        applicantCount: i.applicantCount || 0,
                        posted_date: i.postedDate ? new Date(i.postedDate).toISOString() : new Date().toISOString()
                    }));
                }
                setInternships(finalInternships);
            } catch (error: any) {
                console.error('Error in fetchInternships:', error.message);
                // Last ditch fallback to mock data on error
                setInternships(mockInternships as any);
            } finally {
                setLoading(false);
            }
        };

        fetchInternships();
    }, []);

    const filteredInternships = internships.filter(i =>
        (i.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (i.company?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (i.skills || []).some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="animate-fade-in pb-32">
            {/* ── Compact Hero Section ── */}
            <section className="relative h-[50vh] min-h-[400px] w-full overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-slate-900/40 z-10" />
                    <img
                        src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=2000"
                        alt="Collaborative Workspace"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="relative z-20 max-w-5xl mx-auto text-center px-4 pt-24 text-white">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-tight mb-8"
                    >
                        Your professional <br />
                        <span className="text-primary">ascent starts here.</span>
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="w-full max-w-2xl mx-auto bg-white/10 backdrop-blur-xl p-2 rounded-2xl border border-white/20 shadow-2xl flex items-center group focus-within:bg-white/20 transition-all"
                    >
                        <div className="pl-6 text-white/60">
                            <Search className="w-5 h-5" />
                        </div>
                        <input
                            type="text"
                            placeholder="Engineering, Design, Marketing..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 h-14 px-6 bg-transparent text-sm font-bold text-white placeholder:text-white/40 outline-none"
                        />
                        <Button className="h-12 px-10 rounded-xl bg-white text-slate-900 hover:bg-primary hover:text-white font-black text-sm transition-all shadow-xl">
                            Find Roles
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* ── Interactive Feed Layout ── */}
            <div className="w-full px-2 md:px-4 lg:px-6 mt-12 relative z-30 space-y-6 max-w-[1600px] mx-auto">

                {/* Filters Row */}
                <div className="flex flex-wrap items-center gap-2.5 pb-2 overflow-x-auto no-scrollbar">
                    <FilterButton label="Filters" icon={Filter} badge="2" />
                    <FilterButton label="Type" />
                    <FilterButton label="Location" />
                    <FilterButton label="Roles" />
                    <button suppressHydrationWarning className="ml-auto flex items-center gap-2 px-4 py-2 hover:bg-white/50 rounded-full transition-colors">
                        <TrendingUp className="w-4 h-4 text-slate-500" />
                        <span className="text-[13px] font-bold text-slate-700">Sort By</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Main Feed (Left) */}
                    <div className="lg:col-span-8 space-y-6">
                        {loading ? (
                            <div className="space-y-6">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-64 bg-white rounded-[32px] animate-pulse border border-slate-100" />
                                ))}
                            </div>
                        ) : filteredInternships.length > 0 ? (
                            <div className="space-y-6">
                                {filteredInternships.map((internship) => (
                                    <InternshipCard key={internship.id} internship={internship} mounted={mounted} />
                                ))}
                            </div>
                        ) : (
                            <div className="p-20 text-center bg-white rounded-[40px] border border-dashed border-slate-200">
                                <h3 className="text-xl font-black text-slate-900 mb-2">No internships found</h3>
                                <p className="text-slate-500 font-bold">Try adjusting your search or filters.</p>
                            </div>
                        )}
                    </div>

                    {/* Featured Sidebar (Right) */}
                    <div className="lg:col-span-4 sticky top-24">
                        <Card className="p-6 bg-slate-100/80 border-none rounded-[32px] backdrop-blur-sm">
                            <h2 className="text-lg font-black text-[#383838] mb-6 flex items-center gap-2 font-sans">
                                <Zap className="w-5 h-5 text-primary" /> Featured
                            </h2>
                            <div className="space-y-4">
                                {[
                                    { title: "Register Now! India Innovates 2026", sub: "Hackathons", color: "bg-blue-50" },
                                    { title: "Grow Beyond Better is LIVE!", sub: "Grab PPIs with Tata Consumer...", color: "bg-green-50" },
                                    { title: "Unstop Weekend Internship", sub: "Job", color: "bg-purple-50" },
                                    { title: "H&S Brand Champion Challenge", sub: "Competition", color: "bg-rose-50" },
                                    { title: "One-Day Internship with Shark Tank", sub: "College Fest", color: "bg-amber-50" },
                                    { title: "Virtual Webinar on April 10", sub: "Workshops", color: "bg-indigo-50" }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 p-3.5 bg-white rounded-2xl hover:shadow-md transition-all cursor-pointer group border border-transparent hover:border-primary/10">
                                        <div className={cn("w-11 h-11 shrink-0 rounded-xl flex items-center justify-center font-black text-slate-400 text-sm font-sans", item.color)}>
                                            {item.title[0]}
                                        </div>
                                        <div className="space-y-0.5">
                                            <h4 className="text-[13px] font-extrabold text-[#383838] leading-snug group-hover:text-primary transition-colors line-clamp-2 font-sans">
                                                {item.title}
                                            </h4>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-sans">{item.sub}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
