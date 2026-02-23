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
import { AuroraBackground } from '@/components/ui/AuroraBackground';
import { Typewriter } from '@/components/ui/Typewriter';

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
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
};

export default function LandingPage() {
    return (
        <div className="overflow-x-hidden bg-background selection:bg-primary/30 selection:text-white pb-20 mt-[-var(--navbar-height)]">
            {/* ── Section 1: Hero with Aurora ── */}
            <AuroraBackground className="min-h-screen">
                <section className="relative w-full flex items-center justify-center py-20 px-6">
                    <div className="max-w-7xl mx-auto relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >

                            <h1 className="text-6xl md:text-8xl font-normal font-serif text-white leading-[1.1] tracking-tighter mb-10 italic flex flex-col items-center">
                                <span className="block">Find the right</span>
                                <span className="underline decoration-white/20 underline-offset-[12px]">
                                    <Typewriter
                                        text={[
                                            "Opportunity",
                                            "Internship",
                                            "Career",
                                            "Experience",
                                            "Growth",
                                            "Breakthrough",
                                            "Path",
                                            "Direction",
                                        ]}
                                        colors={[
                                            "#22ff88", // neon green
                                            "#00f5ff", // neon cyan
                                            "#ffdd1a", // neon yellow
                                            "#ff3366", // neon pink-red
                                            "#9b5cff", // neon purple
                                            "#00ffbf", // aqua
                                            "#ffe500", // bright yellow
                                            "#ff4bff", // magenta
                                        ]}
                                        speed={70}
                                        waitTime={2000}
                                        deleteSpeed={40}
                                        cursorChar="."
                                        className="min-h-[1.2em] inline-block"
                                    />
                                </span>
                            </h1>

                            <p className="text-base md:text-lg text-white/50 font-sans font-normal leading-relaxed mb-14 max-w-xl mx-auto tracking-wide">
                                A verified internship ecosystem connecting ambitious students with trusted recruiters-built for structured hiring and transparent growth.
                            </p>

                            <div className="flex flex-wrap justify-center gap-6">
                                <Link href="/signup">
                                    <PremiumButton
                                        glow
                                        className="h-16 px-12 text-base font-bold rounded-2xl bg-white text-black hover:bg-neutral-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                                    >
                                        GET STARTED <ArrowRight className="w-5 h-5 ml-2 inline" />
                                    </PremiumButton>
                                </Link>
                                <Link href="/internships">
                                    <PremiumButton
                                        className="h-16 px-12 text-base font-bold rounded-2xl glass border border-white/10 text-white hover:bg-white/5 transition-all"
                                    >
                                        EXPLORE OPPORTUNITIES
                                    </PremiumButton>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </AuroraBackground>

            {/* ── Section 2: Features (Strict Dark Polish) ── */}
            <section className="py-32 relative bg-black/50 border-y border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-24">
                        <motion.h2
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="text-4xl md:text-6xl font-black text-white tracking-tighter"
                        >
                            Engineered for <br /><span className="text-primary">Excellence</span>.
                        </motion.h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        {[
                            { title: 'Verified Security', icon: ShieldCheck, desc: 'Every internship is manually audited for maximum safety.', color: 'from-blue-500/10 to-transparent' },
                            { title: 'Real-time Sync', icon: Zap, desc: 'Instant application tracking with zero-latency updates.', color: 'from-amber-500/10 to-transparent' },
                            { title: 'Smart Match', icon: TrendingUp, desc: 'Our AI finds the perfect cultural and skill fit for you.', color: 'from-emerald-500/10 to-transparent' }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group relative"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                                <Card className="relative h-full glass p-10 rounded-[32px] border border-white/5 hover:border-white/20 transition-all duration-500">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                                        <feature.icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-white mb-4 tracking-tighter">{feature.title}</h3>
                                    <p className="text-muted-foreground text-base leading-relaxed">{feature.desc}</p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Section 3: Professional Split ── */}
            <section className="py-20 px-6 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-10">
                    <motion.div
                        whileHover={{ scale: 0.99 }}
                        className="relative group h-[540px] rounded-[48px] overflow-hidden border border-white/10 shadow-2xl"
                    >
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-1000" />
                        <div className="absolute inset-0 bg-black/60 group-hover:bg-black/30 transition-colors duration-1000" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                        <div className="relative h-full p-12 flex flex-col justify-end">
                            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-blue-400 mb-4 block">FOR STUDENTS</span>
                            <h3 className="text-5xl font-black text-white mb-6 tracking-tighter italic">Join Elite.</h3>
                            <Link href="/signup">
                                <PremiumButton className="bg-white text-black font-black text-xs h-14 rounded-full px-10 border-none shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all">JOIN NOW</PremiumButton>
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 0.99 }}
                        className="relative group h-[540px] rounded-[48px] overflow-hidden border border-white/10 shadow-2xl"
                    >
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-1000" />
                        <div className="absolute inset-0 bg-black/60 group-hover:bg-black/20 transition-colors duration-1000" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                        <div className="relative h-full p-12 flex flex-col justify-end">
                            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-blue-400 mb-4 block">FOR COMPANIES</span>
                            <h3 className="text-5xl font-black text-white mb-6 tracking-tighter italic">Hire Top.</h3>
                            <Link href="/signup">
                                <PremiumButton className="glass text-white font-black text-xs h-14 rounded-full px-10 border border-white/10 hover:bg-white/5 transition-all">RECRUIT TALENT</PremiumButton>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── Section 4: Polished Final Footer CTA with Aurora ── */}
            <AuroraBackground className="py-20 mt-20">
                <section className="text-center relative z-10 max-w-3xl mx-auto px-6">
                    <div className="mb-10 flex justify-center">
                        <div className="w-24 h-24 glass rounded-3xl flex items-center justify-center border border-white/10 animate-bounce-slow">
                            <Logo size="lg" />
                        </div>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-tight italic">
                        Ready to <span className="text-primary italic">Transform?</span>
                    </h2>
                    <p className="text-lg text-muted-foreground mb-12 font-medium tracking-wide">Join thousands of students and global companies already on the network.</p>
                    <Link href="/signup">
                        <PremiumButton glow className="h-16 px-16 text-base font-black rounded-2xl bg-white text-black shadow-2xl hover:scale-105 active:scale-95 transition-all">GET STARTED — FREE</PremiumButton>
                    </Link>
                </section>
            </AuroraBackground>
        </div>
    );
}
