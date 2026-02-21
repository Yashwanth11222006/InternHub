import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { communityPosts } from '@/lib/mockData';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface Props {
    params: Promise<{ id: string }>;
}

export default async function CommunityPostDetailPage({ params }: Props) {
    const { id } = await params;
    const post = communityPosts.find((p) => p.id === id);
    if (!post) return notFound();

    return (
        <div className="max-w-2xl mx-auto animate-slide-up">
            <Link href="/community" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Community
            </Link>

            <Card padding="lg">
                <h1 className="text-2xl font-bold text-foreground mb-3">{post.title}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <span className="font-medium text-foreground">{post.postedBy}</span>
                    <span>·</span>
                    <span>{post.postedDate}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags.map((tag) => (
                        <span key={tag} className="px-2.5 py-1 rounded-full bg-primary-light text-primary text-xs font-medium">
                            {tag}
                        </span>
                    ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {post.description}
                </p>
                {post.link && (
                    <div className="mt-6 pt-4 border-t border-border">
                        <a href={post.link} target="_blank" rel="noopener noreferrer">
                            <Button variant="primary" size="md">
                                Visit Link
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                </svg>
                            </Button>
                        </a>
                    </div>
                )}
            </Card>
        </div>
    );
}
