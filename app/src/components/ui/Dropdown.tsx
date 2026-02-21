'use client';

import React, { useState, useRef, useEffect } from 'react';

interface DropdownItem {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    danger?: boolean;
}

interface DropdownProps {
    trigger: React.ReactNode;
    items: DropdownItem[];
    align?: 'left' | 'right';
}

export default function Dropdown({ trigger, items, align = 'right' }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
                {trigger}
            </div>
            {isOpen && (
                <div
                    className={`
            absolute top-full mt-1.5 z-50 min-w-[180px]
            bg-white rounded-[var(--radius)] border border-border shadow-[var(--shadow-lg)]
            py-1 animate-slide-down
            ${align === 'right' ? 'right-0' : 'left-0'}
          `}
                >
                    {items.map((item, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                item.onClick();
                                setIsOpen(false);
                            }}
                            className={`
                w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-left
                transition-colors cursor-pointer
                ${item.danger
                                    ? 'text-danger hover:bg-danger-light'
                                    : 'text-foreground hover:bg-secondary'}
              `}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
