'use client';

import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    icon?: React.ReactNode;
}

export default function InputField({
    label,
    error,
    helperText,
    icon,
    id,
    className = '',
    ...props
}: InputFieldProps) {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
        <div className="flex flex-col gap-2">
            {label && (
                <label htmlFor={inputId} className="text-[12px] font-bold text-foreground/60 uppercase tracking-widest px-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                {icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-primary pointer-events-none">
                        {icon}
                    </div>
                )}
                <input
                    id={inputId}
                    className={`
                        w-full ${icon ? 'pl-11' : 'px-5'} py-4 text-[14px] font-medium rounded-2xl border
                        bg-white text-foreground placeholder:text-muted-foreground/40
                        transition-all duration-200
                        focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary
                        ${error ? 'border-danger' : 'border-primary/10'}
                        disabled:opacity-50 disabled:bg-muted
                        ${className}
                    `}
                    {...props}
                />
            </div>
            {error && <p className="text-xs text-danger font-medium px-1 flex items-center gap-1.5 mt-0.5">{error}</p>}
            {helperText && !error && <p className="text-xs text-muted-foreground font-medium px-1 mt-0.5">{helperText}</p>}
        </div>
    );
}
