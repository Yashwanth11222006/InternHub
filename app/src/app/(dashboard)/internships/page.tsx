'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Pagination from '@/components/ui/Pagination';
import { api, Internship } from '@/lib/api';

const ITEMS_PER_PAGE = 4;

export default function InternshipsPage() {
    const [search, setSearch] = useState('');
    const [durationFilter, setDurationFilter] = useState('');
    const [openOnly, setOpenOnly] = useState(false);
    const [page, setPage] = useState(1);
    const [internshipsList, setInternshipsList] = useState<(Internship & { isOpen: boolean; skills: string[] })[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    React.useEffect(() => {
        const fetchInternships = async () => {
            try {
                const data = await api.internships.getAll();

                if (data) {
                    const processed = data.map(internship => ({
                        ...internship,
                        company: internship.company || 'Individual Recruiter',
                        isOpen: internship.status === 'open',
                        applicantCount: internship.applicant_count || 0,
                        skills: internship.skills_required || []
                    }));
                    setInternshipsList(processed);
                }
            } catch (err) {
                console.error('Error fetching internships:', err);
                setError(err instanceof Error ? err.message : 'Failed to load internships');
            } finally {
                setLoading(false);
            }
        };
        fetchInternships();
    }, []);

    const filtered = useMemo(() => {
        return internshipsList.filter((i) => {
            const matchesSearch =
                i.title.toLowerCase().includes(search.toLowerCase()) ||
                i.company.toLowerCase().includes(search.toLowerCase()) ||
                i.skills.some((s: string) => s.toLowerCase().includes(search.toLowerCase()));
            const matchesDuration = !durationFilter || (i.duration && i.duration.includes(durationFilter));
            const matchesOpen = !openOnly || i.isOpen;
            return matchesSearch && matchesDuration && matchesOpen;
        });
    }, [search, durationFilter, openOnly, internshipsList]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    return (
        <div className="space-y-6 animate-slide-up">
            {/* ── Search ── */}
            <div className="relative">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    placeholder="Search internships by title, company, or skill..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="w-full pl-11 pr-4 py-3 text-sm rounded-[var(--radius)] border border-input-border bg-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
                />
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* ── Filters (Desktop Sidebar) ── */}
                <aside className="lg:w-60 shrink-0 space-y-5">
                    <Card padding="md">
                        <h3 className="text-sm font-semibold text-foreground mb-3">Filters</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-medium text-muted-foreground">Duration</label>
                                <select
                                    value={durationFilter}
                                    onChange={(e) => { setDurationFilter(e.target.value); setPage(1); }}
                                    className="w-full mt-1.5 px-3 py-2 text-sm rounded-[var(--radius-sm)] border border-input-border bg-white focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
                                >
                                    <option value="">All</option>
                                    <option value="2 months">2 months</option>
                                    <option value="3 months">3 months</option>
                                    <option value="4 months">4 months</option>
                                    <option value="6 months">6 months</option>
                                </select>
                            </div>

                            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={openOnly}
                                    onChange={(e) => { setOpenOnly(e.target.checked); setPage(1); }}
                                    className="rounded border-input-border"
                                />
                                Open positions only
                            </label>
                        </div>
                    </Card>
                </aside>

                <div className="flex-1 space-y-4">
                    {loading ? (
                        <div className="flex flex-col gap-4">
                            {[1, 2, 3].map((n) => (
                                <Card key={n} className="h-32 animate-pulse bg-slate-50">
                                    <div />
                                </Card>
                            ))}
                        </div>
                    ) : paginated.length === 0 ? (
                        <Card className="text-center py-12">
                            <p className="text-muted-foreground">No internships found matching your criteria.</p>
                        </Card>
                    ) : (
                        paginated.map((internship) => (
                            <Card key={internship.id} hover>
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-semibold text-foreground text-base">{internship.title}</h3>
                                            {!internship.isOpen && (
                                                <span className="text-xs text-danger bg-danger-light px-2 py-0.5 rounded-full font-medium">Closed</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">{internship.company}</p>
                                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {internship.duration}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                                </svg>
                                                {internship.location}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                                                </svg>
                                                {internship.stipend}
                                            </span>
                                            <span>Deadline: {internship.deadline}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5 mt-3">
                                            {internship.skills.map((skill: string) => (
                                                <span key={skill} className="px-2 py-0.5 rounded-full bg-primary-light text-primary text-xs font-medium">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="sm:text-right shrink-0">
                                        <p className="text-xs text-muted-foreground mb-2">{internship.applicantCount} applicants</p>
                                        <Link href={`/internships/${internship.id}`}>
                                            <Button variant="primary" size="sm" disabled={!internship.isOpen}>
                                                {internship.isOpen ? 'View & Apply' : 'Closed'}
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="pt-4">
                            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
