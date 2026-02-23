'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Briefcase,
    Edit3,
    Users,
    Power,
    Calendar,
    ChevronRight,
    Plus,
    Filter,
    Loader2,
    AlertCircle,
    Trash2
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { api, Internship } from '@/lib/api';
import Link from 'next/link';
import { useToast } from '@/components/ui/Toast';

interface InternshipWithCount extends Internship {
    applicantCount: number;
}

export default function ManageInternshipsPage() {
    const [internships, setInternships] = useState<InternshipWithCount[]>([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

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
            showToast('Failed to load internships', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyInternships();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this listing?')) return;

        try {
            await api.internships.delete(id);
            showToast('Internship deleted successfully', 'success');
            setInternships(prev => prev.filter(i => i.id !== id));
        } catch (error: any) {
            showToast('Failed to delete internship', 'error');
        }
    };

    const toggleStatus = async (id: string, currentStatus: string) => {
        const nextStatus = currentStatus === 'open' ? 'closed' : 'open';
        try {
            await api.internships.update(id, { status: nextStatus as 'open' | 'closed' });
            showToast(`Internship ${nextStatus === 'open' ? 'opened' : 'closed'} successfully`, 'success');
            setInternships(prev => prev.map(i => i.id === id ? { ...i, status: nextStatus as 'open' | 'closed' } : i));
        } catch (error: any) {
            showToast('Failed to update status', 'error');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="font-black text-black/60 uppercase tracking-widest text-xs">Loading Listings...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-slide-up pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-black tracking-tight font-sans">Manage Listings</h1>
                    <p className="text-black/60 mt-2 font-bold uppercase tracking-widest text-xs">Review, edit, or close your published opportunities.</p>
                </div>
                <Link href="/recruiter/internships/new">
                    <Button variant="primary" className="rounded-2xl px-8 h-14 font-black shadow-xl shadow-primary/20">
                        <Plus className="w-5 h-5 mr-2" /> New Listing
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
                </Card>
            ) : (
                <div className="grid gap-6">
                    {internships.map((internship) => (
                        <Card key={internship.id} className="p-0 border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-500 rounded-[40px] bg-white overflow-hidden group border-b-4 hover:border-b-primary">
                            <div className="flex flex-col lg:flex-row">
                                <div className="flex-1 p-8">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Badge
                                            variant={internship.status === 'open' ? 'success' : 'secondary'}
                                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${internship.status === 'open' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                                                }`}
                                        >
                                            {internship.status}
                                        </Badge>
                                        <span className="text-[10px] font-black text-black/60 uppercase tracking-widest flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5" /> Published {new Date(internship.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="text-3xl font-black text-black mb-4 group-hover:text-primary transition-colors tracking-tight font-sans leading-none">{internship.title}</h3>
                                    <div className="flex flex-wrap gap-8 mt-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                                                <Users className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-black/60 uppercase tracking-widest leading-none mb-1">Applicants</p>
                                                <p className="text-xl font-black text-black leading-none">{internship.applicantCount}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
                                                <Calendar className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-black/60 uppercase tracking-widest leading-none mb-1">Deadline</p>
                                                <p className="text-xl font-black text-black leading-none">{new Date(internship.deadline).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-50/50 lg:w-80 p-8 flex flex-col justify-center gap-4 border-t lg:border-t-0 lg:border-l border-slate-100">
                                    <Link href={`/recruiter/internships/${internship.id}/applicants`}>
                                        <Button variant="primary" className="w-full rounded-2xl h-14 font-black shadow-lg shadow-primary/10">
                                            <Users className="w-4 h-4 mr-2" /> View Applicants
                                        </Button>
                                    </Link>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link href={`/recruiter/internships/${internship.id}/edit`}>
                                            <Button variant="outline" className="w-full rounded-xl h-12 font-black border-2 border-slate-100 hover:border-primary/20 hover:text-primary bg-white">
                                                <Edit3 className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            className="rounded-xl h-12 font-black border-2 border-slate-100 hover:border-rose-100 hover:text-rose-600 hover:bg-rose-50 bg-white"
                                            onClick={() => toggleStatus(internship.id, internship.status)}
                                        >
                                            <Power className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        className="w-full h-12 rounded-xl font-black text-black/60 hover:text-rose-600 hover:bg-rose-50"
                                        onClick={() => handleDelete(internship.id)}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" /> Delete Listing
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
