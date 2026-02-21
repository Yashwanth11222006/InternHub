'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLMotionProps<'div'> {
    children: React.ReactNode;
    hover?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    delay?: number;
}

const paddingMap = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
};

export default function Card({
    children,
    className = '',
    hover = false,
    padding = 'md',
    delay = 0,
    ...props
}: CardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay }}
            className={cn(
                'bg-card rounded-[var(--radius-lg)] border border-border shadow-[var(--shadow)]',
                hover && 'transition-all duration-150 hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5',
                paddingMap[padding],
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
}
