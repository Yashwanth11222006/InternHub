'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    MapPin,
    Globe,
    Clock,
    Heart,
    ChevronDown,
    ArrowRight,
    Wallet,
    Users,
    Building2,
    X,
} from 'lucide-react';
import { internships as mockInternships } from '@/lib/mockData';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { NeonGradientCard } from '@/components/ui/neon-gradient-card';

// ── Internship Card ──
const InternshipCard = ({ internship, mounted, index }: { internship: any; mounted: boolean; index: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
    >
        <Link href={`/internships/${internship.id}`} className="block group">
            <div className="bg-[#f5f0e8] rounded-2xl border border-black/10 shadow-sm hover:shadow-md transition-shadow duration-300 p-5 md:p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 pr-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-black border border-black/10">
                                {internship.location === 'Remote' ? 'Remote' : 'On-site'}
                            </span>
                            {internship.stipend && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-black border border-black/10">
                                    {internship.stipend}
                                </span>
                            )}
                        </div>
                        <h3 className="text-lg font-extrabold text-black leading-snug group-hover:text-blue-600 transition-colors duration-300 mb-1">
                            {internship.title}
                        </h3>
                        <p className="text-sm font-semibold text-black/70">{internship.company}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl border border-black/10 flex items-center justify-center shrink-0 group-hover:border-blue-400 transition-colors duration-300">
                        <span className="text-lg font-black text-black uppercase">{internship.company?.[0] || 'I'}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 py-3 border-t border-black/5">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-black/40" />
                        <div>
                            <p className="text-[10px] uppercase font-bold text-black/40 tracking-wider">Duration</p>
                            <p className="text-xs font-bold text-black">{internship.duration}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-black/40" />
                        <div>
                            <p className="text-[10px] uppercase font-bold text-black/40 tracking-wider">Location</p>
                            <p className="text-xs font-bold text-black">{internship.location}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-black/40" />
                        <div>
                            <p className="text-[10px] uppercase font-bold text-black/40 tracking-wider">Applicants</p>
                            <p className="text-xs font-bold text-black">{internship.applicantCount || 0}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-black/40" />
                        <div>
                            <p className="text-[10px] uppercase font-bold text-black/40 tracking-wider">Stipend</p>
                            <p className="text-xs font-bold text-black">{internship.stipend}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                        {internship.skills?.slice(0, 3).map((skill: string) => (
                            <span key={skill} className="px-3 py-1 rounded-full text-[10px] font-bold text-black uppercase tracking-wider border border-black/10">
                                {skill}
                            </span>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-black/40 uppercase tracking-wider hidden sm:inline">
                            {mounted && internship.deadline ? `Apply by ${new Date(internship.deadline).toLocaleDateString()}` : ''}
                        </span>
                        <button className="w-9 h-9 rounded-xl border border-black/10 hover:border-red-300 flex items-center justify-center text-black/40 hover:text-red-500 transition-all duration-300 hover:scale-110">
                            <Heart className="w-4 h-4" />
                        </button>
                        <span className="hidden sm:inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all duration-300 hover:-translate-y-0.5">
                            View <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-300" />
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    </motion.div>
);

// ── Filter Chip ──
const FilterChip = ({
    label,
    icon: Icon,
    active,
    onClick,
}: {
    label: string;
    icon?: any;
    active?: boolean;
    onClick?: () => void;
}) => (
    <button
        onClick={onClick}
        className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all border cursor-pointer',
            active
                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
                : 'bg-white text-black border-black/10 hover:border-blue-400 hover:text-blue-600'
        )}
    >
        {Icon && <Icon className="w-3.5 h-3.5" />}
        {label}
    </button>
);

export default function StudentHome() {
    const [searchQuery, setSearchQuery] = useState('');
    const [internships, setInternships] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [activeFilters, setActiveFilters] = useState<string[]>([]);

    const toggleFilter = (filter: string) => {
        setActiveFilters((prev) =>
            prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
        );
    };

    useEffect(() => {
        setMounted(true);
        const fetchInternships = async () => {
            setLoading(true);
            try {
                // Use API to fetch internships with company names
                const rawInternships = await api.internships.getAll();

                let finalInternships = [];

                if (rawInternships && rawInternships.length > 0) {
                    finalInternships = rawInternships.map((i) => ({
                        ...i,
                        company: i.company || 'Individual Recruiter',
                        applicantCount: i.applicant_count || 0,
                        skills: i.skills_required || [],
                        posted_date: i.created_at,
                        duration: i.duration || 'Flexible',
                        stipend: i.stipend || 'Competitive',
                        location: i.location || 'Remote',
                    }));
                } else {
                    finalInternships = mockInternships.map((i) => ({
                        ...i,
                        skills: i.skills || [],
                        applicantCount: i.applicantCount || 0,
                        posted_date: i.postedDate ? new Date(i.postedDate).toISOString() : new Date().toISOString(),
                    }));
                }
                setInternships(finalInternships);
            } catch (error: any) {
                console.error('Error in fetchInternships:', error.message);
                setInternships(mockInternships as any);
            } finally {
                setLoading(false);
            }
        };

        fetchInternships();
    }, []);

    // Filter logic
    const filteredInternships = internships.filter((i) => {
        const matchesSearch =
            (i.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (i.company?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (i.skills || []).some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()));

        if (activeFilters.length === 0) return matchesSearch;

        const matchesFilters =
            (activeFilters.includes('Remote') && i.location === 'Remote') ||
            (activeFilters.includes('On-site') && i.location !== 'Remote') ||
            (activeFilters.includes('Paid') && i.stipend && i.stipend !== 'Unpaid' && i.stipend !== '₹0');

        return matchesSearch && matchesFilters;
    });

    return (
        <div className="min-h-screen bg-[#f5f0e8]">
            {/* ── Hero Section (centered content) ── */}
            <section
                className="relative w-full min-h-[480px] flex items-center justify-center overflow-hidden -mt-4 md:-mt-8"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2000')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

                {/* Content - centered */}
                <div className="relative z-10 w-full max-w-5xl mx-auto px-4 flex flex-col items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="flex flex-col items-center justify-center w-full"
                    >
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mb-3 text-center">
                            Discover your{' '}
                            <span className="text-blue-400">dream internship.</span>
                        </h1>
                        <h2 className="text-5xl font-extrabold text-center mb-6 mt-2">
                            <span
                                style={{
                                    color: '#ff00aa',
                                    textShadow: '0 0 16px #ff00aa, 0 0 32px #00FFF1, 0 0 48px #ff00aa',
                                    filter: 'drop-shadow(0 0 8px #00FFF1)',
                                }}
                            >
                                Experience.
                            </span>
                        </h2>
                        <p className="text-base md:text-lg text-white/70 font-medium mb-8 max-w-xl text-center">
                            Search verified opportunities, apply instantly, and kickstart your career with the right company.
                        </p>

                        {/* Search Bar */}
                        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex items-center p-1.5 border border-slate-200 mx-auto">
                            <div className="pl-4 text-slate-400">
                                <Search className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by role, company, or skill..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 h-12 px-4 bg-transparent text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-none"
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')} className="p-2 text-slate-400 hover:text-slate-600 cursor-pointer">
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                            <button className="h-11 px-8 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer">
                                <Search className="w-4 h-4" />
                                Search
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── Filter Chips (below hero) ── */}
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-6">
                <div className="flex flex-wrap items-center gap-2">
                    <FilterChip label="All" active={activeFilters.length === 0} onClick={() => setActiveFilters([])} />
                    <FilterChip label="Remote" icon={Globe} active={activeFilters.includes('Remote')} onClick={() => toggleFilter('Remote')} />
                    <FilterChip label="On-site" icon={Building2} active={activeFilters.includes('On-site')} onClick={() => toggleFilter('On-site')} />
                    <FilterChip label="Paid" icon={Wallet} active={activeFilters.includes('Paid')} onClick={() => toggleFilter('Paid')} />
                </div>
            </div>

            {/* ── Main Content ── */}
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Panel: Recommended */}
                    <aside className="lg:col-span-3 order-2 lg:order-1">
                        <div className="sticky top-28 space-y-6">
                            {/* Recommended */}
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                                <div className="bg-[#f5f0e8] rounded-2xl border border-black/10 shadow-sm p-5 md:p-6">
                                    <h2 className="text-base font-extrabold text-black mb-5">
                                        Recommended for you
                                    </h2>
                                    <div className="space-y-4">
                                        {internships.slice(0, 4).map((item, i) => (
                                            <Link key={item.id || i} href={`/internships/${item.id}`} className="block group">
                                                <div className="flex gap-3 p-3 rounded-xl transition-colors duration-300">
                                                    <div className="w-10 h-10 rounded-lg border border-black/10 flex items-center justify-center shrink-0 group-hover:border-blue-400 transition-colors duration-300">
                                                        <span className="text-sm font-black text-black">{item.company?.[0] || 'I'}</span>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h4 className="text-sm font-bold text-black leading-snug truncate group-hover:text-blue-600 transition-colors duration-300">
                                                            {item.title}
                                                        </h4>
                                                        <p className="text-xs text-black/70 font-medium truncate">{item.company}</p>
                                                        <p className="text-[10px] text-black/50 font-bold mt-0.5">{item.stipend}</p>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Trending */}
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                                <div className="bg-[#f5f0e8] rounded-2xl border border-black/10 shadow-sm p-5 md:p-6">
                                    <h2 className="text-base font-extrabold text-black mb-5">
                                        Trending Now
                                    </h2>
                                    <div className="space-y-3">
                                        {[
                                            { title: 'India Innovates Hackathon 2026', tag: 'Tech', sub: 'Competition' },
                                            { title: 'Global Design Challenge by Adobe', tag: 'Design', sub: 'Challenge' },
                                            { title: 'Unstop Weekend Internship', tag: 'Hot', sub: 'Internship' },
                                        ].map((item, i) => (
                                            <div key={i} className="group flex gap-3 p-3 rounded-xl transition-colors duration-300 cursor-pointer">
                                                <div className="w-9 h-9 rounded-lg border border-black/10 flex items-center justify-center font-black text-black text-xs shrink-0 group-hover:border-blue-400 transition-colors duration-300">
                                                    {item.title[0]}
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-black leading-snug group-hover:text-blue-600 transition-colors duration-300">{item.title}</h4>
                                                    <div className="flex items-center gap-1.5 mt-0.5">
                                                        <span className="text-[10px] font-bold text-black/40 uppercase tracking-wider">{item.sub}</span>
                                                        <span className="w-1 h-1 rounded-full bg-black/20" />
                                                        <span className="text-[10px] font-bold text-black/40 uppercase tracking-wider">{item.tag}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Quick Stats */}
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                                <div className="bg-[#f5f0e8] rounded-2xl border border-black/10 shadow-sm p-5 md:p-6">
                                    <h3 className="text-sm font-bold text-black mb-4">
                                        Quick Stats
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-2xl font-black text-black">{internships.length}</p>
                                            <p className="text-[10px] font-bold text-black/40 uppercase tracking-wider">Open Roles</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-black text-black">{internships.filter((i) => i.location === 'Remote').length}</p>
                                            <p className="text-[10px] font-bold text-black/40 uppercase tracking-wider">Remote</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </aside>

                    {/* Right: Listings */}
                    <div className="lg:col-span-9 order-1 lg:order-2">
                        {/* Results Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-extrabold text-black">
                                    {searchQuery ? `Results for "${searchQuery}"` : 'Latest Internships'}
                                </h2>
                                <p className="text-sm text-black/50 font-medium mt-0.5">
                                    {filteredInternships.length} {filteredInternships.length === 1 ? 'opportunity' : 'opportunities'} found
                                </p>
                            </div>
                            <div className="hidden md:flex items-center gap-2 text-xs font-bold text-black/50">
                                Sort by: <span className="text-black">Newest First</span>
                                <ChevronDown className="w-3.5 h-3.5 text-black/40" />
                            </div>
                        </div>

                        {/* Listing Cards */}
                        {loading ? (
                            <div className="space-y-5">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="h-48 bg-white rounded-2xl animate-pulse border border-black/5" />
                                ))}
                            </div>
                        ) : filteredInternships.length > 0 ? (
                            <div className="space-y-5">
                                {filteredInternships.map((internship, index) => (
                                    <InternshipCard key={internship.id} internship={internship} mounted={mounted} index={index} />
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-black/10">
                                <Search className="w-12 h-12 text-black/20 mx-auto mb-4" />
                                <h3 className="text-2xl font-extrabold text-black mb-2">No roles found.</h3>
                                <p className="text-black/50 font-medium">Try adjusting your search or filters.</p>
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setActiveFilters([]);
                                    }}
                                    className="mt-4 px-6 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors cursor-pointer"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
