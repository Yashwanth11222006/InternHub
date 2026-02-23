'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAuthContext } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import {
    Shield,
    Building2,
    CheckCircle,
    XCircle,
    Clock,
    AlertTriangle,
    RefreshCw,
    ExternalLink,
    Users,
    Briefcase,
} from 'lucide-react';

interface Criterion {
    key: string;
    label: string;
    passed: boolean;
    weight: number;
}

interface Recruiter {
    id: string;
    recruiter_name: string;
    company_name: string;
    company_website: string | null;
    company_description: string | null;
    company_logo_url: string | null;
    email: string | null;
    account_status: string | null;
    is_verified: boolean;
    verification_status: string;
    registered_at: string;
    last_updated_at: string;
    internships_posted: number;
    approval_criteria: Criterion[];
    profile_score: number;
    admin_recommendation: string;
}

interface Summary {
    total: number;
    pending: number;
    approved: number;
    suspended: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function AdminPage() {
    const router = useRouter();
    const { user, userRole, loading: authLoading, session } = useAuthContext();
    const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
    const [summary, setSummary] = useState<Summary | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'suspended'>('all');

    // Fetch recruiters
    const fetchRecruiters = async () => {
        if (!session?.access_token) return;

        try {
            const res = await fetch(`${API_URL}/api/admin/recruiters`, {
                headers: { Authorization: `Bearer ${session.access_token}` },
            });

            if (res.status === 401 || res.status === 403) {
                router.push('/login');
                return;
            }

            const json = await res.json();
            if (res.ok) {
                setSummary(json.summary);
                setRecruiters(json.recruiters);
            }
        } catch (err) {
            console.error('Failed to fetch recruiters:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            router.push('/login');
            return;
        }

        if (userRole !== 'admin') {
            router.push('/home');
            return;
        }

        fetchRecruiters();
    }, [user, userRole, authLoading, session, router]);

    // Update recruiter (approve/revoke/suspend/unsuspend)
    const updateRecruiter = async (id: string, body: Record<string, unknown>) => {
        if (!session?.access_token) return;

        setActionLoading(id);

        try {
            const res = await fetch(`${API_URL}/api/admin/recruiters/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify(body),
            });

            const json = await res.json();
            if (!res.ok) {
                alert(json.error ?? 'Action failed.');
                return;
            }

            // Refresh the list
            await fetchRecruiters();
        } catch {
            alert('Network error. Please try again.');
        } finally {
            setActionLoading(null);
        }
    };

    const getScoreColor = (score: number) =>
        score >= 80 ? 'text-green-600' : score >= 50 ? 'text-yellow-600' : 'text-red-600';

    const getScoreBg = (score: number) =>
        score >= 80 ? 'bg-green-100' : score >= 50 ? 'bg-yellow-100' : 'bg-red-100';

    // Filter recruiters
    const filteredRecruiters = recruiters.filter((rec) => {
        if (filter === 'pending') return !rec.is_verified && rec.account_status !== 'suspended';
        if (filter === 'approved') return rec.is_verified;
        if (filter === 'suspended') return rec.account_status === 'suspended';
        return true;
    });

    if (authLoading || loading) {
        return (
            <div className="space-y-6 animate-slide-up">
                <div className="flex items-center gap-3">
                    <Shield className="w-8 h-8 text-primary" />
                    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                </div>
                <Card className="p-8">
                    <div className="flex flex-col gap-4">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="h-32 animate-pulse bg-slate-100 rounded-lg" />
                        ))}
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Shield className="w-8 h-8 text-primary" />
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
                        <p className="text-sm text-muted-foreground">Manage recruiter verifications</p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchRecruiters}
                    className="flex items-center gap-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </Button>
            </div>

            {/* Summary Cards */}
            {summary && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card
                        className={`p-4 cursor-pointer transition-all ${filter === 'all' ? 'ring-2 ring-primary' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 rounded-lg">
                                <Users className="w-5 h-5 text-slate-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{summary.total}</p>
                                <p className="text-xs text-muted-foreground">Total Recruiters</p>
                            </div>
                        </div>
                    </Card>
                    <Card
                        className={`p-4 cursor-pointer transition-all ${filter === 'pending' ? 'ring-2 ring-yellow-500' : ''}`}
                        onClick={() => setFilter('pending')}
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <Clock className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-yellow-600">{summary.pending}</p>
                                <p className="text-xs text-muted-foreground">Pending Review</p>
                            </div>
                        </div>
                    </Card>
                    <Card
                        className={`p-4 cursor-pointer transition-all ${filter === 'approved' ? 'ring-2 ring-green-500' : ''}`}
                        onClick={() => setFilter('approved')}
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-green-600">{summary.approved}</p>
                                <p className="text-xs text-muted-foreground">Approved</p>
                            </div>
                        </div>
                    </Card>
                    <Card
                        className={`p-4 cursor-pointer transition-all ${filter === 'suspended' ? 'ring-2 ring-red-500' : ''}`}
                        onClick={() => setFilter('suspended')}
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-red-600">{summary.suspended}</p>
                                <p className="text-xs text-muted-foreground">Suspended</p>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* Recruiters List */}
            {filteredRecruiters.length === 0 ? (
                <Card className="p-8 text-center">
                    <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                        {filter === 'all' ? 'No recruiters registered yet.' : `No ${filter} recruiters.`}
                    </p>
                </Card>
            ) : (
                <div className="space-y-4">
                    {filteredRecruiters.map((rec) => (
                        <Card key={rec.id} className="p-6">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
                                        <Building2 className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground">{rec.company_name}</h3>
                                        <p className="text-sm text-muted-foreground">Contact: {rec.recruiter_name}</p>
                                        <p className="text-sm text-muted-foreground">{rec.email ?? 'No email'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {rec.account_status === 'suspended' && (
                                        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                                            Suspended
                                        </span>
                                    )}
                                    <span
                                        className={`px-2 py-1 text-xs font-medium rounded-full ${rec.is_verified
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                            }`}
                                    >
                                        {rec.is_verified ? '✓ Approved' : '⏳ Pending'}
                                    </span>
                                </div>
                            </div>

                            {/* Company Details */}
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div className="space-y-2 text-sm">
                                    {rec.company_website ? (
                                        <a
                                            href={rec.company_website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-primary hover:underline"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            {rec.company_website}
                                        </a>
                                    ) : (
                                        <p className="text-red-500 flex items-center gap-2">
                                            <XCircle className="w-4 h-4" />
                                            No website provided
                                        </p>
                                    )}
                                    {rec.company_description ? (
                                        <p className="text-muted-foreground line-clamp-2">{rec.company_description}</p>
                                    ) : (
                                        <p className="text-red-500 flex items-center gap-2">
                                            <XCircle className="w-4 h-4" />
                                            No description provided
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2 text-sm text-muted-foreground">
                                    <p>Registered: {new Date(rec.registered_at).toLocaleDateString()}</p>
                                    <p className="flex items-center gap-2">
                                        <Briefcase className="w-4 h-4" />
                                        {rec.internships_posted} internships posted
                                    </p>
                                </div>
                            </div>

                            {/* Approval Criteria */}
                            <div className="bg-slate-50 rounded-lg p-4 mb-4">
                                <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                                    Approval Criteria
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {rec.approval_criteria.map((c) => (
                                        <div
                                            key={c.key}
                                            className={`flex items-center gap-2 text-sm p-2 rounded ${c.passed ? 'bg-green-50' : 'bg-red-50'
                                                }`}
                                        >
                                            {c.passed ? (
                                                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                            ) : (
                                                <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                                            )}
                                            <span className={c.passed ? 'text-green-700' : 'text-red-600'}>
                                                {c.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className={`font-bold ${getScoreColor(rec.profile_score)}`}>
                                            Score: {rec.profile_score}/100
                                        </span>
                                        <span className={`text-xs px-2 py-0.5 rounded ${getScoreBg(rec.profile_score)}`}>
                                            {rec.admin_recommendation}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-3">
                                {!rec.is_verified ? (
                                    <Button
                                        variant="default"
                                        size="sm"
                                        disabled={actionLoading === rec.id}
                                        onClick={() => updateRecruiter(rec.id, { is_verified: true })}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        {actionLoading === rec.id ? (
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                        )}
                                        Approve
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={actionLoading === rec.id}
                                        onClick={() => updateRecruiter(rec.id, { is_verified: false })}
                                        className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                                    >
                                        {actionLoading === rec.id ? (
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <RefreshCw className="w-4 h-4 mr-1" />
                                        )}
                                        Revoke Approval
                                    </Button>
                                )}

                                {rec.account_status !== 'suspended' ? (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={actionLoading === rec.id}
                                        onClick={() => updateRecruiter(rec.id, { suspend: true })}
                                        className="border-red-500 text-red-600 hover:bg-red-50"
                                    >
                                        {actionLoading === rec.id ? (
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <AlertTriangle className="w-4 h-4 mr-1" />
                                        )}
                                        Suspend
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={actionLoading === rec.id}
                                        onClick={() => updateRecruiter(rec.id, { suspend: false })}
                                        className="border-blue-500 text-blue-600 hover:bg-blue-50"
                                    >
                                        {actionLoading === rec.id ? (
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <RefreshCw className="w-4 h-4 mr-1" />
                                        )}
                                        Unsuspend
                                    </Button>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
