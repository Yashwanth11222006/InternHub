import { supabase } from './supabase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole = 'student' | 'recruiter' | 'admin';
export type AccountStatus = 'active' | 'suspended';
export type ApplicationStatus = 'applied' | 'shortlisted' | 'rejected' | 'accepted';
export type InternshipStatus = 'open' | 'closed';

export interface User {
    id: string;
    name?: string;
    email: string;
    role: UserRole;
    account_status: AccountStatus;
    created_at: string;
}

export interface StudentProfile {
    id: string;
    full_name: string;
    university?: string;
    degree?: string;
    branch?: string;
    graduation_year?: number;
    skills?: string[];
    bio?: string;
    linkedin_url?: string;
    github_url?: string;
    resume_url?: string;
    profile_completed: boolean;
    created_at: string;
    updated_at: string;
}

export interface RecruiterProfile {
    id: string;
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
    skills_required?: string[];
    eligibility?: string;
    deadline?: string;
    status: InternshipStatus;
    created_at: string;
    updated_at: string;
    // Enriched fields
    company?: string;
    applicant_count?: number;
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
    // Enriched fields from joins
    company_name?: string;
    internships?: {
        title: string;
        location?: string;
        stipend?: string;
        duration?: string;
    };
}

export interface ProfileData {
    id: string;
    name?: string;
    email: string;
    role: UserRole;
    account_status: AccountStatus;
    created_at: string;
    profile: StudentProfile | RecruiterProfile | null;
}

// ─── API Error ────────────────────────────────────────────────────────────────

export class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public data?: unknown
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

// ─── Get Auth Token ───────────────────────────────────────────────────────────

async function getAuthToken(): Promise<string | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
}

// ─── API Client ───────────────────────────────────────────────────────────────

interface FetchOptions extends RequestInit {
    skipAuth?: boolean;
}

async function apiClient<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { skipAuth = false, headers: customHeaders, ...restOptions } = options;

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...customHeaders,
    };

    if (!skipAuth) {
        const token = await getAuthToken();
        if (token) {
            (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
        }
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...restOptions,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new ApiError(
            data.error || 'An error occurred',
            response.status,
            data
        );
    }

    return data;
}

// ─── Auth Services ────────────────────────────────────────────────────────────

export const authService = {
    async signUp(email: string, password: string, role: UserRole = 'student') {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { role },
            },
        });

        if (error) throw new ApiError(error.message, 400);
        return data;
    },

    async signIn(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw new ApiError(error.message, 401);
        return data;
    },

    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw new ApiError(error.message, 400);
    },

    async getCurrentSession() {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw new ApiError(error.message, 400);
        return session;
    },

    async getCurrentUser() {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw new ApiError(error.message, 400);
        return user;
    },

    onAuthStateChange(callback: (event: string, session: unknown) => void) {
        return supabase.auth.onAuthStateChange(callback);
    },
};

// ─── Profile Services ─────────────────────────────────────────────────────────

export const profileService = {
    async getProfile(): Promise<ProfileData> {
        return apiClient<ProfileData>('/api/profile');
    },

    async updateProfile(updates: Partial<StudentProfile | RecruiterProfile>) {
        return apiClient('/api/profile', {
            method: 'PATCH',
            body: JSON.stringify(updates),
        });
    },

    async completeProfile(profileData: {
        // Student fields
        full_name?: string;
        university?: string;
        degree?: string;
        branch?: string;
        graduation_year?: number;
        skills?: string[];
        bio?: string;
        linkedin_url?: string;
        github_url?: string;
        resume_url?: string;
        // Recruiter fields
        recruiter_name?: string;
        company_name?: string;
        company_website?: string;
        company_description?: string;
    }) {
        return apiClient('/api/profile/complete', {
            method: 'POST',
            body: JSON.stringify(profileData),
        });
    },
};

// ─── Internships Services ─────────────────────────────────────────────────────

export const internshipService = {
    async getAll(): Promise<Internship[]> {
        // Public endpoint - no auth required
        return apiClient<Internship[]>('/api/internships', { skipAuth: true });
    },

    async getById(id: string): Promise<Internship> {
        // Public endpoint - no auth required
        return apiClient<Internship>(`/api/internships/${id}`, { skipAuth: true });
    },

    async create(internship: {
        title: string;
        description: string;
        duration: string;
        eligibility: string;
        stipend?: string;
        location?: string;
        skills_required?: string[];
        deadline?: string;
    }): Promise<Internship> {
        return apiClient<Internship>('/api/internships', {
            method: 'POST',
            body: JSON.stringify(internship),
        });
    },

    async update(id: string, updates: Partial<Internship>): Promise<Internship> {
        return apiClient<Internship>(`/api/internships/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(updates),
        });
    },

    async delete(id: string): Promise<void> {
        return apiClient(`/api/internships/${id}`, {
            method: 'DELETE',
        });
    },
};

// ─── Applications Services ────────────────────────────────────────────────────

export const applicationService = {
    async getMyApplications(): Promise<Application[]> {
        return apiClient<Application[]>('/api/applications');
    },

    async apply(application: {
        internship_id: string;
        cover_letter: string;
        portfolio_link?: string;
        resume_url?: string;
    }): Promise<Application> {
        return apiClient<Application>('/api/applications', {
            method: 'POST',
            body: JSON.stringify(application),
        });
    },

    async updateStatus(applicationId: string, status: ApplicationStatus): Promise<Application> {
        return apiClient<Application>(`/api/applications/${applicationId}`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        });
    },
};

// ─── Recruiter Services ───────────────────────────────────────────────────────

export const recruiterService = {
    async getMyInternships(): Promise<Internship[]> {
        return apiClient<Internship[]>('/api/recruiter/internships');
    },

    async getApplicants(internshipId: string) {
        return apiClient(`/api/recruiter/internships/${internshipId}/applicants`);
    },

    async getStatus(): Promise<{ is_verified: boolean; profile_completed: boolean }> {
        return apiClient('/api/recruiter/status');
    },
};

// ─── Upload Services ──────────────────────────────────────────────────────────

export const uploadService = {
    async uploadResume(file: File) {
        const formData = new FormData();
        formData.append('file', file);

        const token = await getAuthToken();
        const response = await fetch(`${API_URL}/api/upload/resume`, {
            method: 'POST',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: formData,
        });

        const data = await response.json();
        if (!response.ok) {
            throw new ApiError(data.error || 'Upload failed', response.status);
        }

        return data;
    },
};

// ─── Export all services ──────────────────────────────────────────────────────

export const api = {
    auth: authService,
    profile: profileService,
    internships: internshipService,
    applications: applicationService,
    recruiter: recruiterService,
    upload: uploadService,
};
