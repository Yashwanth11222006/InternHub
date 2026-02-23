'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthSwitch from '@/components/auth-switch';
import { Logo } from '@/components/ui/Logo';
import { useAuthContext } from '@/lib/auth-context';

export default function SignupPage() {
    const router = useRouter();
    const { signUp } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (data: { name: string; email: string; password: string; role: 'student' | 'recruiter' }) => {
        setLoading(true);
        setError('');
        try {
            const result = await signUp(data.email, data.password, data.role);
            console.log('Signup result:', result);
            
            // Small delay to let auth state update
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Redirect based on result
            if (result?.needsEmailConfirmation) {
                router.push('/login?signup=success');
            } else {
                // User is signed in - go to complete profile
                router.push('/complete-profile');
            }
        } catch (err: any) {
            console.error('Signup error:', err);
            setError(err.message || 'Error signing up');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 overflow-hidden flex items-center justify-center z-[100]"
            style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 50%, #16213e 100%)',
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            }}
        >
            {/* Ambient background glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/8 rounded-full blur-[100px]" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-500/8 rounded-full blur-[100px]" />
            </div>

            {/* Logo overlay */}
            <div className="absolute top-8 left-8 z-50 pointer-events-auto">
                <Link href="/">
                    <Logo />
                </Link>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center w-full px-4">
                {/* Error Display */}
                {error && (
                    <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm max-w-md text-center">
                        {error}
                    </div>
                )}
                
                {/* AuthSwitch Component */}
                <AuthSwitch
                    onSubmit={handleSubmit}
                    loading={loading}
                />

                {/* Footer Link */}
                <p className="mt-8 text-center text-sm text-slate-500">
                    Already have an account?{' '}
                    <Link href="/login" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}
