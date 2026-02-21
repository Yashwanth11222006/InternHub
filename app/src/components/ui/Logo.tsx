"use client"

import React from 'react';
import { Briefcase } from 'lucide-react';

export function Logo({ className = "", size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
    const sizes = {
        sm: "w-6 h-6",
        md: "w-9 h-9",
        lg: "w-12 h-12"
    };

    const iconSizes = {
        sm: "w-3.5 h-3.5",
        md: "w-5.5 h-5.5",
        lg: "w-7 h-7"
    };

    return (
        <div className={`flex items-center gap-2.5 ${className}`}>
            <div className={`${sizes[size]} bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 transition-transform hover:scale-105`}>
                <Briefcase className={`${iconSizes[size]} text-white`} />
            </div>
            <span className={`font-bold text-foreground tracking-tight ${size === "sm" ? "text-lg" : size === "md" ? "text-xl" : "text-3xl"}`}>
                InternHub
            </span>
        </div>
    );
}
