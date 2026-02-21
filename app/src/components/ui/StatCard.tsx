'use client';

import React from 'react';
import Card from './Card';
import { cn } from '@/lib/utils';

interface StatCardProps {
    label: string;
    value: number | string;
    accentColor?: string;
    icon?: React.ReactNode;
    delay?: number;
}

export default function StatCard({ label, value, accentColor, icon, delay = 0 }: StatCardProps) {
    return (
        <Card hover padding="none" delay={delay} className="relative overflow-hidden">
            <div className={cn('absolute top-0 left-0 w-1 h-full rounded-l-[var(--radius-lg)]', accentColor || 'bg-primary')} />
            <div className="flex items-start justify-between p-5">
                <div>
                    <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
                    <p className="text-sm font-medium text-muted-foreground mt-1">{label}</p>
                </div>
                {icon && (
                    <div className="p-2 rounded-xl bg-muted/50 text-muted-foreground">
                        {icon}
                    </div>
                )}
            </div>
        </Card>
    );
}
