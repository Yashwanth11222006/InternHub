'use client';

import React from 'react';
import Avatar from '@/components/ui/Avatar';
import Dropdown from '@/components/ui/Dropdown';
import { CommandSearch } from '@/components/ui/CommandMenu';
import { Bell, User, LogOut, Settings, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface TopBarProps {
    title: string;
    userName: string;
    showHomeButton?: boolean;
}

export default function TopBar({ title, userName, showHomeButton }: TopBarProps) {
    return (
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-border" style={{ height: 'var(--topbar-height)' }}>
            <div className="h-full flex items-center justify-between px-4 lg:px-8">
                <div className="flex items-center gap-6">
                    {/* Optional Back to Portal Button for Students */}
                    {showHomeButton && (
                        <Link href="/home">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-4 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-primary hover:text-white transition-all shadow-sm"
                            >
                                <LayoutGrid className="w-4 h-4" />
                                Back to Hub
                            </motion.button>
                        </Link>
                    )}

                    {/* Page Title */}
                    <motion.h1
                        key={title}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-lg font-semibold text-foreground hidden sm:block"
                    >
                        {title}
                    </motion.h1>

                    <div className="hidden md:block">
                        <CommandSearch />
                    </div>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-3">
                    {/* Notification Bell */}
                    <button className="relative p-2.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-all cursor-pointer group">
                        <Bell className="w-5 h-5 transition-transform group-hover:rotate-12" />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-danger rounded-full ring-2 ring-white" />
                    </button>

                    {/* User Profile Dropdown */}
                    <div className="h-8 w-px bg-border mx-1" />

                    <Dropdown
                        align="right"
                        trigger={
                            <button className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-muted/50 transition-colors cursor-pointer group">
                                <Avatar name={userName} size="sm" />
                                <span className="text-sm font-medium text-foreground hidden md:block">{userName}</span>
                            </button>
                        }
                        items={[
                            {
                                label: 'Profile',
                                icon: <User className="w-4 h-4" />,
                                onClick: () => { window.location.href = '/profile'; },
                            },
                            {
                                label: 'Settings',
                                icon: <Settings className="w-4 h-4" />,
                                onClick: () => { console.log('settings'); },
                            },
                            {
                                label: 'Logout',
                                icon: <LogOut className="w-4 h-4" />,
                                danger: true,
                                onClick: () => { window.location.href = '/'; },
                            },
                        ]}
                    />
                </div>
            </div>
        </header>
    );
}
