'use client';

import React from 'react';
import {
    Building2,
    Globe,
    Mail,
    MapPin,
    Link as LinkIcon,
    Edit3,
    LogOut,
    Camera,
    Users,
    Briefcase
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { currentRecruiter } from '@/lib/mockData';
import Link from 'next/link';

export default function RecruiterProfilePage() {
    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-fade-in">
            {/* ── Company Header Card ── */}
            <Card className="p-12 border-none shadow-2xl shadow-muted/20 relative overflow-hidden bg-white rounded-[40px]">
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 blur-[100px] rounded-full -mr-40 -mt-40" />

                <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                    <div className="relative group">
                        <div className="h-32 w-32 bg-muted/30 border border-border/50 rounded-[40px] flex items-center justify-center text-4xl font-black text-muted-foreground shadow-2xl ring-8 ring-primary/[0.03] transition-transform group-hover:scale-105">
                            {currentRecruiter.company?.[0]}
                        </div>
                        <button className="absolute -bottom-2 -right-2 p-3 bg-white border border-border rounded-2xl shadow-xl text-primary hover:bg-primary hover:text-white transition-all cursor-pointer">
                            <Camera className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                            <h1 className="text-5xl font-black text-foreground tracking-tight">{currentRecruiter.company}</h1>
                            <Badge variant="primary" className="w-fit mx-auto md:mx-0 px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest bg-primary/10 text-primary border-none">Verified Partner</Badge>
                        </div>
                        <div className="flex flex-wrap justify-center md:justify-start gap-8 text-sm font-bold text-muted-foreground mt-6">
                            <div className="flex items-center gap-2.5">
                                <Globe className="w-4.5 h-4.5 text-primary" /> techcorp.com
                            </div>
                            <div className="flex items-center gap-2.5">
                                <Users className="w-4.5 h-4.5 text-primary" /> 500-1000 Employees
                            </div>
                            <div className="flex items-center gap-2.5">
                                <MapPin className="w-4.5 h-4.5 text-primary" /> Bangalore, India
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="grid md:grid-cols-12 gap-10">
                {/* ── Left Details ── */}
                <div className="md:col-span-8 space-y-10">
                    <Card className="p-12 border-none shadow-sm rounded-[40px] bg-white">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-black text-foreground uppercase tracking-widest text-xs">About the Company</h3>
                        </div>
                        <div className="prose prose-slate max-w-none">
                            <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                                TechCorp Solutions is a global leader in software engineering and cloud infrastructure.
                                We empower the next generation of engineers by providing high-impact internship opportunities
                                and a culture of continuous learning.
                            </p>
                            <p className="mt-6 text-lg text-muted-foreground leading-relaxed font-medium">
                                Founded in 2010, we have grown to become a cornerstone of the tech ecosystem,
                                partnering with top universities to bridge the gap between education and industry.
                            </p>
                        </div>
                    </Card>

                    <div className="flex gap-4">
                        <Button className="flex-1 bg-primary text-white h-16 rounded-[24px] font-black text-lg shadow-2xl shadow-primary/20">
                            <Edit3 className="w-5 h-5 mr-3" /> Edit Profile
                        </Button>
                        <Link href="/" className="flex-1">
                            <Button variant="outline" className="w-full h-16 rounded-[24px] font-black text-lg border-2 border-danger/10 text-danger hover:bg-danger/5">
                                <LogOut className="w-5 h-5 mr-3" /> Log Out
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* ── Right Sidebar Info ── */}
                <div className="md:col-span-4 space-y-8">
                    <Card className="p-8 border-none shadow-sm rounded-[32px] bg-white text-center">
                        <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 mx-auto mb-6">
                            <Briefcase className="w-8 h-8" />
                        </div>
                        <p className="text-4xl font-black text-foreground tracking-tighter">12</p>
                        <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mt-2">Active Internships</p>
                    </Card>

                    <Card className="p-8 border-none shadow-sm rounded-[32px] bg-white">
                        <h3 className="text-sm font-black text-foreground uppercase tracking-widest mb-6">Connect</h3>
                        <div className="space-y-4">
                            <a href="#" className="flex items-center gap-3 p-4 bg-muted/20 rounded-2xl hover:bg-primary/5 transition-all text-sm font-bold text-foreground">
                                <LinkIcon className="w-4 h-4 text-primary" /> Official Website
                            </a>
                            <a href="#" className="flex items-center gap-3 p-4 bg-muted/20 rounded-2xl hover:bg-primary/5 transition-all text-sm font-bold text-foreground">
                                <Mail className="w-4 h-4 text-primary" /> recruitment@techcorp.com
                            </a>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
