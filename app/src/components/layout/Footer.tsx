import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="sm:col-span-2 md:col-span-1">
                        <Link href="/">
                            <Logo className="mb-4" size="sm" />
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Your verified internship network. Connecting students with top companies through professional and clean experiences.
                        </p>
                    </div>

                    {/* Platform */}
                    <div>
                        <h4 className="text-sm font-black text-foreground uppercase tracking-widest mb-6">Platform</h4>
                        <ul className="space-y-3">
                            <li><Link href="/internships" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Browse Internships</Link></li>
                            <li><Link href="/community" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Community Feed</Link></li>
                            <li><Link href="/signup" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Create Account</Link></li>
                            <li><Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Log In</Link></li>
                        </ul>
                    </div>

                    {/* Recruiters */}
                    <div>
                        <h4 className="text-sm font-black text-foreground uppercase tracking-widest mb-6">Recruiters</h4>
                        <ul className="space-y-3">
                            <li><Link href="/signup" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Post an Internship</Link></li>
                            <li><Link href="/recruiter/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Recruiter Dashboard</Link></li>
                            <li><Link href="/recruiter/manage" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Manage Candidates</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-sm font-black text-foreground uppercase tracking-widest mb-6">Support</h4>
                        <ul className="space-y-3">
                            <li><Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
                            <li><Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Help Center</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest text-center md:text-left">
                        © 2026 InternHub. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        {['Twitter', 'LinkedIn', 'Instagram'].map((social) => (
                            <Link key={social} href="#" className="text-[11px] font-black text-muted-foreground uppercase tracking-widest hover:text-primary transition-colors">{social}</Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
