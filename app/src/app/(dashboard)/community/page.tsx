import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { communityPosts } from '@/lib/mockData';

export default function CommunityPage() {
    return (
        <div className="space-y-6 animate-slide-up">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-black">Community</h2>
                    <p className="text-sm text-black/60 mt-1">Share and discover opportunities, resources, and events.</p>
                </div>
                <Link href="/community/new">
                    <Button variant="primary" size="md">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Share Opportunity
                    </Button>
                </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {communityPosts.map((post) => (
                    <Card
                        key={post.id}
                        hover
                        className="bg-white border border-black/10 rounded-2xl shadow-sm"
                    >
                        <h3 className="font-semibold text-black mb-2 line-clamp-2">{post.title}</h3>
                        <p className="text-sm text-black/60 mb-3 line-clamp-3">{post.description}</p>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {post.tags.map((tag) => (
                                <span key={tag} className="px-2 py-0.5 rounded-full bg-primary-light text-primary text-xs font-medium">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-black/10">
                            <div className="text-xs text-black/50">
                                <span className="font-medium text-black">{post.postedBy}</span>
                                <span className="mx-1.5">·</span>
                                {post.postedDate}
                            </div>
                            <Link href={`/community/${post.id}`}>
                                <Button variant="ghost" size="sm">
                                    View
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Button>
                            </Link>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
