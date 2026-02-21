'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import InputField from '@/components/ui/InputField';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

export default function RecruiterSignupPage() {
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            showToast('Recruiter account created!', 'success');
            window.location.href = '/dashboard/recruiter';
        }, 1000);
    };

    return (
        <div className="min-h-[calc(100vh-var(--navbar-height))] flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md animate-fade-in">
                <div className="bg-white rounded-[var(--radius-lg)] border border-border shadow-[var(--shadow)] p-8">
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 bg-success-light rounded-xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-foreground">Recruiter Sign Up</h1>
                        <p className="text-sm text-muted-foreground mt-1">Create your company account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <InputField label="Company Name" placeholder="TechCorp Solutions" required />
                        <InputField label="Your Name" placeholder="Priya Sharma" required />
                        <InputField label="Work Email" type="email" placeholder="you@company.com" required />
                        <InputField label="Password" type="password" placeholder="••••••••" required />
                        <InputField label="Confirm Password" type="password" placeholder="••••••••" required />
                        <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
                            Create Company Account
                        </Button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground mt-6">
                        Already have an account?{' '}
                        <Link href="/login" className="text-primary hover:text-primary-hover font-medium">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
