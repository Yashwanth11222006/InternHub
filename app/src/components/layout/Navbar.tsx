'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, CheckCircle2, Briefcase, Zap, Search, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [howItWorksOpen, setHowItWorksOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-primary/5" style={{ height: 'var(--navbar-height)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="hover:opacity-80 transition-opacity">
                    <Logo />
                </Link>

                {/* Desktop Nav Links */}
                <nav className="hidden md:flex items-center gap-1">
                    <div
                        className="relative"
                        onMouseEnter={() => setHowItWorksOpen(true)}
                        onMouseLeave={() => setHowItWorksOpen(false)}
                    >
                        <button className="px-4 py-2 text-[13px] font-bold text-foreground opacity-60 hover:opacity-100 hover:bg-background rounded-lg transition-all flex items-center gap-1.5 cursor-pointer">
                            How It Works
                            <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", howItWorksOpen && "rotate-180")} />
                        </button>

                        <AnimatePresence>
                            {howItWorksOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                    className="absolute top-full left-0 mt-2 w-[480px] bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-primary/5 p-6 grid grid-cols-2 gap-8"
                                >
                                    <div>
                                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4">For Students</p>
                                        <ul className="space-y-3">
                                            {[
                                                { label: 'Discover internships', icon: Search },
                                                { label: 'Apply easily', icon: Zap },
                                                { label: 'Track progress', icon: CheckCircle2 },
                                            ].map((item, i) => (
                                                <li key={i} className="flex items-center gap-3 text-[13px] font-semibold text-foreground opacity-60 hover:opacity-100 transition-colors group cursor-pointer">
                                                    <div className="w-7 h-7 rounded-lg bg-primary/5 flex items-center justify-center text-primary transition-all group-hover:bg-primary group-hover:text-white">
                                                        <item.icon className="w-3.5 h-3.5" />
                                                    </div>
                                                    {item.label}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="border-l border-primary/5 pl-8">
                                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4">For Recruiters</p>
                                        <ul className="space-y-3">
                                            {[
                                                { label: 'Post jobs', icon: Briefcase },
                                                { label: 'Manage talent', icon: Users },
                                                { label: 'Hiring flow', icon: CheckCircle2 },
                                            ].map((item, i) => (
                                                <li key={i} className="flex items-center gap-4 text-[13px] font-semibold text-foreground opacity-60 hover:opacity-100 transition-colors group cursor-pointer">
                                                    <div className="w-7 h-7 rounded-lg bg-primary/5 flex items-center justify-center text-primary transition-all group-hover:bg-primary group-hover:text-white">
                                                        <item.icon className="w-3.5 h-3.5" />
                                                    </div>
                                                    {item.label}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {[
                        { label: 'Community', href: '/community' },
                        { label: 'Recruiters', href: '/signup/recruiter' },
                    ].map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="px-4 py-2 text-[13px] font-bold text-foreground opacity-60 hover:opacity-100 hover:bg-background rounded-lg transition-all"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Desktop Auth Buttons */}
                <div className="hidden md:flex items-center gap-3">
                    <Link href="/login">
                        <Button variant="ghost" size="sm" className="font-bold text-[13px] px-5 opacity-60 hover:opacity-100 transition-all">
                            Login
                        </Button>
                    </Link>
                    <Link href="/signup">
                        <Button variant="primary" size="sm" className="px-6 rounded-xl shadow-lg shadow-primary/10 font-bold text-[13px] h-10 transition-all hover:scale-105 active:scale-95">
                            Sign Up
                        </Button>
                    </Link>
                </div>

                {/* Mobile Hamburger */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden p-2 text-foreground opacity-60 hover:opacity-100 hover:bg-background rounded-lg cursor-pointer transition-all"
                >
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="md:hidden bg-white border-b border-primary/5 overflow-hidden shadow-xl"
                    >
                        <div className="px-5 py-8 flex flex-col gap-2">
                            {[
                                { label: 'Internships', href: '/internships' },
                                { label: 'Community', href: '/community' },
                                { label: 'For Recruiters', href: '/signup/recruiter' },
                            ].map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="px-4 py-3 text-sm font-bold text-foreground opacity-60 hover:opacity-100 hover:bg-background rounded-xl transition-all"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="h-px bg-primary/5 my-3 mx-2" />
                            <Link href="/login" onClick={() => setMobileOpen(false)}>
                                <Button variant="ghost" size="lg" className="w-full justify-start font-bold text-[14px] p-4 rounded-xl">
                                    Login
                                </Button>
                            </Link>
                            <Link href="/signup" onClick={() => setMobileOpen(false)}>
                                <Button variant="primary" size="lg" className="w-full shadow-lg shadow-primary/10 font-bold text-[14px] h-12 rounded-xl mt-1 transition-all hover:scale-105 active:scale-95">
                                    Sign Up
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
