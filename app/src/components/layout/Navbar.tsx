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
        <header className="fixed top-0 z-40 w-full bg-transparent" style={{ height: 'var(--navbar-height)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="hover:opacity-80 transition-opacity">
                    <Logo />
                </Link>

                {/* Desktop Auth Buttons */}
                <div className="hidden md:flex items-center gap-3">
                    <Link href="/login">
                        <Button variant="ghost" size="sm" className="font-bold text-[13px] px-5 text-white hover:bg-white/5 transition-all">
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
                        className="md:hidden bg-black/95 backdrop-blur-xl border-b border-white/5 overflow-hidden shadow-xl"
                    >
                        <div className="px-5 py-8 flex flex-col gap-2">
                            <Link href="/login" onClick={() => setMobileOpen(false)}>
                                <Button variant="ghost" size="lg" className="w-full justify-start font-bold text-[14px] p-4 rounded-xl text-white">
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
