'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import EmptyState from '@/components/ui/EmptyState';
import { api, Application } from '@/lib/api';

export default function ApplicationsPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const data = await api.applications.getMyApplications();
                setApplications(data);
            } catch (err) {
                console.error('Error fetching applications:', err);
                setError(err instanceof Error ? err.message : 'Failed to load applications');
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="space-y-6 animate-slide-up">
                <div>
                    <h2 className="text-xl font-bold text-foreground">My Applications</h2>
                    <p className="text-sm text-muted-foreground mt-1">Track all your internship applications.</p>
                </div>
                <Card padding="sm" className="overflow-x-auto">
                    <div className="flex flex-col gap-4 p-4">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="h-16 animate-pulse bg-slate-100 rounded-lg" />
                        ))}
                    </div>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6 animate-slide-up">
                <Card className="text-center py-12">
                    <p className="text-danger">{error}</p>
                </Card>
            </div>
        );
    }

    if (applications.length === 0) {
        return (
            <EmptyState
                title="No applications yet"
                message="You haven't applied to any internships yet. Browse available internships to get started."
                actionLabel="Browse Internships"
            />
        );
    }

    return (
        <div className="space-y-6 animate-slide-up">
            <div>
                <h2 className="text-xl font-bold text-foreground">My Applications</h2>
                <p className="text-sm text-muted-foreground mt-1">Track all your internship applications.</p>
            </div>

            {/* Desktop Table */}
            <Card padding="sm" className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Internship</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Company</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Location</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Applied Date</th>
                            <th className="text-right py-3 px-4 font-medium text-muted-foreground"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((app) => (
                            <tr key={app.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                                <td className="py-3 px-4 font-medium text-foreground">
                                    {app.internships?.title || 'Unknown Internship'}
                                </td>
                                <td className="py-3 px-4 text-muted-foreground">
                                    {app.company_name || 'Company'}
                                </td>
                                <td className="py-3 px-4 text-muted-foreground">
                                    {app.internships?.location || 'Remote'}
                                </td>
                                <td className="py-3 px-4">
                                    <StatusBadge status={app.status} />
                                </td>
                                <td className="py-3 px-4 text-muted-foreground">{formatDate(app.applied_at)}</td>
                                <td className="py-3 px-4 text-right">
                                    <Link href={`/applications/${app.id}`} className="text-primary hover:text-primary-hover font-medium">
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

            {/* Mobile Cards */}
            <div className="sm:hidden space-y-3">
                {applications.map((app) => (
                    <Link key={app.id} href={`/applications/${app.id}`}>
                        <Card hover className="mb-3">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-medium text-foreground">
                                        {app.internships?.title || 'Unknown Internship'}
                                    </h3>
                                    <p className="text-sm font-medium text-primary">
                                        {app.company_name || 'Company'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {app.internships?.location || 'Remote'}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Applied: {formatDate(app.applied_at)}
                                    </p>
                                </div>
                                <StatusBadge status={app.status} />
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
