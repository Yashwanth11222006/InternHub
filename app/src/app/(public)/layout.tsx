'use client';

import Navbar from '@/components/layout/Navbar';
import { usePathname } from 'next/navigation';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname === '/login' || pathname === '/signup';

    return (
        <div className="min-h-screen flex flex-col">
            {!isAuthPage && <Navbar />}
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}
