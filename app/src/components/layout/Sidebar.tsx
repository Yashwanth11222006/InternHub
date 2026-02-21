'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard as DashIcon,
    FileText as ActivityIcon,
    UserCircle as ProfileIcon,
    LogOut as LogoutIcon,
    ChevronLeft as LeftIcon,
    Menu as MenuIcon,
    X as XIcon,
    Briefcase as JobIcon,
    PlusCircle as AddIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/Logo';

interface SidebarProps {
    role: 'student' | 'recruiter';
}

const studentMenu = [
    { label: 'Overview', icon: DashIcon, href: '/dashboard' },
    { label: 'My Activity', icon: ActivityIcon, href: '/activity' },
    { label: 'My Profile', icon: ProfileIcon, href: '/profile' },
];

const recruiterMenu = [
    { label: 'Overview', icon: DashIcon, href: '/recruiter/dashboard' },
    { label: 'Post New', icon: AddIcon, href: '/recruiter/create' },
    { label: 'Manage', icon: JobIcon, href: '/recruiter/manage' },
    { label: 'Company Profile', icon: ProfileIcon, href: '/recruiter/profile' },
];

export default function Sidebar({ role }: SidebarProps) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const menu = role === 'student' ? studentMenu : recruiterMenu;

    const sidebarContent = (
        <div className="flex flex-col h-full bg-[#FAF9F6] select-none">
            {/* Logo */}
            <div className="h-[64px] flex items-center px-5 border-b border-[#EDE9E3] shrink-0">
                <Link href={role === 'student' ? '/dashboard' : '/recruiter/dashboard'} className="flex items-center gap-2">
                    <Logo size={collapsed ? "sm" : "md"} className={cn("transition-all", collapsed && "scale-90")} />
                </Link>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto overflow-x-hidden">
                <div className="mb-4 px-2">
                    <p className={cn(
                        "text-[9px] font-black text-slate-400 uppercase tracking-widest transition-opacity",
                        collapsed ? "opacity-0" : "opacity-100"
                    )}>
                        {role === 'student' ? 'Workspace' : 'Recruitment'}
                    </p>
                </div>
                {menu.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-[12px] font-bold transition-all duration-200 group relative',
                                isActive
                                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/10'
                                    : 'text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-sm'
                            )}
                        >
                            <item.icon className={cn(
                                "w-4.5 h-4.5 shrink-0 transition-transform group-hover:scale-110",
                                isActive ? "text-white" : "text-slate-400 group-hover:text-slate-900"
                            )} />
                            <AnimatePresence>
                                {!collapsed && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="whitespace-nowrap"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer Actions */}
            <div className="p-3 border-t border-[#EDE9E3] shrink-0">
                <Link
                    href="/"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[12px] font-bold text-slate-400 hover:bg-white hover:text-red-500 transition-all group hover:shadow-sm"
                >
                    <LogoutIcon className="w-4.5 h-4.5 shrink-0 group-hover:-translate-x-0.5 transition-transform" />
                    {!collapsed && <span>Sign Out</span>}
                </Link>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Hamburger Button */}
            <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden fixed bottom-6 right-6 z-50 w-12 h-12 bg-white rounded-full shadow-2xl border border-slate-100 text-slate-900 hover:text-primary flex items-center justify-center cursor-pointer active:scale-95 transition-all"
            >
                <MenuIcon className="w-5 h-5" />
            </button>

            {/* Mobile Drawer Overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="lg:hidden fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm"
                        onClick={() => setMobileOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Mobile Drawer */}
            <aside
                className={cn(
                    'lg:hidden fixed top-0 left-0 z-50 h-full bg-white border-r border-slate-100 shadow-2xl transform transition-transform duration-300 ease-in-out',
                    mobileOpen ? 'translate-x-0' : '-translate-x-full'
                )}
                style={{ width: '260px' }}
            >
                <button
                    onClick={() => setMobileOpen(false)}
                    className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 cursor-pointer z-50"
                >
                    <XIcon className="w-5 h-5" />
                </button>
                {sidebarContent}
            </aside>

            {/* Desktop Sidebar */}
            <motion.aside
                animate={{ width: collapsed ? 80 : 260 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="hidden lg:block fixed top-0 left-0 h-full bg-white border-r border-slate-50 z-30 overflow-hidden shadow-sm"
            >
                {/* Collapse Toggle */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-[76px] w-6 h-6 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-primary shadow-sm cursor-pointer z-50 hover:scale-110 transition-all active:scale-90"
                >
                    <LeftIcon className={cn('w-3 h-3 transition-transform', collapsed && 'rotate-180')} />
                </button>
                {sidebarContent}
            </motion.aside>
        </>
    );
}
