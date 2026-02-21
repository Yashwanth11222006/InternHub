import React from 'react';

interface SkeletonLoaderProps {
    className?: string;
    lines?: number;
    circle?: boolean;
}

export default function SkeletonLoader({ className = '', lines = 1, circle = false }: SkeletonLoaderProps) {
    if (circle) {
        return <div className={`skeleton rounded-full w-10 h-10 ${className}`} />;
    }
    return (
        <div className="flex flex-col gap-2.5">
            {Array.from({ length: lines }).map((_, i) => (
                <div
                    key={i}
                    className={`skeleton h-4 ${i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'} ${className}`}
                />
            ))}
        </div>
    );
}
