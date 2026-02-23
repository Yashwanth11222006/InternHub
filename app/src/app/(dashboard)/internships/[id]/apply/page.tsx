'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import TextArea from '@/components/ui/TextArea';
import InputField from '@/components/ui/InputField';
import { useToast } from '@/components/ui/Toast';
import { api, ApiError } from '@/lib/api';
import { useAuthContext } from '@/lib/auth-context';
import { ChevronLeft, Send, Sparkles, Upload, FileText, X } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function ApplyPage() {
    const params = useParams();
    const router = useRouter();
    const { showToast } = useToast();
    const { isAuthenticated, loading: authLoading, session } = useAuthContext();
    const id = params.id as string;

    const [internship, setInternship] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [coverLetter, setCoverLetter] = useState('');
    const [portfolioUrl, setPortfolioUrl] = useState('');
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [uploadingResume, setUploadingResume] = useState(false);

    useEffect(() => {
        const fetchInternship = async () => {
            setFetching(true);
            try {
                if (!isAuthenticated && !authLoading) {
                    router.push('/login');
                    return;
                }

                // Fetch internship data
                const internshipData = await api.internships.getById(id);

                // Check if already applied
                try {
                    const applications = await api.applications.getMyApplications();
                    const alreadyApplied = applications.some(app => app.internship_id === id);
                    if (alreadyApplied) {
                        showToast('You have already applied for this internship', 'success');
                        router.push('/activity');
                        return;
                    }
                } catch {
                    // Ignore - might be a new user
                }

                setInternship({
                    ...internshipData,
                    recruiter: { company_name: internshipData.company || 'Individual Recruiter' }
                });
            } catch (error: any) {
                console.error('Error initializing apply page:', error.message);
            } finally {
                setFetching(false);
            }
        };
        if (id && !authLoading) fetchInternship();
    }, [id, router, showToast, isAuthenticated, authLoading]);

    // Upload resume file (optional - doesn't block application)
    const uploadResume = async (): Promise<string | null> => {
        if (!resumeFile || !session?.access_token) return null;

        setUploadingResume(true);
        try {
            const formData = new FormData();
            formData.append('file', resumeFile);

            const res = await fetch(`${API_URL}/api/upload/resume`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: formData,
            });

            const json = await res.json();
            if (!res.ok) {
                // Don't block - just warn and continue without resume
                console.warn('Resume upload failed:', json.error);
                return null;
            }
            return json.resume_url;
        } catch {
            // Don't block - just warn and continue without resume
            console.warn('Resume upload network error');
            return null;
        } finally {
            setUploadingResume(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                showToast('Please upload a PDF file', 'error');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                showToast('File size must be less than 5MB', 'error');
                return;
            }
            setResumeFile(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Client-side validation
        if (coverLetter.trim().length < 20) {
            showToast('Cover letter must be at least 20 characters', 'error');
            return;
        }

        setLoading(true);

        try {
            // Upload resume first if provided
            let resumeUrl: string | undefined;
            if (resumeFile) {
                const url = await uploadResume();
                if (url) resumeUrl = url;
            }

            await api.applications.apply({
                internship_id: id,
                cover_letter: coverLetter,
                portfolio_link: portfolioUrl || undefined,
                resume_url: resumeUrl,
            });

            showToast('Application submitted successfully!', 'success');
            router.push('/activity');
        } catch (error: any) {
            console.error('Submission error:', error);
            if (error instanceof ApiError && error.status === 409) {
                showToast('You have already applied for this internship!', 'info');
                router.push('/activity');
                return;
            }
            showToast(error.message || 'Error submitting application', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="max-w-2xl mx-auto pt-20 animate-pulse bg-white h-96 rounded-[40px] border-2 border-black" />;

    if (!internship) {
        return (
            <div className="max-w-2xl mx-auto text-center py-20">
                <h2 className="text-2xl font-black text-black">Internship not found</h2>
                <Button variant="ghost" className="mt-4 text-black" onClick={() => router.back()}>
                    Go Back
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto animate-slide-up pt-10 pb-20 px-4">
            <Button variant="ghost" className="mb-6 text-black hover:text-black/70 font-bold" onClick={() => router.back()}>
                <ChevronLeft className="w-4 h-4 mr-2" /> Cancel Application
            </Button>

            {/* ── Internship Summary ── */}
            <Card className="mb-8 p-8 border-2 border-black shadow-lg rounded-[32px] bg-white">
                <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white font-black uppercase text-lg">
                        {internship.recruiter?.company_name?.[0] || 'I'}
                    </div>
                    <div>
                        <p className="text-[10px] text-black uppercase font-black tracking-widest leading-none mb-1">Applying to</p>
                        <h2 className="text-xl font-black text-black leading-tight">{internship.title}</h2>
                        <p className="text-sm font-bold text-black/60 mt-1">{internship.recruiter?.company_name}</p>
                    </div>
                </div>
            </Card>

            {/* ── Application Form ── */}
            <Card className="rounded-[40px] border-2 border-black shadow-2xl p-10 bg-white">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-black rounded-xl">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-black text-black">Submit Application</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <TextArea
                            label="Cover Letter"
                            placeholder="Tell them why you're a great fit for this role... (minimum 20 characters)"
                            rows={8}
                            required
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                            className="rounded-2xl border-2 border-black bg-white text-black placeholder:text-black/40 focus:border-black focus:ring-black/20"
                        />
                        <p className={`text-xs mt-1 ${coverLetter.length >= 20 ? 'text-green-600' : 'text-red-500'}`}>
                            {coverLetter.length >= 20 ? '✓' : '✗'} {coverLetter.length}/20 characters
                        </p>
                    </div>

                    <InputField
                        label="Portfolio / Projects Link"
                        type="url"
                        placeholder="https://github.com/yourusername"
                        value={portfolioUrl}
                        onChange={(e) => setPortfolioUrl(e.target.value)}
                        className="rounded-xl border-2 border-black bg-white text-black placeholder:text-black/40 focus:border-black"
                    />

                    <div>
                        <label className="text-xs font-black text-black uppercase tracking-widest block mb-3">Resume (PDF) <span className="text-black/40 font-normal normal-case">(Optional)</span></label>
                        {resumeFile ? (
                            <div className="p-4 bg-gray-50 border-2 border-black rounded-2xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-6 h-6 text-black" />
                                    <div>
                                        <p className="text-sm font-bold text-black">{resumeFile.name}</p>
                                        <p className="text-xs text-black/60">{(resumeFile.size / 1024).toFixed(1)} KB</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setResumeFile(null)}
                                    className="p-2 hover:bg-black/10 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-black" />
                                </button>
                            </div>
                        ) : (
                            <label className="p-6 bg-gray-50 border-2 border-dashed border-black/30 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-black transition-colors">
                                <Upload className="w-8 h-8 text-black/50 mb-2" />
                                <p className="text-sm text-black/70 font-bold">Click to upload your resume</p>
                                <p className="text-xs text-black/40 mt-1">PDF only, max 5MB</p>
                                <input
                                    type="file"
                                    accept=".pdf,application/pdf"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                        )}
                        <p className="text-xs text-black/50 mt-2">
                            Skip this — we'll use the resume from your profile if you have one.
                        </p>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            loading={loading || uploadingResume}
                            disabled={coverLetter.trim().length < 20}
                            className={`flex-1 h-14 rounded-2xl font-black shadow-lg text-white transition-all duration-300 ${coverLetter.trim().length < 20
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-black hover:bg-black/80'
                                }`}
                        >
                            <Send className="w-5 h-5 mr-3" />
                            {uploadingResume ? 'Uploading Resume...' : loading ? 'Submitting...' : 'Confirm Application'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
