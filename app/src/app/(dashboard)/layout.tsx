'use client';

import Sidebar from '@/components/layout/Sidebar';
import StudentNavbar from '@/components/layout/StudentNavbar';
import TopBar from '@/components/layout/TopBar';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

function getRole(pathname: string): 'student' | 'recruiter' {
    if (pathname.includes('/recruiter')) {
        return 'recruiter';
    }
    return 'student';
}

function getUserName(role: 'student' | 'recruiter'): string {
    return role === 'recruiter' ? 'Priya Sharma' : 'Arjun Mehta';
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const role = getRole(pathname);
    const userName = getUserName(role);

    // Sidebar logic for students: only on specific management pages
    const studentSidebarRoutes = ['/dashboard', '/activity', '/profile'];
    const showSidebar = role === 'recruiter' || studentSidebarRoutes.includes(pathname);

    // For students, the floating navbar is for non-workspace pages (Home, Community, Internships)
    const showStudentNavbar = role === 'student' && !showSidebar;
    // Workspace pages (Dashboard, Activity, Profile) get a stable TopBar
    const showStudentTopBar = role === 'student' && showSidebar;

    // Home page gets a full-screen treatment (image goes behind navbar)
    const isHomePage = pathname === '/home';

    return (
        <div className="min-h-screen bg-[#FAF9F6] flex flex-col">
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

                    {/* Consistent TopBar for Workspace Pages (Student or Recruiter) */}
                    {(role === 'recruiter' || showStudentTopBar) && (
                        <TopBar
                            title={role === 'recruiter' ? 'Recruiter Hub' : 'Student Workspace'}
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
