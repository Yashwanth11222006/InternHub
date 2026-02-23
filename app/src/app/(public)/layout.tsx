'use client';

import Navbar from '@/components/layout/Navbar';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Hide navbar on auth pages
    const isAuthPage = pathname === '/login' ||
        pathname === '/signup' ||
        pathname?.startsWith('/signup/');

    if (!mounted) return null;

    return (
        <div>
            {!isAuthPage && <Navbar />}
            {children}
        </div>
    );
}
