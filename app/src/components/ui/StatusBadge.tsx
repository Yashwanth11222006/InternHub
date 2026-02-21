import React from 'react';
import { ApplicationStatus } from '@/lib/mockData';

interface StatusBadgeProps {
    status: ApplicationStatus;
    className?: string;
}

const statusStyles: Record<ApplicationStatus, string> = {
    Applied: 'bg-gray-100 text-gray-700',
    Shortlisted: 'bg-blue-50 text-blue-700',
    Interview: 'bg-orange-50 text-orange-700',
    Selected: 'bg-green-50 text-green-700',
    offered: 'bg-green-50 text-green-700',
    Rejected: 'bg-red-50 text-red-700',
};

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
    return (
        <span
            className={`
        inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
        ${statusStyles[status]}
        ${className}
      `}
        >
            {status}
        </span>
    );
}
