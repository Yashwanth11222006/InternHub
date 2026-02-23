'use client';

import React, { useEffect, useState } from 'react';
import {
    User,
    Mail,
    MapPin,
    GraduationCap,
    Code,
    FileText,
    Linkedin,
    Github,
    Globe,
    Edit3,
    LogOut,
    ExternalLink,
    Briefcase
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { useAuthContext } from '@/lib/auth-context';
import { ProfileData, StudentProfile } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const { profile, loading, signOut } = useAuthContext();
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await signOut();
            router.push('/');
        } catch (error) {
            console.error('Sign out failed:', error);
        }
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
                <Card className="h-48 animate-pulse bg-slate-100 rounded-3xl" />
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="space-y-6">
                        <Card className="h-32 animate-pulse bg-slate-100 rounded-2xl" />
                        <Card className="h-40 animate-pulse bg-slate-100 rounded-2xl" />
                    </div>
                    <div className="md:col-span-2 space-y-6">
                        <Card className="h-32 animate-pulse bg-slate-100 rounded-2xl" />
                        <Card className="h-24 animate-pulse bg-slate-100 rounded-2xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
                <Card className="p-8 text-center">
                    <h2 className="text-xl font-bold mb-4">Profile Not Found</h2>
                    <p className="text-muted-foreground mb-4">Please complete your profile to continue.</p>
                    <Link href="/complete-profile">
                        <Button variant="primary">Complete Profile</Button>
                    </Link>
                </Card>
            </div>
        );
    }

    const studentProfile = profile.profile as StudentProfile | null;
    const displayName = studentProfile?.full_name || profile.name || 'User';
    const skills = studentProfile?.skills || [];
    const university = studentProfile?.university || '';
    const degree = studentProfile?.degree || '';
    const branch = studentProfile?.branch || '';
    const graduationYear = studentProfile?.graduation_year;
    const bio = studentProfile?.bio || '';
    const linkedinUrl = studentProfile?.linkedin_url;
    const githubUrl = studentProfile?.github_url;
    const resumeUrl = studentProfile?.resume_url;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
            {/* ── Header Section ── */}
            <Card className="p-8 border-none shadow-sm relative overflow-hidden bg-white rounded-3xl border border-black/10">
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-[80px] rounded-full -mr-24 -mt-24" />

                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <div className="relative group">
                        <Avatar name={displayName} size="lg" className="h-28 w-28 rounded-3xl shadow-xl ring-4 ring-slate-50 transition-transform group-hover:scale-105" />
                        <button className="absolute -bottom-1 -right-1 p-2 bg-white border border-black/20 rounded-xl shadow-lg text-primary hover:bg-primary hover:text-white transition-all cursor-pointer">
                            <Edit3 className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
                            <h1 className="text-2xl font-black text-black tracking-tight">{displayName}</h1>
                            {studentProfile?.profile_completed && (
                                <Badge className="w-fit mx-auto md:mx-0 px-3 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-widest bg-emerald-50 text-emerald-600 border-none">
                                    Profile Complete
                                </Badge>
                            )}
                        </div>
                        {bio && (
                            <p className="text-[13px] text-black/70 font-medium mb-5 leading-relaxed max-w-xl">{bio}</p>
                        )}
                        <div className="flex flex-wrap justify-center md:justify-start gap-5 text-[11px] font-bold text-black/60">
                            <div className="flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-primary/50" /> {profile.email}
                            </div>
                            {university && (
                                <div className="flex items-center gap-1.5">
                                    <GraduationCap className="w-3.5 h-3.5 text-primary/50" /> {university}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Card>

            <div className="grid md:grid-cols-3 gap-8">
                {/* ── Left Column ── */}
                <div className="md:col-span-1 space-y-6">
                    {/* Education */}
                    <Card className="p-6 border border-black/10 shadow-sm rounded-2xl bg-white">
                        <div className="flex items-center gap-2.5 mb-5">
                            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
                                <GraduationCap className="w-4 h-4" />
                            </div>
                            <h3 className="text-[10px] font-black text-black/60 uppercase tracking-widest">Education</h3>
                        </div>
                        <p className="text-[13px] font-bold text-black mb-0.5">{university || 'Not specified'}</p>
                        <p className="text-[11px] text-black/60 font-bold">
                            {degree && branch ? `${degree} in ${branch}` : degree || branch || 'Not specified'}
                            {graduationYear && ` (${graduationYear})`}
                        </p>
                    </Card>

                    {/* Social Links */}
                    <Card className="p-6 border border-black/10 shadow-sm rounded-2xl bg-white">
                        <div className="flex items-center gap-2.5 mb-5">
                            <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-500">
                                <Globe className="w-4 h-4" />
                            </div>
                            <h3 className="text-[10px] font-black text-black/60 uppercase tracking-widest">Connect</h3>
                        </div>
                        <div className="space-y-2">
                            {[
                                { label: 'LinkedIn', icon: <Linkedin className="w-3.5 h-3.5 text-[#0077B5]" />, href: linkedinUrl },
                                { label: 'GitHub', icon: <Github className="w-3.5 h-3.5 text-black" />, href: githubUrl },
                            ].filter(s => s.href).map((social, i) => (
                                <a key={i} href={social.href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f5f0e8] transition-all group border border-transparent hover:border-black/10">
                                    <div className="flex items-center gap-3">
                                        {social.icon}
                                        <span className="text-[12px] font-bold text-black/70">{social.label}</span>
                                    </div>
                                    <ExternalLink className="w-3 h-3 text-black/30 opacity-0 group-hover:opacity-100 transition-all" />
                                </a>
                            ))}
                            {!linkedinUrl && !githubUrl && (
                                <p className="text-xs text-muted-foreground">No social links added yet</p>
                            )}
                        </div>
                    </Card>
                </div>

                {/* ── Right Column ── */}
                <div className="md:col-span-2 space-y-6">
                    {/* Skills */}
                    <Card className="p-8 border border-black/10 shadow-sm rounded-2xl bg-white">
                        <div className="flex items-center gap-2.5 mb-6">
                            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center text-amber-500">
                                <Code className="w-4 h-4" />
                            </div>
                            <h3 className="text-[10px] font-black text-black/60 uppercase tracking-widest">Technical Toolkit</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {skills.length > 0 ? (
                                skills.map((skill, i) => (
                                    <Badge key={i} className="px-3.5 py-1.5 rounded-xl bg-slate-50 text-[11px] font-bold text-black/70 border-none hover:bg-black/5 hover:text-black transition-all cursor-default">
                                        {skill}
                                    </Badge>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">No skills added yet</p>
                            )}
                        </div>
                    </Card>

                    {/* Resume */}
                    {resumeUrl ? (
                        <Card className="p-6 border border-black/20 border-dashed shadow-sm rounded-2xl bg-white group hover:border-black/40 transition-all">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-black">Resume</h3>
                                        <p className="text-[10px] text-black/60 font-bold mt-0.5 uppercase tracking-widest">PDF Document</p>
                                    </div>
                                </div>
                                <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                    <Button variant="ghost" size="sm" className="text-black/70 font-bold text-xs hover:bg-black/5">View</Button>
                                </a>
                            </div>
                        </Card>
                    ) : (
                        <Card className="p-6 border border-black/20 border-dashed shadow-sm rounded-2xl bg-white">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-black/40">No Resume Uploaded</h3>
                                    <p className="text-[10px] text-black/40 font-bold mt-0.5">Upload your resume to apply for internships</p>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Actions */}
                    <div className="flex gap-4">
                        <Link href="/profile/edit" className="flex-1">
                            <Button className="w-full bg-primary text-white h-12 rounded-xl font-bold text-[13px] shadow-lg shadow-primary/10">
                                Edit Professional Profile
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            onClick={handleSignOut}
                            className="h-12 w-12 rounded-xl flex items-center justify-center border-black/10 text-black/60 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all"
                        >
                            <LogOut className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
