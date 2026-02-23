'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { api, Internship } from '@/lib/api';
import { Plus, Edit2, Users, Clock, MapPin, Wallet, Calendar, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InternshipWithCount extends Internship {
    applicantCount: number;
}

export default function RecruiterInternshipsPage() {
    const [internships, setInternships] = useState<InternshipWithCount[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyInternships = async () => {
            setLoading(true);
            try {
                const data = await api.recruiter.getMyInternships();
                const processed = data.map(i => ({
                    ...i,
                    applicantCount: i.applicant_count || 0
                }));
                setInternships(processed);
            } catch (error: any) {
                console.error('Error fetching my internships:', error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMyInternships();
    }, []);

    if (loading) {
        return (
            <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-32 bg-white rounded-3xl border border-slate-100" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-slide-up pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-black tracking-tight font-sans">My Internship Listings</h1>
                    <p className="text-sm font-bold text-black/60 mt-1 uppercase tracking-widest">Manage and track your active roles</p>
                </div>
                <Link href="/recruiter/internships/new">
                    <Button variant="primary" size="lg" className="rounded-2xl h-14 px-8 font-black shadow-xl shadow-primary/20">
                        <Plus className="w-5 h-5 mr-2" />
                        Create New Listing
                    </Button>
                </Link>
            </div>

            {internships.length === 0 ? (
                <Card className="p-20 text-center border-dashed border-2 bg-slate-50/50 rounded-[40px]">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <AlertCircle className="w-8 h-8 text-black/30" />
                    </div>
                    <h3 className="text-xl font-black text-black mb-2">No internships found</h3>
                    <p className="text-black/60 font-bold mb-8">You haven't posted any internships yet.</p>
                    <Link href="/recruiter/internships/new">
                        <Button variant="primary" className="rounded-xl px-8 font-black">Get Started</Button>
                    </Link>
                </Card>
            ) : (
                <div className="grid gap-5">
                    {internships.map((internship) => (
                        <Card key={internship.id} className="p-6 border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-500 rounded-[32px] bg-white border-b-4 hover:border-b-primary">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-xl font-black text-black tracking-tight font-sans">{internship.title}</h3>
                                        <span className={cn(
                                            "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg",
                                            internship.status === 'open'
                                                ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                                : "bg-rose-50 text-rose-600 border border-rose-100"
                                        )}>
                                            {internship.status}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                                        <div className="flex items-center gap-2 text-black/60 font-bold text-sm">
                                            <Clock className="w-4 h-4" />
                                            {internship.duration || 'Flexible'}
                                        </div>
                                        <div className="flex items-center gap-2 text-black/60 font-bold text-sm">
                                            <MapPin className="w-4 h-4" />
                                            {internship.location || 'Remote'}
                                        </div>
                                        <div className="flex items-center gap-2 text-black/60 font-bold text-sm">
                                            <Wallet className="w-4 h-4" />
                                            {internship.stipend || 'Competitive'}
                                        </div>
                                        <div className="flex items-center gap-2 text-black/60 font-bold text-sm">
                                            <Calendar className="w-4 h-4" />
                                            Deadline: {internship.deadline ? new Date(internship.deadline).toLocaleDateString() : 'TBD'}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {(internship.skills_required || []).slice(0, 5).map((skill: string) => (
                                            <span key={skill} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[11px] font-black text-black/60 uppercase tracking-tight">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 lg:pl-6 border-slate-100">
                                    <Button
                                        variant="ghost"
                                        size="lg"
                                        className="h-14 w-14 p-0 rounded-2xl bg-rose-50/50 text-rose-600 hover:bg-rose-100 border border-rose-100 shadow-sm"
                                        onClick={async () => {
                                            if (window.confirm('Delete this listing?')) {
                                                try {
                                                    const { error } = await supabase.from('internships').delete().eq('id', internship.id);
                                                    if (error) throw error;
                                                    setInternships(prev => prev.filter(i => i.id !== internship.id));
                                                } catch (err: any) {
                                                    alert('Error deleting');
                                                }
                                            }
                                        }}
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </Button>
                                    <Link href={`/recruiter/internships/${internship.id}/edit`}>
                                        <Button variant="ghost" size="lg" className="h-14 w-14 p-0 rounded-2xl hover:bg-slate-50 hover:text-primary border border-slate-100">
                                            <Edit2 className="w-5 h-5" />
                                        </Button>
                                    </Link>
                                    <Link href={`/recruiter/internships/${internship.id}/applicants`}>
                                        <Button variant="primary" size="lg" className="h-14 px-8 rounded-2xl font-black shadow-lg shadow-primary/10">
                                            <Users className="w-5 h-5 mr-3" />
                                            {internship.applicantCount} Applicants
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
