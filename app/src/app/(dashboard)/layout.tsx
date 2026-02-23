"use client";

import React, { useEffect, useState } from "react";
import Sidebar from '@/components/layout/Sidebar';
import StudentNavbar from '@/components/layout/StudentNavbar';
import TopBar from '@/components/layout/TopBar';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuthContext } from '@/lib/auth-context';

function getRole(pathname: string): 'student' | 'recruiter' | 'admin' {
    if (pathname.includes('/recruiter')) {
        return 'recruiter';
    }
    if (pathname.includes('/admin')) {
        return 'admin';
    }
    return 'student';
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const role = getRole(pathname);
    const { profile, user, loading: authLoading, userRole } = useAuthContext();
    const [userName, setUserName] = useState<string>('');

    // Role-based access guard: redirect users to their correct dashboard
    useEffect(() => {
        if (authLoading) return;

        // Not logged in → send to login
        if (!user) {
            router.push('/login');
            return;
        }

        // If user is accessing a section they don't belong to, redirect them
        if (userRole && role !== userRole) {
            switch (userRole) {
                case 'admin':
                    router.push('/admin');
                    break;
                case 'recruiter':
                    router.push('/recruiter/dashboard');
                    break;
                case 'student':
                    router.push('/home');
                    break;
            }
        }
    }, [authLoading, user, userRole, role, router]);

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            setUserName(role === 'recruiter' ? 'Recruiter' : role === 'admin' ? 'Admin' : 'Student');
            return;
        }

        if (profile) {
            if (role === 'admin') {
                setUserName(profile.name || user.email?.split('@')[0] || 'Admin');
            } else if (role === 'recruiter' && profile.profile && 'recruiter_name' in profile.profile) {
                setUserName(profile.profile.recruiter_name || user.email?.split('@')[0] || 'Recruiter');
            } else if (role === 'student' && profile.profile && 'full_name' in profile.profile) {
                setUserName(profile.profile.full_name || user.email?.split('@')[0] || 'Student');
            } else {
                setUserName(user.email?.split('@')[0] || (role === 'recruiter' ? 'Recruiter' : role === 'admin' ? 'Admin' : 'Student'));
            }
        } else {
            setUserName(user.email?.split('@')[0] || (role === 'recruiter' ? 'Recruiter' : role === 'admin' ? 'Admin' : 'Student'));
        }
    }, [profile, user, role, authLoading]);

    // Sidebar logic for students: only on specific management pages
    const studentSidebarRoutes = ['/dashboard', '/activity', '/profile'];
    const showSidebar = role === 'admin' || role === 'recruiter' || studentSidebarRoutes.includes(pathname);

    // For students, the floating navbar is for non-workspace pages (Home, Community, Internships)
    const showStudentNavbar = role === 'student' && !showSidebar;
    // Workspace pages (Dashboard, Activity, Profile) get a stable TopBar
    const showStudentTopBar = role === 'student' && showSidebar;

    // Home page gets a full-screen treatment (image goes behind navbar)
    const isHomePage = pathname === '/home';

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Floating Top Navigation for Students */}
            {showStudentNavbar && <StudentNavbar userName={userName} />}

            <div className="flex-1 flex flex-row relative">
                {/* Sidebar - Conditional */}
                {showSidebar && (
                    <div className="shrink-0">
                        <Sidebar role={role} />
                    </div>
                )}

                {/* Main Content Area */}
                <main className={cn(
                    "flex-1 transition-all duration-300 w-full relative",
                    showSidebar ? "lg:pl-[260px]" : ""
                )}>
                    {/* Consistent Spacer for Students (except Home page for behind-navbar effect) */}
                    {showStudentNavbar && !isHomePage && <div className="h-24 md:h-32 w-full shrink-0" />}

                    {/* Consistent TopBar for Workspace Pages (Student, Recruiter, or Admin) */}
                    {(role === 'admin' || role === 'recruiter' || showStudentTopBar) && (
                        <TopBar
                            title={role === 'admin' ? 'Admin Panel' : role === 'recruiter' ? 'Recruiter Hub' : 'Student Workspace'}
                            userName={userName}
                            showHomeButton={showStudentTopBar}
                        />
                    )}

                    <div className={cn(
                        "mx-auto w-full flex-1",
                        showSidebar ? "max-w-7xl p-6 md:p-10" : isHomePage ? "" : "px-2 md:px-4 lg:px-6"
                    )}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={pathname}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.1 }}
                            >
                                {children}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </div>
    );
}
