'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Briefcase, User, ArrowLeft, Mail, Lock, UserPlus, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { PremiumButton } from '@/components/ui/PremiumButton';
import InputField from '@/components/ui/InputField';
import { Logo } from '@/components/ui/Logo';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

export default function SignupPage() {
    const router = useRouter();
    const [selection, setSelection] = useState<'student' | 'recruiter' | null>(null);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleInviteClick = (type: 'student' | 'recruiter') => {
        setSelection(type);
    };

    const handleBack = () => {
        setSelection(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selection) return;

        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
            });

            if (error) throw error;

            if (data.user) {
                // Insert into public.users table
                const { error: userError } = await supabase.from('users').insert([
                    {
                        id: data.user.id,
                        email: formData.email,
                        role: selection,
                    },
                ]);

                if (userError) throw userError;

                router.push('/signup/complete-profile');
            }
        } catch (error: any) {
            alert(error.message || 'Error signing up');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-white overflow-hidden flex z-[100]">
            {/* Logo overlay */}
            <div className="absolute top-8 left-8 z-50 pointer-events-auto">
                <Link href="/">
                    <Logo />
                </Link>
            </div>

            <AnimatePresence mode="wait">
                {!selection ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex w-full h-full"
                    >
                        {/* Recruiter Side */}
                        <motion.div
                            whileHover={{ flexGrow: 1.5 }}
                            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                            className="relative flex-1 group bg-slate-100 overflow-hidden cursor-pointer"
                            onClick={() => handleInviteClick('recruiter')}
                        >
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" />
                            {/* Overlay removed per user request */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center z-10">
                                <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[40px] shadow-2xl border border-white/50 max-w-sm">
                                    <div className="w-20 h-20 rounded-3xl bg-slate-900 flex items-center justify-center mb-6 mx-auto shadow-xl">
                                        <Briefcase className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Recruiters</h3>
                                    <p className="text-base text-slate-600 mb-8 font-bold leading-relaxed">
                                        Access top student talent and manage your hiring pipeline effortlessly.
                                    </p>
                                    <Button variant="primary" className="w-full h-12 rounded-2xl bg-slate-900 border-none">Join as Recruiter</Button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Student Side */}
                        <motion.div
                            whileHover={{ flexGrow: 1.5 }}
                            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                            className="relative flex-1 group bg-slate-50 overflow-hidden cursor-pointer border-l border-border"
                            onClick={() => handleInviteClick('student')}
                        >
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" />
                            {/* Overlay removed per user request */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center z-10">
                                <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[40px] shadow-2xl border border-white/50 max-w-sm">
                                    <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center mb-6 mx-auto shadow-xl">
                                        <User className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-3xl font-black text-primary mb-4 tracking-tight">Students</h3>
                                    <p className="text-base text-slate-600 mb-8 font-bold leading-relaxed">
                                        Find verified internships and build your professional future today.
                                    </p>
                                    <Button variant="primary" className="w-full h-12 rounded-2xl bg-primary border-none">Join as Student</Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, x: selection === 'student' ? 100 : -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex w-full h-full"
                    >
                        {/* Form Side */}
                        <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-8 lg:p-24 bg-white z-20">
                            <div className="max-w-md w-full animate-slide-up">
                                <button
                                    onClick={handleBack}
                                    className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors mb-10 cursor-pointer group"
                                >
                                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                    Choose different role
                                </button>

                                <div className="mb-10">
                                    <h2 className="text-4xl font-extrabold text-foreground tracking-tight mb-3">
                                        Create your {selection} account
                                    </h2>
                                    <p className="text-muted-foreground">Join InternHub and start reaching your goals.</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <InputField
                                        label="Full Name"
                                        placeholder="John Doe"
                                        icon={<User className="w-4 h-4 text-muted-foreground" />}
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                    <InputField
                                        label="Email Address"
                                        type="email"
                                        placeholder="john@example.com"
                                        icon={<Mail className="w-4 h-4 text-muted-foreground" />}
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                    <InputField
                                        label="Password"
                                        type="password"
                                        placeholder="••••••••"
                                        icon={<Lock className="w-4 h-4 text-muted-foreground" />}
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                    <PremiumButton
                                        type="submit"
                                        color="primary"
                                        glow
                                        disabled={loading}
                                        className="w-full h-14 text-base rounded-2xl shadow-xl"
                                        endContent={<UserPlus className="w-5 h-5" />}
                                    >
                                        {loading ? 'Creating...' : 'Create Account'}
                                    </PremiumButton>
                                </form>

                                <p className="mt-10 text-center text-sm text-muted-foreground">
                                    Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Log in</Link>
                                </p>
                            </div>
                        </div>

                        {/* Image Side */}
                        <div className={cn(
                            "hidden lg:block flex-1 relative overflow-hidden transition-all duration-700 bg-slate-100"
                        )}>
                            <div className={cn(
                                "absolute inset-0",
                                selection === 'student'
                                    ? "bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=2000')]"
                                    : "bg-[url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=2000')]"
                            )} style={{ backgroundSize: 'cover', backgroundPosition: 'center' }} />

                            {/* Raw image without dark overlays */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-24 text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="bg-white/90 backdrop-blur-xl p-12 rounded-[48px] shadow-2xl border border-white animate-fade-in max-w-sm"
                                >
                                    <div className={cn(
                                        "w-20 h-20 rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-xl",
                                        selection === 'student' ? "bg-primary" : "bg-slate-900"
                                    )}>
                                        {selection === 'student' ? <User className="w-10 h-10 text-white" /> : <Briefcase className="w-10 h-10 text-white" />}
                                    </div>
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-4">
                                        {selection === 'student' ? "Start Your Career" : "Hire Best Talent"}
                                    </h3>
                                    <p className="text-slate-600 font-bold flex items-center justify-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                        Verified Network
                                    </p>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
