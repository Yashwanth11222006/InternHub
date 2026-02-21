'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import InputField from '@/components/ui/InputField';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

export default function StudentSignupPage() {
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            showToast('Account created successfully!', 'success');
            window.location.href = '/dashboard/student';
        }, 1000);
    };

    return (
        <div className="min-h-[calc(100vh-var(--navbar-height))] flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md animate-fade-in">
                <div className="bg-white rounded-[var(--radius-lg)] border border-border shadow-[var(--shadow)] p-8">
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-foreground">Student Sign Up</h1>
                        <p className="text-sm text-muted-foreground mt-1">Create your student account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <InputField label="Full Name" placeholder="John Doe" required />
                        <InputField label="Email" type="email" placeholder="you@university.edu" required />
                        <InputField label="University" placeholder="IIT Delhi" required />
                        <InputField label="Password" type="password" placeholder="••••••••" required />
                        <InputField label="Confirm Password" type="password" placeholder="••••••••" required />
                        <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
                            Create Account
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
