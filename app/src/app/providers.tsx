'use client';

import { HeroUIProvider } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { AuthProvider } from '@/lib/auth-context';

export function Providers({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    return (
        <AuthProvider>
            <HeroUIProvider navigate={router.push}>
                {children}
            </HeroUIProvider>
        </AuthProvider>
    );
}
