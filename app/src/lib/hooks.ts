'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import { api, profileService, ProfileData, ApiError } from './api';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

// ─── Auth Context Types ───────────────────────────────────────────────────────

interface AuthState {
    user: SupabaseUser | null;
    session: Session | null;
    profile: ProfileData | null;
    loading: boolean;
    error: string | null;
}

// ─── useAuth Hook ─────────────────────────────────────────────────────────────

export function useAuth() {
    const [state, setState] = useState<AuthState>({
        user: null,
        session: null,
        profile: null,
        loading: true,
        error: null,
    });

    useEffect(() => {
        // Get initial session
        const getInitialSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const user = session?.user || null;

                if (user) {
                    try {
                        const profile = await profileService.getProfile();
                        setState({ user, session, profile, loading: false, error: null });
                    } catch {
                        // Profile might not exist yet for new users
                        setState({ user, session, profile: null, loading: false, error: null });
                    }
                } else {
                    setState({ user: null, session: null, profile: null, loading: false, error: null });
                }
            } catch (error) {
                setState(prev => ({
                    ...prev,
                    loading: false,
                    error: error instanceof Error ? error.message : 'Failed to get session',
                }));
            }
        };

        getInitialSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            const user = session?.user || null;

            if (event === 'SIGNED_OUT') {
                setState({ user: null, session: null, profile: null, loading: false, error: null });
                return;
            }

            if (user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
                try {
                    const profile = await profileService.getProfile();
                    setState({ user, session, profile, loading: false, error: null });
                } catch {
                    setState({ user, session, profile: null, loading: false, error: null });
                }
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const signIn = useCallback(async (email: string, password: string) => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const { user, session } = await api.auth.signIn(email, password);
            if (user) {
                try {
                    const profile = await profileService.getProfile();
                    setState({ user, session, profile, loading: false, error: null });
                } catch {
                    setState({ user, session, profile: null, loading: false, error: null });
                }
            }
            return { user, session };
        } catch (error) {
            const message = error instanceof ApiError ? error.message : 'Sign in failed';
            setState(prev => ({ ...prev, loading: false, error: message }));
            throw error;
        }
    }, []);

    const signUp = useCallback(async (email: string, password: string, role: 'student' | 'recruiter' = 'student') => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const result = await api.auth.signUp(email, password, role);
            setState(prev => ({ ...prev, loading: false }));
            return result;
        } catch (error) {
            const message = error instanceof ApiError ? error.message : 'Sign up failed';
            setState(prev => ({ ...prev, loading: false, error: message }));
            throw error;
        }
    }, []);

    const signOut = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true }));
        try {
            await api.auth.signOut();
            setState({ user: null, session: null, profile: null, loading: false, error: null });
        } catch (error) {
            const message = error instanceof ApiError ? error.message : 'Sign out failed';
            setState(prev => ({ ...prev, loading: false, error: message }));
            throw error;
        }
    }, []);

    const refreshProfile = useCallback(async () => {
        if (!state.user) return;
        try {
            const profile = await profileService.getProfile();
            setState(prev => ({ ...prev, profile }));
        } catch {
            // Ignore errors during refresh
        }
    }, [state.user]);

    return {
        ...state,
        isAuthenticated: !!state.user,
        isStudent: state.profile?.role === 'student',
        isRecruiter: state.profile?.role === 'recruiter',
        isAdmin: state.profile?.role === 'admin',
        signIn,
        signUp,
        signOut,
        refreshProfile,
    };
}

// ─── Generic Data Fetching Hook ───────────────────────────────────────────────

interface UseApiState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

export function useApi<T>(
    fetcher: () => Promise<T>,
    dependencies: unknown[] = []
) {
    const [state, setState] = useState<UseApiState<T>>({
        data: null,
        loading: true,
        error: null,
    });

    const refetch = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const data = await fetcher();
            setState({ data, loading: false, error: null });
        } catch (error) {
            const message = error instanceof ApiError ? error.message : 'An error occurred';
            setState({ data: null, loading: false, error: message });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetcher, ...dependencies]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return { ...state, refetch };
}

// ─── Specific API Hooks ───────────────────────────────────────────────────────

export function useInternships() {
    return useApi(() => api.internships.getAll(), []);
}

export function useInternship(id: string) {
    return useApi(() => api.internships.getById(id), [id]);
}

export function useMyApplications() {
    return useApi(() => api.applications.getMyApplications(), []);
}

export function useProfile() {
    return useApi(() => api.profile.getProfile(), []);
}

export function useRecruiterInternships() {
    return useApi(() => api.recruiter.getMyInternships(), []);
}

export function useRecruiterStatus() {
    return useApi(() => api.recruiter.getStatus(), []);
}
