import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export type UserRole = 'student' | 'recruiter';
export type AccountStatus = 'active' | 'suspended';
export type InternshipStatus = 'open' | 'closed';
export type ApplicationStatus = 'applied' | 'shortlisted' | 'interview' | 'offered' | 'rejected';

export interface User {
    id: string;
    email: string;
    role: UserRole;
    account_status: AccountStatus;
    created_at: string;
}

export interface StudentProfile {
    id: string; // user_id
    full_name: string;
    university?: string;
    degree?: string;
    branch?: string;
    graduation_year?: number;
    skills: string[];
    bio?: string;
    linkedin_url?: string;
    github_url?: string;
    resume_url?: string;
    profile_completed: boolean;
    created_at: string;
    updated_at: string;
}

export interface RecruiterProfile {
    id: string; // user_id
    company_name: string;
    recruiter_name: string;
    company_website?: string;
    company_description?: string;
    company_logo_url?: string;
    is_verified: boolean;
    created_at: string;
    updated_at: string;
}

export interface Internship {
    id: string;
    recruiter_id: string;
    title: string;
    description: string;
    duration?: string;
    stipend?: string;
    location?: string;
    skills_required: string[];
    eligibility?: string;
    deadline?: string;
    status: InternshipStatus;
    created_at: string;
    updated_at: string;
}

export interface Application {
    id: string;
    internship_id: string;
    student_id: string;
    cover_letter: string;
    portfolio_link?: string;
    resume_url?: string;
    status: ApplicationStatus;
    applied_at: string;
    updated_at: string;
}

export interface CommunityPost {
    id: string;
    posted_by: string;
    title: string;
    company?: string;
    external_link?: string;
    description?: string;
    tags: string[];
    created_at: string;
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
