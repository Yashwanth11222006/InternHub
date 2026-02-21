import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import { applications } from '@/lib/mockData';
import { notFound } from 'next/navigation';
import type { ApplicationStatus } from '@/lib/mockData';

interface Props {
    params: Promise<{ id: string }>;
}

const statusOrder: ApplicationStatus[] = ['Applied', 'Shortlisted', 'Interview', 'Selected'];

export default async function ApplicationDetailPage({ params }: Props) {
    const { id } = await params;
    const application = applications.find((a) => a.id === id);
    if (!application) return notFound();

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-slide-up">
            {/* ── Internship Summary ── */}
            <Card padding="lg">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-foreground">{application.internshipTitle}</h1>
                        <p className="text-muted-foreground mt-0.5">{application.company}</p>
                        <p className="text-xs text-muted-foreground mt-2">Applied on {application.appliedDate}</p>
                    </div>
                    <StatusBadge status={application.status} />
                </div>
            </Card>

            {/* ── Status Timeline ── */}
            <Card>
                <h2 className="text-lg font-semibold text-foreground mb-5">Application Timeline</h2>
                <div className="relative pl-6">
                    {/* Vertical Line */}
                    <div className="absolute left-[9px] top-1 bottom-1 w-0.5 bg-border" />

                    {application.timeline.map((step, i) => {
                        const isLatest = i === application.timeline.length - 1;
                        const isRejected = step.status === 'Rejected';
                        return (
                            <div key={i} className="relative pb-6 last:pb-0">
                                {/* Dot */}
                                <div className={`absolute left-[-15px] top-1 w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center
                  ${isRejected
                                        ? 'border-danger bg-danger-light'
                                        : isLatest
                                            ? 'border-primary bg-primary-light'
                                            : 'border-border bg-white'
                                    }`}>
                                    {isLatest && !isRejected && (
                                        <div className="w-2 h-2 rounded-full bg-primary" />
                                    )}
                                    {isRejected && (
                                        <svg className="w-2.5 h-2.5 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    )}
                                </div>
                                {/* Content */}
                                <div className="ml-4">
                                    <div className="flex items-center gap-2">
                                        <p className={`text-sm font-medium ${isRejected ? 'text-danger' : 'text-foreground'}`}>
                                            {step.status}
                                        </p>
                                        <span className="text-xs text-muted-foreground">{step.date}</span>
                                    </div>
                                    {step.note && (
                                        <p className="text-sm text-muted-foreground mt-0.5">{step.note}</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>

            {/* ── Cover Letter ── */}
            <Card>
                <h2 className="text-lg font-semibold text-foreground mb-3">Cover Letter</h2>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {application.coverLetter}
                </p>
            </Card>

            {/* ── Links ── */}
            <Card>
                <h2 className="text-lg font-semibold text-foreground mb-3">Attachments</h2>
                <div className="space-y-2">
                    {application.resumeUrl && (
                        <a href="#" className="flex items-center gap-2 text-sm text-primary hover:text-primary-hover">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                            Resume.pdf
                        </a>
                    )}
                    {application.portfolioLink && (
                        <a href={application.portfolioLink} target="_blank" className="flex items-center gap-2 text-sm text-primary hover:text-primary-hover">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-6.06a4.5 4.5 0 00-6.364 0l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                            </svg>
                            Portfolio Link
                        </a>
                    )}
                </div>
            </Card>
        </div>
    );
}
