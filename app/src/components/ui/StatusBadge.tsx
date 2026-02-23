import React from 'react';

// Support both old mock data format (capitalized) and API format (lowercase)
type StatusType =
    | 'Applied' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected' | 'offered'
    | 'applied' | 'shortlisted' | 'interview' | 'accepted' | 'rejected';

interface StatusBadgeProps {
    status: StatusType | string;
    className?: string;
}

const getStatusStyle = (status: string): string => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
        case 'applied':
            return 'bg-gray-100 text-gray-700';
        case 'shortlisted':
            return 'bg-blue-50 text-blue-700';
        case 'interview':
            return 'bg-orange-50 text-orange-700';
        case 'selected':
        case 'accepted':
        case 'offered':
            return 'bg-green-50 text-green-700';
        case 'rejected':
            return 'bg-red-50 text-red-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

const formatStatus = (status: string): string => {
    // Capitalize first letter
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
    return (
        <span
            className={`
        inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
        ${getStatusStyle(status)}
        ${className}
      `}
        >
            {formatStatus(status)}
        </span>
    );
}
