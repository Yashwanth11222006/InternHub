import React from 'react';
import Button from './Button';

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    message: string;
    actionLabel?: string;
    onAction?: () => void;
}

export default function EmptyState({ icon, title, message, actionLabel, onAction }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
            {icon ? (
                <div className="mb-4 text-muted-foreground">{icon}</div>
            ) : (
                <div className="w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
                    <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                </div>
            )}
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">{message}</p>
            {actionLabel && onAction && (
                <Button variant="primary" size="sm" onClick={onAction} className="mt-4">
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
