'use client';

import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export default function TextArea({
    label,
    error,
    id,
    className = '',
    ...props
}: TextAreaProps) {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label htmlFor={inputId} className="text-sm font-medium text-foreground">
                    {label}
                </label>
            )}
            <textarea
                id={inputId}
                className={`
          w-full px-3.5 py-2.5 text-sm rounded-[var(--radius)] border
          bg-white text-foreground placeholder:text-muted-foreground
          transition-colors duration-150 resize-y min-h-[100px]
          focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
          ${error ? 'border-danger' : 'border-input-border'}
          disabled:opacity-50 disabled:bg-muted
          ${className}
        `}
                {...props}
            />
            {error && <p className="text-xs text-danger">{error}</p>}
        </div>
    );
}
