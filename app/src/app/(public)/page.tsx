'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    Search,
    ShieldCheck,
    Zap,
    Users,
    TrendingUp,
    FileCheck,
    Briefcase,
    LayoutDashboard,
    Bell,
    UserCircle,
    CheckCircle2
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { Badge } from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export default function LandingPage() {
    return (
        <div className="overflow-x-hidden pt-6 font-sans selection:bg-primary/20 selection:text-primary">
            {/* ── Section 1: Hero (Infographic Style) ── */}
            <section className="relative py-16 sm:py-24 lg:py-28 bg-background overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[350px] h-[350px] bg-primary/10 blur-[80px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                            className="max-w-xl"
                        >
                            <motion.div
                                initial={{ opacity: 0, x: -15 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-primary/10 shadow-sm text-primary text-[10px] font-bold tracking-[0.15em] uppercase mb-8"
                            >
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                Verified Internship Network
                            </motion.div>

                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-foreground leading-[1.05] tracking-tight mb-8">
                                Find the <br />
                                <span className="text-primary italic">Right Fit.</span>
                            </h1>
                            <p className="text-lg text-foreground/70 font-medium leading-relaxed mb-10 max-w-md">
                                InternHub connects ambitious students with world-class companies through a verified, transparent, and aesthetically driven platform.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Link href="/signup">
                                    <PremiumButton
                                        color="primary"
                                        size="lg"
                                        glow
                                        className="h-14 px-10 text-[14px] font-bold shadow-xl rounded-2xl"
                                        endContent={<ArrowRight className="w-5 h-5 ml-1" />}
                                    >
                                        Get Started
                                    </PremiumButton>
                                </Link>
                                <Link href="/internships">
                                    <PremiumButton
                                        variant="bordered"
                                        size="lg"
                                        className="h-14 px-10 text-[14px] font-bold border-2 border-primary/5 bg-white/40 backdrop-blur-sm rounded-2xl hover:border-primary/20 transition-all font-sans"
                                    >
                                        Explore Jobs
                                    </PremiumButton>
                                </Link>
                            </div>
                        </motion.div>

                        {/* Hero Infographic Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, rotate: -1 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="hidden lg:block relative"
                        >
                            <div className="absolute inset-0 bg-primary/15 blur-[100px] rounded-full animate-pulse-slow font-sans" />
                            <Card padding="none" className="relative border-4 border-white backdrop-blur-xl shadow-[0_24px_64px_rgba(0,0,0,0.08)] overflow-hidden rounded-[32px] bg-white/50">
                                {/* Browser Chrome */}
                                <div className="bg-white/80 p-4 border-b border-primary/5 flex items-center justify-between">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-400/20 border border-red-400/30" />
                                        <div className="w-3 h-3 rounded-full bg-amber-400/20 border border-amber-400/30" />
                                        <div className="w-3 h-3 rounded-full bg-emerald-400/20 border border-emerald-400/30" />
                                    </div>
                                    <div className="h-7 px-4 w-48 bg-background rounded-full border border-primary/5 flex items-center justify-center">
                                        <span className="text-[9px] font-bold text-primary opacity-30 uppercase tracking-widest font-sans">internhub.app/verified</span>
                                    </div>
                                    <div className="w-8 h-8 rounded-full border border-primary/5 bg-white flex items-center justify-center shadow-sm">
                                        <Bell className="w-3.5 h-3.5 text-primary opacity-50" />
                                    </div>
                                </div>
                                <div className="p-8 space-y-8">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-5">
                                            <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/10 transition-transform hover:scale-105 duration-500">
                                                <Briefcase className="w-8 h-8" />
                                            </div>
                                            <div className="space-y-1.5">
                                                <div className="h-5 w-40 bg-foreground/80 rounded-full" />
                                                <div className="h-3 w-24 bg-primary/20 rounded-full" />
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="px-4 py-1.5 rounded-full font-bold text-[10px] border-primary/10 text-primary bg-primary/5">VERIFIED</Badge>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="p-6 bg-white/80 rounded-[24px] border border-primary/5 shadow-sm space-y-3 hover:shadow-md transition-shadow group">
                                            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 transition-transform group-hover:rotate-6">
                                                <TrendingUp className="w-5 h-5" />
                                            </div>
                                            <div className="space-y-1.5">
                                                <div className="h-2.5 w-full bg-foreground/10 rounded-full" />
                                                <div className="h-2.5 w-2/3 bg-foreground/10 rounded-full" />
                                            </div>
                                        </div>
                                        <div className="p-6 bg-white/80 rounded-[24px] border border-primary/5 shadow-sm space-y-3 hover:shadow-md transition-shadow group">
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 transition-transform group-hover:rotate-6">
                                                <Users className="w-5 h-5" />
                                            </div>
                                            <div className="space-y-1.5">
                                                <div className="h-2.5 w-full bg-foreground/10 rounded-full" />
                                                <div className="h-2.5 w-2/3 bg-foreground/10 rounded-full" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6 bg-primary rounded-[24px] shadow-xl shadow-primary/20 flex items-center justify-between group cursor-pointer overflow-hidden relative">
                                        <div className="relative z-10 font-bold text-white text-sm tracking-wide">
                                            Application Status: <span className="underline decoration-white/30 underline-offset-4">In Review</span>
                                        </div>
                                        <CheckCircle2 className="w-6 h-6 text-white relative z-10 transition-transform group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 font-sans" />
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Section 2: Features (Cream Background) ── */}
            <section className="py-20 bg-[#FFFDD0] relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <motion.h2
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl font-extrabold text-foreground tracking-tight leading-tight"
                        >
                            Why Choose <span className="text-primary italic">InternHub?</span>
                        </motion.h2>
                        <p className="mt-5 text-lg text-foreground/60 font-medium">The most reliable platform for career development.</p>
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-3 gap-8"
                    >
                        {[
                            { title: 'Verified Listings', icon: ShieldCheck, color: 'bg-primary/5 text-primary', desc: 'Every opportunity is manually verified by our team for safety.' },
                            { title: 'Transparent Tracking', icon: Zap, color: 'bg-amber-50 text-amber-600', desc: 'Know exactly where your application stands at every stage.' },
                            { title: 'Structured Hiring', icon: FileCheck, color: 'bg-blue-50 text-blue-600', desc: 'A streamlined experience for recruiters and students alike.' }
                        ].map((feature, i) => (
                            <motion.div key={i} variants={itemVariants}>
                                <Card hover className="h-full border border-primary/5 bg-white shadow-sm hover:shadow-xl group p-10 rounded-[28px] transition-all duration-400">
                                    <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-all duration-400 group-hover:scale-105 group-hover:rotate-3 shadow-sm', feature.color)}>
                                        <feature.icon className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-foreground mb-4 leading-tight">{feature.title}</h3>
                                    <p className="text-foreground/60 font-medium text-sm leading-relaxed">{feature.desc}</p>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── Section 3: Student & Recruiter Split ── */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
                    <motion.div
                        whileHover={{ y: -6 }}
                        className="relative group h-[480px] rounded-[40px] overflow-hidden bg-primary text-white cursor-pointer shadow-xl transition-all duration-500 border-4 border-white shadow-primary/10 font-sans"
                    >
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523240715181-01489a943ee2?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent opacity-90" />

                        <div className="relative h-full z-10 p-12 flex flex-col justify-end">
                            <motion.div
                                initial={{ opacity: 0, x: -15 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-[9px] font-bold tracking-[0.2em] uppercase mb-6 w-fit"
                            >
                                FOR STUDENTS
                            </motion.div>
                            <h3 className="text-4xl font-extrabold mb-4 tracking-tight leading-none group-hover:underline underline-offset-4 decoration-white/30 transition-all font-sans">Start Career</h3>
                            <p className="text-base text-white/80 mb-8 max-w-sm font-medium leading-relaxed font-sans">Find verified internships at top companies.</p>
                            <Link href="/signup">
                                <Button size="lg" className="rounded-xl px-10 h-14 bg-white text-primary hover:bg-[#FFFDD0] border-none shadow-xl font-bold text-[14px]">Join as Student</Button>
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -6 }}
                        className="relative group h-[480px] rounded-[40px] overflow-hidden bg-foreground text-white cursor-pointer shadow-xl transition-all duration-500 border-4 border-white shadow-foreground/10 font-sans"
                    >
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1454165833767-027ffd10f370?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/40 to-transparent opacity-95" />

                        <div className="relative h-full z-10 p-12 flex flex-col justify-end">
                            <motion.div
                                initial={{ opacity: 0, x: -15 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white text-[9px] font-bold tracking-[0.2em] uppercase mb-6 w-fit"
                            >
                                FOR RECRUITERS
                            </motion.div>
                            <h3 className="text-4xl font-extrabold mb-4 tracking-tight leading-none group-hover:underline underline-offset-4 decoration-white/20 transition-all font-sans">Hire Talent</h3>
                            <p className="text-base text-white/70 mb-8 max-w-sm font-medium leading-relaxed font-sans">Access a pool of verified student talent easily.</p>
                            <Link href="/signup">
                                <PremiumButton color="primary" size="lg" className="rounded-xl px-10 h-14 font-bold text-[14px] shadow-xl">Start Hiring</PremiumButton>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── Section 4: Benefits Grid ── */}
            <section className="py-24 bg-background relative overflow-hidden font-sans">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: 'Centralized Hub', icon: Search, desc: 'All applications in one place.' },
                            { title: 'Clean Dashboards', icon: LayoutDashboard, desc: 'Productive and clutter-free.' },
                            { title: 'Real-time Updates', icon: Bell, desc: 'Instant status notifications.' },
                            { title: 'Professional Profiles', icon: UserCircle, desc: 'Showcase skills with impact.' }
                        ].map((benefit, i) => (
                            <Card key={i} className="group p-8 border border-primary/5 bg-white shadow-sm hover:shadow-lg hover:translate-y-[-4px] transition-all duration-400 rounded-[28px]">
                                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary mb-6 transition-all duration-400 group-hover:bg-primary group-hover:text-white">
                                    <benefit.icon className="w-6 h-6" />
                                </div>
                                <h4 className="text-xl font-bold text-foreground mb-3 leading-tight group-hover:text-primary transition-colors font-sans">{benefit.title}</h4>
                                <p className="text-foreground/50 text-sm font-medium leading-relaxed font-sans">{benefit.desc}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Section 5: Final CTA ── */}
            <section className="py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-[#FFFDD0] border border-primary/5 rounded-[48px] py-20 px-10 text-center relative overflow-hidden shadow-lg group">
                    <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-primary/5 blur-[80px] rounded-full -translate-x-1/2 -translate-y-1/2 font-sans" />
                    <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-blue-400/5 blur-[60px] rounded-full translate-x-1/3 translate-y-1/3 font-sans" />

                    <div className="relative z-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center justify-center w-20 h-20 rounded-[24px] bg-white border border-primary/5 shadow-md mb-10"
                        >
                            <Logo size="lg" />
                        </motion.div>
                        <h2 className="text-5xl font-extrabold text-foreground mb-8 tracking-tight leading-[1.1]">
                            Ready to start <br />
                            <span className="text-primary italic">your journey?</span>
                        </h2>
                        <p className="text-base text-foreground/40 font-bold mb-12 uppercase tracking-[0.15em] font-sans">Join thousands of successful candidates today</p>
                        <Link href="/signup">
                            <PremiumButton
                                size="lg"
                                className="bg-primary text-white hover:bg-[#1E3A8A] h-14 px-12 text-[15px] font-bold rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95"
                            >
                                CREATE ACCOUNT
                            </PremiumButton>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}



