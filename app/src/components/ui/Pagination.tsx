'use client';

import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex items-center justify-center gap-1">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium rounded-[var(--radius-sm)] text-muted-foreground hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
                Previous
            </button>
            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`
            w-9 h-9 text-sm font-medium rounded-[var(--radius-sm)] transition-colors cursor-pointer
            ${page === currentPage
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-secondary'}
          `}
                >
                    {page}
                </button>
            ))}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium rounded-[var(--radius-sm)] text-muted-foreground hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
                Next
            </button>
        </div>
    );
}
