'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import TextArea from '@/components/ui/TextArea';
import InputField from '@/components/ui/InputField';
import { useToast } from '@/components/ui/Toast';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, Send, Sparkles } from 'lucide-react';

export default function ApplyPage() {
    const params = useParams();
    const router = useRouter();
    const { showToast } = useToast();
    const id = params.id as string;

    const [internship, setInternship] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [coverLetter, setCoverLetter] = useState('');
    const [portfolioUrl, setPortfolioUrl] = useState('');

    useEffect(() => {
        const fetchInternship = async () => {
            setFetching(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    router.push('/login');
                    return;
                }

                // Parallel fetch internship data and check for existing application
                const [intRes, existingRes] = await Promise.all([
                    supabase.from('internships').select('*').eq('id', id).single(),
                    supabase.from('applications').select('id').eq('internship_id', id).eq('student_id', user.id).maybeSingle()
                ]);

                if (intRes.error) throw intRes.error;

                if (existingRes.data) {
                    showToast('You have already applied for this internship', 'success');
                    router.push('/activity');
                    return;
                }

                if (intRes.data) {
                    const { data: recData } = await supabase
                        .from('recruiter_profiles')
                        .select('company_name')
                        .eq('id', intRes.data.recruiter_id)
                        .single();

                    setInternship({
                        ...intRes.data,
                        recruiter: recData || { company_name: 'Individual Recruiter' }
                    });
                }
            } catch (error: any) {
                console.error('Error initializing apply page:', error.message);
            } finally {
                setFetching(false);
            }
        };
        if (id) fetchInternship();
    }, [id, router, showToast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }

            const { error } = await supabase.from('applications').insert([{
                internship_id: id,
                student_id: user.id,
                cover_letter: coverLetter,
                portfolio_link: portfolioUrl,
                status: 'applied',
            }]);

            if (error) {
                // Unique constraint violation (already applied)
                if (error.code === '23505') {
                    showToast('You have already applied for this internship!', 'info');
                    router.push('/activity');
                    return;
                }
                throw error;
            }

            showToast('Application submitted successfully!', 'success');
            router.push('/activity');
        } catch (error: any) {
            console.error('Submission error:', error);
            showToast(error.message || 'Error submitting application', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="max-w-2xl mx-auto pt-20 animate-pulse bg-white h-96 rounded-[40px]" />;

    if (!internship) {
        return (
            <div className="max-w-2xl mx-auto text-center py-20">
                <h2 className="text-2xl font-black text-slate-900">Internship not found</h2>
                <Button variant="ghost" className="mt-4" onClick={() => router.back()}>
                    Go Back
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto animate-slide-up pt-10 pb-20 px-4">
            <Button variant="ghost" className="mb-6 text-slate-500 hover:text-primary font-bold" onClick={() => router.back()}>
                <ChevronLeft className="w-4 h-4 mr-2" /> Cancel Application
            </Button>

            {/* ── Internship Summary ── */}
            <Card className="mb-8 p-8 border-none shadow-sm rounded-[32px] bg-white">
                <div className="flex items-center gap-4 mb-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black uppercase">
                        {internship.recruiter?.company_name?.[0] || 'I'}
                    </div>
                    <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-none mb-1">Applying to</p>
                        <h2 className="text-lg font-black text-foreground leading-tight">{internship.title}</h2>
                        <p className="text-sm font-bold text-muted-foreground mt-1">{internship.recruiter?.company_name}</p>
                    </div>
                </div>
            </Card>

            {/* ── Application Form ── */}
            <Card className="rounded-[40px] border-none shadow-xl p-10 bg-white">
                <div className="flex items-center gap-3 mb-8">
                    <Sparkles className="w-6 h-6 text-primary" />
                    <h1 className="text-2xl font-black text-foreground">Submit Application</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <TextArea
                        label="Cover Letter"
                        placeholder="Tell them why you're a great fit for this role..."
                        rows={8}
                        required
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        className="rounded-2xl border-slate-200"
                    />

                    <InputField
                        label="Portfolio / Projects Link"
                        type="url"
                        placeholder="https://github.com/yourusername"
                        value={portfolioUrl}
                        onChange={(e) => setPortfolioUrl(e.target.value)}
                        className="rounded-xl"
                    />

                    <div>
                        <label className="text-xs font-black text-foreground uppercase tracking-widest block mb-3">Resume Source</label>
                        <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-center">
                            <p className="text-sm text-slate-500 font-bold">
                                We'll use the resume from your <Link href="/profile" className="text-primary hover:underline">profile</Link>.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            loading={loading}
                            className="flex-1 h-14 rounded-2xl font-black shadow-primary/20 shadow-xl"
                        >
                            <Send className="w-5 h-5 mr-3" />
                            {loading ? 'Submitting...' : 'Confirm Application'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
