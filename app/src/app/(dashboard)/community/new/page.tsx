'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Send,
    X,
    Hash,
    Type,
    Link as LinkIcon,
    AlignLeft,
    AlertCircle,
    ArrowLeft
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import InputField from '@/components/ui/InputField';
import TextArea from '@/components/ui/TextArea';
import TagInput from '@/components/ui/TagInput';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function NewPostPage() {
    const router = useRouter();
    const [tags, setTags] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [company, setCompany] = useState('');
    const [externalLink, setExternalLink] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }

            const { error } = await supabase.from('community_posts').insert([{
                posted_by: user.id,
                title,
                description,
                company,
                external_link: externalLink,
                tags
            }]);

            if (error) throw error;

            router.push('/community');
        } catch (error: any) {
            alert(error.message || 'Error creating post');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-10 pb-20">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-3 bg-white border border-border rounded-2xl shadow-sm text-muted-foreground hover:text-primary transition-all cursor-pointer"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight">Create Community Post</h1>
                    <p className="text-muted-foreground font-medium">Share opportunities, news, or advice with the community.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <Card className="p-10 border-none shadow-sm bg-white rounded-[40px] space-y-8">
                    <InputField
                        label="Post Title"
                        placeholder="e.g. Tips for Landing Your First Developer Internship"
                        icon={<Type className="w-4 h-4" />}
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <InputField
                        label="Company (Optional)"
                        placeholder="e.g. Google, Microsoft..."
                        icon={<Hash className="w-4 h-4" />}
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                    />

                    <div>
                        <label className="text-sm font-black text-foreground uppercase tracking-[0.1em] mb-3 block">Relevant Tags</label>
                        <TagInput
                            tags={tags}
                            onChange={setTags}
                            placeholder="Add tags like #tips, #fyi, #hiring..."
                        />
                    </div>

                    <TextArea
                        label="Content"
                        placeholder="Write your post here... Use markdown or plain text."
                        rows={10}
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <InputField
                        label="External Link (Optional)"
                        placeholder="https://example.com/more-info"
                        icon={<LinkIcon className="w-4 h-4" />}
                        value={externalLink}
                        onChange={(e) => setExternalLink(e.target.value)}
                    />
                </Card>

                <div className="bg-amber-50 rounded-2xl p-6 flex gap-4 border border-amber-100/50">
                    <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
                    <p className="text-sm text-amber-800 font-medium">
                        Remember to be respectful and helpful. Posts that violate community guidelines will be removed.
                    </p>
                </div>

                <div className="flex gap-4">
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="flex-1 h-14 rounded-[20px] font-black text-lg shadow-2xl shadow-primary/20"
                        loading={isSubmitting}
                    >
                        {!isSubmitting && <Send className="w-5 h-5 mr-3" />}
                        {isSubmitting ? 'Posting...' : 'Share with Community'}
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="lg"
                        className="h-14 px-10 rounded-[20px] font-black"
                        onClick={() => router.back()}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}
