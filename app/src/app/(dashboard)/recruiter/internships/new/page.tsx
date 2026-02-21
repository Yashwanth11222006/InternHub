'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import InputField from '@/components/ui/InputField';
import TextArea from '@/components/ui/TextArea';
import TagInput from '@/components/ui/TagInput';
import { useToast } from '@/components/ui/Toast';
import { supabase } from '@/lib/supabase';
import { Send, ChevronLeft, Sparkles, Briefcase, Target, FileText, Calendar } from 'lucide-react';

export default function CreateInternshipPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [duration, setDuration] = useState('');
    const [location, setLocation] = useState('');
    const [stipend, setStipend] = useState('');
    const [skills, setSkills] = useState<string[]>([]);
    const [eligibility, setEligibility] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                showToast('You must be logged in to post an internship', 'error');
                return;
            }

            const { error } = await supabase.from('internships').insert([{
                recruiter_id: user.id,
                title,
                duration,
                location,
                stipend,
                skills_required: skills,
                eligibility,
                description,
                deadline,
                status: 'open'
            }]);

            if (error) throw error;

            showToast('Internship published successfully!', 'success');
            router.push('/recruiter/internships');
        } catch (error: any) {
            console.error('Error publishing internship:', error.message);
            showToast(error.message || 'Failed to publish internship', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto animate-slide-up pb-24">
            <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-xl" onClick={() => router.back()}>
                    <ChevronLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-3xl font-black text-[#383838] tracking-tight font-sans">New Internship</h1>
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
                            placeholder="e.g. Frontend Developer Intern"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="rounded-xl border-slate-200"
                        />
                        <div className="grid sm:grid-cols-2 gap-4">
                            <InputField
                                label="Duration"
                                placeholder="e.g. 3 months"
                                required
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                className="rounded-xl border-slate-200"
                            />
                            <InputField
                                label="Location"
                                placeholder="e.g. Remote / Bangalore"
                                required
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="rounded-xl border-slate-200"
                            />
                        </div>
                        <InputField
                            label="Stipend"
                            placeholder="e.g. ₹25,000/month"
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
                            placeholder="Type a skill and press Enter..."
                        />
                        <InputField
                            label="Eligibility"
                            placeholder="e.g. CS/IT students, pre-final or final year"
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
                        placeholder="Describe the role, responsibilities, what the intern will learn..."
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
                <div className="flex gap-4 pt-4">
                    <Button type="button" variant="ghost" className="h-14 px-8 rounded-2xl font-black text-slate-400 hover:text-slate-600" onClick={() => router.back()}>
                        Discard
                    </Button>
                    <Button type="submit" variant="primary" size="lg" loading={loading} className="flex-1 h-14 rounded-2xl font-black shadow-xl shadow-primary/20">
                        <Send className="w-5 h-5 mr-3" />
                        {loading ? 'Publishing...' : 'Publish Internship'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
