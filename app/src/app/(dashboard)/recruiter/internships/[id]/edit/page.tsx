'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import InputField from '@/components/ui/InputField';
import TextArea from '@/components/ui/TextArea';
import TagInput from '@/components/ui/TagInput';
import { useToast } from '@/components/ui/Toast';
import { supabase } from '@/lib/supabase';
import { Save, ChevronLeft, Briefcase, Target, FileText, Calendar, Loader2, Power } from 'lucide-react';

export default function EditInternshipPage() {
    const params = useParams();
    const router = useRouter();
    const { showToast } = useToast();
    const id = params.id as string;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    // Form State
    const [title, setTitle] = useState('');
    const [duration, setDuration] = useState('');
    const [location, setLocation] = useState('');
    const [stipend, setStipend] = useState('');
    const [skills, setSkills] = useState<string[]>([]);
    const [eligibility, setEligibility] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const [status, setStatus] = useState<'open' | 'closed'>('open');

    useEffect(() => {
        const fetchInternship = async () => {
            try {
                const { data, error } = await supabase
                    .from('internships')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;

                if (data) {
                    setTitle(data.title || '');
                    setDuration(data.duration || '');
                    setLocation(data.location || '');
                    setStipend(data.stipend || '');
                    setSkills(data.skills_required || []);
                    setEligibility(data.eligibility || '');
                    setDescription(data.description || '');
                    setDeadline(data.deadline || '');
                    setStatus(data.status || 'open');
                }
            } catch (error: any) {
                console.error('Error fetching internship:', error.message);
                showToast('Failed to load internship data', 'error');
            } finally {
                setFetching(false);
            }
        };

        if (id) fetchInternship();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from('internships')
                .update({
                    title,
                    duration,
                    location,
                    stipend,
                    skills_required: skills,
                    eligibility,
                    description,
                    deadline,
                    status
                })
                .eq('id', id);

            if (error) throw error;

            showToast('Changes saved successfully!', 'success');
            router.push('/recruiter/internships');
        } catch (error: any) {
            console.error('Error updating internship:', error.message);
            showToast(error.message || 'Failed to update internship', 'error');
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async () => {
        const nextStatus = status === 'open' ? 'closed' : 'open';
        setLoading(true);
        try {
            const { error } = await supabase
                .from('internships')
                .update({ status: nextStatus })
                .eq('id', id);

            if (error) throw error;
            setStatus(nextStatus);
            showToast(`Internship ${nextStatus === 'open' ? 'reopened' : 'closed'} successfully!`, 'success');
        } catch (error: any) {
            showToast('Failed to update status', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Loading Details...</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto animate-slide-up pb-24">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-xl" onClick={() => router.back()}>
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-3xl font-black text-[#383838] tracking-tight font-sans">Edit Listing</h1>
                </div>

                <Button
                    type="button"
                    variant={status === 'open' ? 'secondary' : 'primary'}
                    onClick={toggleStatus}
                    className="rounded-2xl h-12 px-6 font-black font-sans uppercase tracking-widest text-[11px]"
                    disabled={loading}
                >
                    <Power className="w-4 h-4 mr-2" />
                    {status === 'open' ? 'Suspend Listing' : 'Reactivate Listing'}
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* ── Basic Info ── */}
                <Card className="p-8 rounded-[32px] border-none shadow-sm bg-white">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <Briefcase className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-black text-[#383838] tracking-tight">Basic Information</h2>
                    </div>

                    <div className="grid gap-6">
                        <InputField
                            label="Internship Title"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="rounded-xl border-slate-200"
                        />
                        <div className="grid sm:grid-cols-2 gap-4">
                            <InputField
                                label="Duration"
                                required
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                className="rounded-xl border-slate-200"
                            />
                            <InputField
                                label="Location"
                                required
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="rounded-xl border-slate-200"
                            />
                        </div>
                        <InputField
                            label="Stipend"
                            required
                            value={stipend}
                            onChange={(e) => setStipend(e.target.value)}
                            className="rounded-xl border-slate-200"
                        />
                    </div>
                </Card>

                {/* ── Requirements ── */}
                <Card className="p-8 rounded-[32px] border-none shadow-sm bg-white">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
                            <Target className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-black text-[#383838] tracking-tight">Requirements</h2>
                    </div>

                    <div className="grid gap-6">
                        <TagInput
                            label="Required Skills"
                            tags={skills}
                            onChange={setSkills}
                        />
                        <InputField
                            label="Eligibility"
                            value={eligibility}
                            onChange={(e) => setEligibility(e.target.value)}
                            className="rounded-xl border-slate-200"
                        />
                    </div>
                </Card>

                {/* ── Description ── */}
                <Card className="p-8 rounded-[32px] border-none shadow-sm bg-white">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
                            <FileText className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-black text-[#383838] tracking-tight">Role Description</h2>
                    </div>

                    <TextArea
                        label="Internship Description"
                        rows={8}
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="rounded-2xl border-slate-200"
                    />
                </Card>

                {/* ── Deadline ── */}
                <Card className="p-8 rounded-[32px] border-none shadow-sm bg-white">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-black text-[#383838] tracking-tight">Application Deadline</h2>
                    </div>

                    <InputField
                        label="Deadline Date"
                        type="date"
                        required
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="rounded-xl border-slate-200"
                    />
                </Card>

                {/* ── Actions ── */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                        type="button"
                        variant="danger"
                        className="h-14 px-8 rounded-2xl font-black bg-rose-50 text-rose-600 hover:bg-rose-100 border-none shadow-sm"
                        onClick={async () => {
                            if (window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
                                try {
                                    setLoading(true);
                                    const { error } = await supabase.from('internships').delete().eq('id', id);
                                    if (error) throw error;
                                    showToast('Internship deleted successfully', 'success');
                                    router.push('/recruiter/internships');
                                } catch (err: any) {
                                    showToast('Failed to delete internship', 'error');
                                } finally {
                                    setLoading(false);
                                }
                            }
                        }}
                        disabled={loading}
                    >
                        Delete Listing
                    </Button>
                    <div className="flex-1 flex gap-4">
                        <Button type="button" variant="ghost" className="flex-1 h-14 rounded-2xl font-black text-slate-400 hover:text-slate-600" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" size="lg" loading={loading} className="flex-[2] h-14 rounded-2xl font-black shadow-xl shadow-primary/20">
                            <Save className="w-5 h-5 mr-3" />
                            {loading ? 'Saving Changes...' : 'Save All Changes'}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
