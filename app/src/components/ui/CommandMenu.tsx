'use client';

import * as React from 'react';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function CommandSearch() {
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground bg-muted hover:bg-muted/80 border border-border rounded-lg transition-all cursor-pointer"
            >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Search...</span>
                <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-white px-1.5 font-mono text-[10px] font-medium opacity-100">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </button>

            <AnimatePresence>
                {open && (
                    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-border overflow-hidden"
                        >
                            <div className="flex items-center px-4 border-b border-border">
                                <Search className="w-5 h-5 text-muted-foreground" />
                                <input
                                    autoFocus
                                    placeholder="Type to search internships, communities, or help..."
                                    className="flex-1 px-4 py-4 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                                />
                            </div>
                            <div className="max-h-[60vh] overflow-y-auto p-2">
                                <div className="px-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                    Quick Actions
                                </div>
                                {[
                                    { label: 'Browse Internships', icon: '🔍' },
                                    { label: 'My Applications', icon: '📝' },
                                    { label: 'Community Feed', icon: '👥' },
                                    { label: 'Edit Profile', icon: '👤' },
                                ].map((item) => (
                                    <button
                                        key={item.label}
                                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-xl transition-colors text-left"
                                    >
                                        <span className="w-8 h-8 flex items-center justify-center bg-muted rounded-lg text-lg">
                                            {item.icon}
                                        </span>
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                            <div className="p-4 bg-muted/30 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground">
                                <div className="flex gap-4">
                                    <span><kbd className="bg-white border px-1 rounded">Enter</kbd> to select</span>
                                    <span><kbd className="bg-white border px-1 rounded">↑↓</kbd> to navigate</span>
                                </div>
                                <span><kbd className="bg-white border px-1 rounded">ESC</kbd> to close</span>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
