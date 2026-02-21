'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/Dialog';
import { User, Mail, GraduationCap, FileText, ExternalLink, Calendar, Search, ChevronLeft, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

export default function ApplicantsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [internship, setInternship] = useState<any>(null);
    const [applicantsData, setApplicantsData] = useState<any[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [selectedApplicantId, setSelectedApplicantId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    useEffect(() => {
        const fetchApplicants = async () => {
            setLoading(true);
            try {
                // 1. Fetch Internship Title
                const { data: job } = await supabase
                    .from('internships')
                    .select('title')
                    .eq('id', id)
                    .single();
                setInternship(job);

                // 2. Fetch Applications with Student Info
                const { data: apps, error } = await supabase
                    .from('applications')
                    .select(`
                        *,
                        user:users (
                            email,
                            student_profile:student_profiles (*)
                        )
                    `)
                    .eq('internship_id', id)
                    .order('applied_at', { ascending: false });

                if (error) throw error;

                // Flatten data for easier use
                const flattened = apps.map(app => {
                    const studentProfile = (app.user as any)?.student_profile || null;
                    return {
                        id: app.id,
                        name: studentProfile?.full_name || 'Unknown',
                        email: (app.user as any)?.email,
                        university: studentProfile?.university || 'Not Provided',
                        skills: studentProfile?.skills || [],
                        appliedDate: new Date(app.applied_at).toLocaleDateString(),
                        status: app.status,
                        coverLetter: app.cover_letter,
                        resumeUrl: studentProfile?.resume_url
                    };
                });

                setApplicantsData(flattened);
            } catch (err: any) {
                console.error('Error fetching applicants:', err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchApplicants();
    }, [id]);

    const handleStatusUpdate = async (appId: string, newStatus: string) => {
        setUpdatingStatus(true);
        try {
            const { error } = await supabase
                .from('applications')
                .update({ status: newStatus.toLowerCase() })
                .eq('id', appId);

            if (error) throw error;

            // Update local state
            setApplicantsData(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus.toLowerCase() } : a));
            setSelectedApplicantId(null);
        } catch (err: any) {
            alert(err.message || 'Error updating status');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const filtered = statusFilter
        ? applicantsData.filter((a) => a.status.toLowerCase() === statusFilter.toLowerCase())
        : applicantsData;

    const applicant = applicantsData.find((a) => a.id === selectedApplicantId);

    if (loading) return <div className="p-20 text-center"><Loader2 className="w-10 h-10 animate-spin mx-auto text-primary" /></div>;

    return (
        <div className="space-y-10 animate-fade-in pb-20 pt-10 px-4 md:px-0">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
                <div>
                    <Button variant="ghost" className="mb-4 text-slate-500 hover:text-primary p-0 h-auto font-bold" onClick={() => router.back()}>
                        <ChevronLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                    </Button>
                    <h2 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
                        <Sparkles className="w-8 h-8 text-primary" />
                        Applicants for {internship?.title || 'Job'}
                    </h2>
                    <p className="text-muted-foreground mt-2 font-bold italic flex items-center gap-1.5 uppercase tracking-widest text-[10px]">
                        Reviewing {filtered.length} of {applicantsData.length} total candidates
                    </p>
                </div>
            </div>

            {/* ── Filter Pills ── */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide px-1">
                {['', 'pending', 'shortlisted', 'interview', 'offered', 'rejected'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={cn(
                            "px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border shrink-0 cursor-pointer shadow-sm",
                            statusFilter === status
                                ? 'bg-slate-900 text-white border-slate-900 shadow-xl'
                                : 'bg-white text-slate-500 border-slate-100 hover:border-primary/50 hover:text-primary'
                        )}
                    >
                        {status || 'All Candidates'}
                    </button>
                ))}
            </div>

            {/* ── Candidate Grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map((a) => (
                    <Card key={a.id} className="p-8 border-none shadow-sm hover:shadow-2xl transition-all rounded-[40px] bg-white flex flex-col group cursor-pointer" onClick={() => setSelectedApplicantId(a.id)}>
                        <div className="flex items-start justify-between mb-8">
                            <div className="flex gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 font-black text-xl group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                                    {a.name[0]}
                                </div>
                                <div className="pt-1">
                                    <p className="font-black text-foreground leading-none mb-1.5">{a.name}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{a.university}</p>
                                </div>
                            </div>
                            <StatusBadge status={a.status} />
                        </div>

                        <div className="flex flex-wrap gap-2 mb-8 flex-1">
                            {a.skills.slice(0, 3).map((s: string) => (
                                <Badge key={s} variant="secondary" className="px-3 py-1 bg-slate-50 text-slate-500 border-none text-[10px] font-bold rounded-lg uppercase tracking-tight">{s}</Badge>
                            ))}
                            {a.skills.length > 3 && <span className="text-[9px] font-black text-slate-300 uppercase self-center ml-1">+{a.skills.length - 3}</span>}
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                {a.appliedDate}
                            </span>
                            <div className="text-[10px] font-black text-primary uppercase tracking-widest group-hover:gap-2 flex items-center gap-1 transition-all">
                                Review <ExternalLink className="w-3 h-3" />
                            </div>
                        </div>
                    </Card>
                ))}

                {filtered.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-white rounded-[40px] border-4 border-dashed border-slate-50">
                        <User className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                        <h3 className="text-xl font-black text-slate-300">No candidates found</h3>
                    </div>
                )}
            </div>

            {/* ── Applicant Detail Dialog ── */}
            <Dialog open={!!selectedApplicantId} onOpenChange={(open) => !open && setSelectedApplicantId(null)}>
                <DialogContent className="max-w-2xl rounded-[40px] border-none shadow-2xl p-10 bg-white">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-black flex items-center gap-4 text-foreground mb-2">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                <User className="w-6 h-6" />
                            </div>
                            Candidate Profile
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 font-bold italic">
                            Review and manage application status for {applicant?.name}.
                        </DialogDescription>
                    </DialogHeader>

                    {applicant && (
                        <div className="space-y-8 pt-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Contact Information</p>
                                        <div className="space-y-3">
                                            <p className="text-xl font-black text-foreground">{applicant.name}</p>
                                            <p className="text-sm font-bold text-slate-600 flex items-center gap-3">
                                                <Mail className="w-4 h-4 text-primary" />
                                                {applicant.email}
                                            </p>
                                            <p className="text-sm font-bold text-slate-600 flex items-center gap-3">
                                                <GraduationCap className="w-4 h-4 text-primary" />
                                                {applicant.university}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Expertise</p>
                                        <div className="flex flex-wrap gap-2">
                                            {applicant.skills.map((s: string) => (
                                                <Badge key={s} variant="secondary" className="px-3 py-1 bg-slate-100 text-slate-700 border-none font-bold uppercase text-[9px] tracking-tight">{s}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Resume & Links</p>
                                        <div className="space-y-3">
                                            {applicant.resumeUrl ? (
                                                <a href={applicant.resumeUrl} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-between p-5 rounded-2xl bg-emerald-50 border border-emerald-100 hover:shadow-lg transition-all group">
                                                    <span className="flex items-center gap-3 text-emerald-700 font-black text-sm">
                                                        <FileText className="w-5 h-5" />
                                                        Access Resume
                                                    </span>
                                                    <ExternalLink className="w-4 h-4 text-emerald-300 group-hover:text-emerald-700 transition-colors" />
                                                </a>
                                            ) : (
                                                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 text-sm font-bold italic">
                                                    No resume link provided
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-5 bg-slate-900 rounded-[30px] text-white">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Application Date</p>
                                        <p className="text-lg font-black">{applicant.appliedDate}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Cover Letter / Pitch</p>
                                <div className="p-6 bg-slate-50 rounded-[30px] border border-slate-100">
                                    <p className="text-sm text-slate-600 font-medium leading-relaxed italic">
                                        &quot;{applicant.coverLetter || 'No cover letter provided.'}&quot;
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="flex-col sm:flex-row gap-4 pt-10">
                        <Button
                            variant="ghost"
                            className="h-14 px-8 rounded-2xl font-black text-slate-400 hover:text-slate-900 border border-slate-100"
                            onClick={() => setSelectedApplicantId(null)}
                        >
                            Back
                        </Button>
                        <div className="flex-1 flex gap-3">
                            <Button
                                variant="danger"
                                className="h-14 px-6 rounded-2xl border-none bg-rose-50 text-rose-600 hover:bg-rose-100 font-black text-[10px] uppercase tracking-widest flex-1"
                                onClick={() => handleStatusUpdate(applicant.id, 'rejected')}
                                disabled={updatingStatus}
                            >
                                Reject
                            </Button>
                            <Button
                                variant="secondary"
                                className="h-14 px-6 rounded-2xl border-none bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-black text-[10px] uppercase tracking-widest flex-1"
                                onClick={() => handleStatusUpdate(applicant.id, 'shortlisted')}
                                disabled={updatingStatus}
                            >
                                Shortlist
                            </Button>
                            <Button
                                variant="primary"
                                className="h-14 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 flex-[1.5]"
                                onClick={() => handleStatusUpdate(applicant.id, 'offered')}
                                disabled={updatingStatus}
                            >
                                {updatingStatus ? 'Updating...' : 'Approve & Hire'}
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

