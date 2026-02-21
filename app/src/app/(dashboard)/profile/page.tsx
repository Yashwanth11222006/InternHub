'use client';

import React from 'react';
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
import { currentStudent } from '@/lib/mockData';
import Link from 'next/link';

export default function ProfilePage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
            {/* ── Header Section ── */}
            <Card className="p-8 border-none shadow-sm relative overflow-hidden bg-white rounded-3xl border border-slate-100">
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-[80px] rounded-full -mr-24 -mt-24" />

                <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <div className="relative group">
                        <Avatar name={currentStudent.name} size="lg" className="h-28 w-28 rounded-3xl shadow-xl ring-4 ring-slate-50 transition-transform group-hover:scale-105" />
                        <button className="absolute -bottom-1 -right-1 p-2 bg-white border border-slate-200 rounded-xl shadow-lg text-primary hover:bg-primary hover:text-white transition-all cursor-pointer">
                            <Edit3 className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{currentStudent.name}</h1>
                            <Badge className="w-fit mx-auto md:mx-0 px-3 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-widest bg-emerald-50 text-emerald-600 border-none">Verified Candidate</Badge>
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium mb-5 leading-relaxed max-w-xl">{currentStudent.bio}</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-5 text-[11px] font-bold text-slate-400">
                            <div className="flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-primary/50" /> {currentStudent.email}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-primary/50" /> New Delhi, India
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="grid md:grid-cols-3 gap-8">
                {/* ── Left Column ── */}
                <div className="md:col-span-1 space-y-6">
                    {/* Education */}
                    <Card className="p-6 border border-slate-100 shadow-sm rounded-2xl bg-white">
                        <div className="flex items-center gap-2.5 mb-5">
                            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
                                <GraduationCap className="w-4 h-4" />
                            </div>
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Education</h3>
                        </div>
                        <p className="text-[13px] font-bold text-slate-900 mb-0.5">{currentStudent.university}</p>
                        <p className="text-[11px] text-slate-400 font-bold">{currentStudent.education}</p>
                    </Card>

                    {/* Social Links */}
                    <Card className="p-6 border border-slate-100 shadow-sm rounded-2xl bg-white">
                        <div className="flex items-center gap-2.5 mb-5">
                            <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-500">
                                <Globe className="w-4 h-4" />
                            </div>
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Connect</h3>
                        </div>
                        <div className="space-y-2">
                            {[
                                { label: 'LinkedIn', icon: <Linkedin className="w-3.5 h-3.5 text-[#0077B5]" />, href: currentStudent.linkedin },
                                { label: 'GitHub', icon: <Github className="w-3.5 h-3.5 text-slate-900" />, href: currentStudent.github },
                                { label: 'Portfolio', icon: <Briefcase className="w-3.5 h-3.5 text-primary" />, href: currentStudent.portfolio }
                            ].map((social, i) => (
                                <a key={i} href={social.href} target="_blank" className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100">
                                    <div className="flex items-center gap-3">
                                        {social.icon}
                                        <span className="text-[12px] font-bold text-slate-600">{social.label}</span>
                                    </div>
                                    <ExternalLink className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
                                </a>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* ── Right Column ── */}
                <div className="md:col-span-2 space-y-6">
                    {/* Skills */}
                    <Card className="p-8 border border-slate-100 shadow-sm rounded-2xl bg-white">
                        <div className="flex items-center gap-2.5 mb-6">
                            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center text-amber-500">
                                <Code className="w-4 h-4" />
                            </div>
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Technical Toolkit</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {currentStudent.skills?.map((skill, i) => (
                                <Badge key={i} className="px-3.5 py-1.5 rounded-xl bg-slate-50 text-[11px] font-bold text-slate-600 border-none hover:bg-primary/10 hover:text-primary transition-all cursor-default">
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    </Card>

                    {/* Resume (Polished Card) */}
                    <Card className="p-6 border border-slate-200 border-dashed shadow-sm rounded-2xl bg-white group hover:border-primary/30 transition-all">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">Arjun_Mehta_Resume.pdf</h3>
                                    <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-widest">1.2 MB • PDF</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-primary font-bold text-xs hover:bg-primary/5">Download</Button>
                        </div>
                    </Card>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <Button className="flex-1 bg-primary text-white h-12 rounded-xl font-bold text-[13px] shadow-lg shadow-primary/10">
                            Edit Professional Profile
                        </Button>
                        <Link href="/" className="shrink-0">
                            <Button variant="outline" className="h-12 w-12 rounded-xl flex items-center justify-center border-slate-200 text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all">
                                <LogOut className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
