'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { usePathname } from 'next/navigation';
import BoxLoader from '@/components/ui/box-loader';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingContext = createContext({
    isManualLoading: false,
    setIsManualLoading: (val: boolean) => { }
});

export const useLoading = () => useContext(LoadingContext);

export default function PageTransitionProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(false);
    const [displayChildren, setDisplayChildren] = useState(children);

    useEffect(() => {
        // Start loading on every pathname change
        setIsLoading(true);

        // After 5 seconds, swap children and stop loading
        const timer = setTimeout(() => {
            setDisplayChildren(children);
            setIsLoading(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, [pathname]);

    // Keep displayChildren updated if children themselves change (without pathname change)
    useEffect(() => {
        if (!isLoading) {
            setDisplayChildren(children);
        }
    }, [children, isLoading]);

    return (
        <LoadingContext.Provider value={{ isManualLoading: isLoading, setIsManualLoading: setIsLoading }}>
            <AnimatePresence mode="wait">
                {isLoading && (
                    <motion.div
                        key="loader-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-background"
                    >
                        <BoxLoader />
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="mt-12 text-blue-500 font-medium tracking-widest uppercase text-xs"
                        >
                            Syncing with InternHub Network
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                key={pathname}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: isLoading ? 0 : 1, scale: isLoading ? 0.98 : 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                {displayChildren}
            </motion.div>
        </LoadingContext.Provider>
    );
}
