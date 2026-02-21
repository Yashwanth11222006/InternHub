'use client';

import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 animate-fade-in" />

            {/* Dialog */}
            <div
                className="relative bg-white rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] w-full max-w-md animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-border">
                    <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-[var(--radius-sm)] text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-5">{children}</div>

                {/* Footer */}
                {footer && (
                    <div className="flex items-center justify-end gap-2 p-5 border-t border-border">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
