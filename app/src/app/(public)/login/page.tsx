'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { useAuthContext } from '@/lib/auth-context';

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const signupSuccess = searchParams.get('signup') === 'success';
    const { signIn, loading: authLoading } = useAuthContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            await signIn(email, password);
            console.log('SignIn successful');

            // Import supabase and get user + role in one go
            const { supabase } = await import('@/lib/supabase');
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setError('Login failed — no user found.');
                setSubmitting(false);
                return;
            }

            // Single query to get role
            const { data: userData } = await supabase
                .from('users')
                .select('role')
                .eq('id', user.id)
                .single();

            const role = userData?.role || 'student';
            console.log('User role:', role);

            // Redirect based on role - skip profile check for speed
            if (role === 'admin') {
                router.push('/dashboard');
            } else if (role === 'recruiter') {
                router.push('/recruiter/dashboard');
            } else {
                router.push('/home');
            }
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.message || 'Failed to login');
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-[100] p-6"
            style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 50%, #16213e 100%)',
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            }}
        >
            {/* Ambient glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/8 rounded-full blur-[100px]" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/8 rounded-full blur-[100px]" />
            </div>

            {/* Logo */}
            <div className="absolute top-8 left-8 z-50">
                <Link href="/">
                    <Logo />
                </Link>
            </div>

            {/* Card */}
            <div className="relative z-10 w-full max-w-[1060px] h-[640px] bg-white rounded-3xl overflow-hidden flex"
                style={{ boxShadow: '0 30px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.04)' }}
            >
                {/* Left: Login Form */}
                <div className="w-1/2 h-full flex items-center justify-center p-10 lg:p-14">
                    <div className="w-full max-w-[380px]">
                        <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-slate-700 transition-colors mb-8 cursor-pointer group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to home
                        </Link>

                        <div className="mb-8">
                            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Welcome back</h2>
                            <p className="text-sm text-slate-500">Enter your credentials to access your account.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {signupSuccess && (
                                <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-600 text-sm">
                                    Account created successfully! Please log in.
                                </div>
                            )}
                            {error && (
                                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                                    {error}
                                </div>
                            )}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Email</label>
                                <div className="relative">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="arjun@university.edu"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full h-[52px] pl-11 pr-4 rounded-xl bg-white border-[1.5px] border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 font-medium focus:outline-none focus:ring-[3px] focus:ring-blue-500/15 focus:border-blue-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Password</label>
                                    <Link href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">Forgot password?</Link>
                                </div>
                                <div className="relative">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Lock className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full h-[52px] pl-11 pr-4 rounded-xl bg-white border-[1.5px] border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 font-medium focus:outline-none focus:ring-[3px] focus:ring-blue-500/15 focus:border-blue-500 transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full h-[52px] rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2.5 cursor-pointer transition-all duration-300 uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{
                                    background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                                    boxShadow: '0 6px 20px rgba(59, 130, 246, 0.3)',
                                }}
                                onMouseEnter={(e) => {
                                    if (!submitting) {
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 8px 30px rgba(59, 130, 246, 0.45)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.3)';
                                }}
                            >
                                {submitting ? (
                                    <span>Signing in...</span>
                                ) : (
                                    <>
                                        <LogIn className="w-4 h-4" />
                                        Log In
                                    </>
                                )}
                            </button>
                        </form>

                        <p className="mt-8 text-center text-sm text-slate-500">
                            Don&apos;t have an account?{' '}
                            <Link href="/signup" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">Get started</Link>
                        </p>

                        {/* Demo credentials */}
                        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => { setEmail('arjun@university.edu'); setPassword('password'); }}
                                className="p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all cursor-pointer text-left group"
                            >
                                <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5 group-hover:text-blue-500 transition-colors">Demo Student</p>
                                <p className="text-xs text-slate-700 font-semibold truncate">arjun@university.edu</p>
                            </button>
                            <button
                                type="button"
                                onClick={() => { setEmail('hr@techcorp.com'); setPassword('password'); }}
                                className="p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all cursor-pointer text-left group"
                            >
                                <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5 group-hover:text-blue-500 transition-colors">Demo Recruiter</p>
                                <p className="text-xs text-slate-700 font-semibold truncate">hr@techcorp.com</p>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Image & Content */}
                <div className="w-1/2 h-full relative overflow-hidden">
                    {/* Background image (no overlay) */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2000')", opacity: 1 }}
                    />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center justify-center h-full px-12 text-center">
                        {/* ...existing code... */}

                        {/* Social login */}
                        <div className="flex gap-3">
                            <a href="#" className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#fff" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#fff" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#fff" />
                                </svg>
                            </a>
                            <a href="#" className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                            </a>
                            <a href="#" className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="fixed inset-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 50%, #16213e 100%)' }}>
                <div className="text-slate-400">Loading...</div>
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
