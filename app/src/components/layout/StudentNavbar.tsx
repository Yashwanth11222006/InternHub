'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    FileText,
    LayoutDashboard,
    LogOut,
    ChevronDown,
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import Avatar from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';

export default function StudentNavbar({ userName }: { userName: string }) {
    const pathname = usePathname();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const isHomePage = pathname === '/home';

    const navItems = [
        { label: 'Community', href: '/community', icon: Users },
        { label: 'My Activity', href: '/activity', icon: FileText },
        { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ];

    return (
        <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
            <header className="w-full h-[68px] flex items-center justify-between px-8 pointer-events-auto transition-all duration-300 bg-white border-b border-black/10">
                {/* Left: Logo */}
                <Link href="/home" className="shrink-0 flex items-center">
                    <div className="rounded-full bg-white shadow-md border border-black/10 p-1">
                        <Logo size="sm" />
                    </div>
                </Link>

                {/* Center: Centered Nav Items */}
                <nav className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2 py-1 px-1 rounded-2xl border bg-white border-black/10">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "px-5 py-2 rounded-xl text-[13px] font-bold flex items-center gap-2 transition-all relative overflow-hidden tracking-tight border border-transparent",
                                    isActive
                                        ? "bg-black text-white shadow-md shadow-black/20 border-black"
                                        : "text-black/70 hover:text-black hover:bg-[#f5f0e8] hover:border-black/20"
                                )}
                            >
                                <item.icon className={cn("w-4 h-4", isActive ? "text-white" : "text-black/60")} />
                                {item.label}
                                {isActive && (
                                    <motion.div layoutId="nav-glow" className="absolute inset-0 bg-black/10 -z-10" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right: User Profile Dropdown */}
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-2 p-1 rounded-full bg-black border border-black text-white hover:bg-black/90 transition-all cursor-pointer"
                        >
                            <div className="rounded-full bg-black border border-black">
                                <Avatar size="sm" name={userName} className="text-white" />
                            </div>
                            <span className="ml-2 text-[15px] font-bold text-white">Hi, {userName}</span>
                            <ChevronDown className={cn("w-3.5 h-3.5 transition-transform text-white/80", dropdownOpen && "rotate-180")} />
                        </button>

                        <AnimatePresence>
                            {dropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                    className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-xl rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-black/10 p-1.5"
                                >
                                    <div className="px-4 py-3 mb-1 border-b border-black/10">
                                        <p className="text-[10px] font-bold text-black uppercase tracking-widest leading-none mb-1.5">Candidate</p>
                                        <p className="text-sm font-bold text-black truncate">{userName}</p>
                                    </div>

                                    <Link
                                        href="/profile"
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[12px] font-semibold text-black hover:bg-black/5 transition-all"
                                    >
                                        <Avatar size="xs" name={userName} />
                                        Update Profile
                                    </Link>

                                    <div className="mt-1 pt-1 border-t border-black/10">
                                        <Link
                                            href="/"
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[12px] font-semibold text-black hover:bg-black/5 transition-all group mt-1"
                                        >
                                            <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
                                                <LogOut className="w-3.5 h-3.5" />
                                            </div>
                                            Sign Out
                                        </Link>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </header>
        </div>
    );
}
