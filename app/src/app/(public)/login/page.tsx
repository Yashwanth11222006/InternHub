'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';
import { PremiumButton } from '@/components/ui/PremiumButton';
import InputField from '@/components/ui/InputField';
import { Logo } from '@/components/ui/Logo';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            if (data.user) {
                // Fetch user role from our custom 'users' table
                const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select('role')
                    .eq('id', data.user.id)
                    .single();

                if (userError) throw userError;

                // Redirection is handled by the dashboards/profile page if incomplete
                if (userData.role === 'recruiter') {
                    router.push('/recruiter/dashboard');
                } else {
                    router.push('/home');
                }
            }
        } catch (error: any) {
            alert(error.message || 'Failed to login');
        }
    };

    return (
        <div className="fixed inset-0 bg-white flex flex-col lg:flex-row z-[100]">
            {/* Left: Branding & Decoration */}
            <div className="lg:w-1/2 bg-slate-100 relative overflow-hidden hidden lg:flex flex-col items-center justify-center text-foreground p-24 text-center">
                <div className="absolute top-8 left-8 z-50">
                    <Link href="/">
                        <Logo />
                    </Link>
                </div>

                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center" />
                {/* Overlay removed as per user request */}

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 bg-white/10 backdrop-blur-md p-10 rounded-3xl border border-white/20"
                >
                    <div className="w-20 h-20 bg-primary/10 backdrop-blur-2xl rounded-3xl flex items-center justify-center mb-8 mx-auto border border-primary/20">
                        <LogIn className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-5xl font-black tracking-tight mb-6 leading-tight">Welcome back to <br /> <span className="text-primary italic">InternHub.</span></h1>
                    <p className="text-xl text-foreground font-medium max-w-sm mx-auto">Continue your journey with the world&apos;s most trusted verified internship network.</p>
                </motion.div>
            </div>

            {/* Right: Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 lg:p-24 bg-white relative">
                <div className="lg:hidden absolute top-8 left-8">
                    <Link href="/">
                        <Logo />
                    </Link>
                </div>

                <div className="max-w-md w-full animate-slide-up">
                    <Link href="/" className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors mb-12 cursor-pointer group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to home
                    </Link>

                    <div className="mb-10">
                        <h2 className="text-4xl font-extrabold text-foreground tracking-tight mb-3">Login</h2>
                        <p className="text-muted-foreground">Enter your credentials to access your account.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <InputField
                            label="Email Address"
                            type="email"
                            placeholder="arjun@university.edu"
                            icon={<Mail className="w-4 h-4 text-muted-foreground" />}
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <div className="space-y-1">
                            <InputField
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                icon={<Lock className="w-4 h-4 text-muted-foreground" />}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <div className="flex justify-end">
                                <Link href="#" className="text-xs font-bold text-primary hover:underline">Forgot password?</Link>
                            </div>
                        </div>

                        <PremiumButton
                            type="submit"
                            color="primary"
                            glow
                            className="w-full h-14 text-base rounded-2xl shadow-xl"
                            endContent={<LogIn className="w-5 h-5" />}
                        >
                            Log In
                        </PremiumButton>
                    </form>

                    <div className="mt-12 text-center text-sm text-muted-foreground">
                        Don&apos;t have an account? <Link href="/signup" className="text-primary font-bold hover:underline">Get started</Link>
                    </div>

                    <div className="mt-16 pt-8 border-t border-border/50 grid grid-cols-2 gap-4">
                        <div className="p-4 bg-muted/20 rounded-2xl border border-border/30 hover:border-primary/30 transition-colors cursor-pointer group" onClick={() => { setEmail('arjun@university.edu'); setPassword('password'); }}>
                            <p className="text-[10px] uppercase font-black text-muted-foreground mb-1 group-hover:text-primary transition-colors">Demo Student</p>
                            <p className="text-xs text-foreground font-bold truncate">arjun@university.edu</p>
                        </div>
                        <div className="p-4 bg-muted/20 rounded-2xl border border-border/30 hover:border-primary/30 transition-colors cursor-pointer group" onClick={() => { setEmail('hr@techcorp.com'); setPassword('password'); }}>
                            <p className="text-[10px] uppercase font-black text-muted-foreground mb-1 group-hover:text-primary transition-colors">Demo Recruiter</p>
                            <p className="text-xs text-foreground font-bold truncate">hr@techcorp.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
