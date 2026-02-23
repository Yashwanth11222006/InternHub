'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Briefcase,
    MapPin,
    Banknote,
    Clock,
    Code,
    Target,
    FileText,
    Calendar,
    Send,
    CheckCircle2
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import InputField from '@/components/ui/InputField';
import TextArea from '@/components/ui/TextArea';
import TagInput from '@/components/ui/TagInput';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function CreateInternshipPage() {
    const router = useRouter();
    const [skills, setSkills] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Form states
    const [title, setTitle] = useState('');
    const [duration, setDuration] = useState('');
    const [location, setLocation] = useState('');
    const [stipend, setStipend] = useState('');
    const [eligibility, setEligibility] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            await api.internships.create({
                title,
                duration,
                location,
                stipend,
                eligibility,
                description,
                deadline: deadline || undefined,
                skills_required: skills,
            });

            router.push('/recruiter/dashboard');
        } catch (err: any) {
            setError(err.message || 'Error creating internship');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20">
            <div className="text-center md:text-left">
                <h1 className="text-4xl font-black text-black tracking-tight">Create New Internship</h1>
                <p className="text-black/60 mt-2 font-medium italic">Reach qualified talent by providing clear and detailed information.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
                {error && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                        {error}
                    </div>
                )}
                {/* ── Basic Info ── */}
                <Card className="p-10 border-none shadow-sm bg-white rounded-[40px] space-y-8">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-black text-black uppercase tracking-widest text-sm">Basic Information</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <InputField
                            label="Internship Title"
                            placeholder="e.g. Frontend Engineering Intern"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <InputField
                            label="Duration"
                            placeholder="e.g. 6 Months"
                            icon={<Clock className="w-4 h-4" />}
                            required
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                        />
                        <InputField
                            label="Location"
                            placeholder="e.g. Remote / Bangalore, India"
                            icon={<MapPin className="w-4 h-4" />}
                            required
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                        <InputField
                            label="Stipend Range"
                            placeholder="e.g. ₹25,000 - ₹30,000 / month"
                            icon={<Banknote className="w-4 h-4" />}
                            required
                            value={stipend}
                            onChange={(e) => setStipend(e.target.value)}
                        />
                    </div>
                </Card>

                {/* ── Requirements ── */}
                <Card className="p-10 border-none shadow-sm bg-white rounded-[40px] space-y-8">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                            <Target className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-black text-black uppercase tracking-widest text-sm">Requirements & Skills</h2>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <label className="text-sm font-black text-black uppercase tracking-[0.1em] mb-3 block">Technical Skills</label>
                            <TagInput
                                tags={skills}
                                onChange={setSkills}
                                placeholder="Add skill and press Enter (e.g. React, Docker...)"
                            />
                        </div>
                        <InputField
                            label="Eligibility Criteria"
                            placeholder="e.g. Final year B.Tech students only"
                            value={eligibility}
                            onChange={(e) => setEligibility(e.target.value)}
                        />
                    </div>
                </Card>

                {/* ── Description ── */}
                <Card className="p-10 border-none shadow-sm bg-white rounded-[40px] space-y-8">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                            <FileText className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-black text-black uppercase tracking-widest text-sm">Detailed Description</h2>
                    </div>

                    <TextArea
                        label="About the Role"
                        placeholder="Describe key responsibilities, daily tasks, and company culture..."
                        rows={8}
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Card>

                {/* ── Deadline ── */}
                <Card className="p-10 border-none shadow-sm bg-white rounded-[40px] space-y-8">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-black text-black uppercase tracking-widest text-sm">Application Deadline</h2>
                    </div>

                    <div className="max-w-xs">
                        <InputField
                            type="date"
                            label="Last Date to Apply"
                            required
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                        />
                    </div>
                </Card>

                {/* ── Submit ── */}
                <div className="flex items-center gap-4 pt-4">
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="flex-1 h-14 rounded-[20px] font-black text-lg shadow-2xl shadow-primary/20"
                        loading={isSubmitting}
                    >
                        {!isSubmitting && <Send className="w-5 h-5 mr-3" />}
                        {isSubmitting ? 'Publishing...' : 'Publish Internship Listing'}
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="lg"
                        className="h-14 px-8 rounded-[20px] font-black hover:bg-white border-2 border-transparent hover:border-muted transition-all"
                        onClick={() => router.back()}
                    >
                        Save Draft
                    </Button>
                </div>
            </form>
        </div>
    );
}
