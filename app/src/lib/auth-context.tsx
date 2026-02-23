'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from './supabase';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

// ─── Types ────────────────────────────────────────────────────────────────────

type UserRole = 'student' | 'recruiter' | 'admin';

interface ProfileData {
    id: string;
    email: string;
    role: UserRole;
    account_status: string;
    created_at: string;
    profile?: any;
}

interface AuthContextType {
    user: SupabaseUser | null;
    session: Session | null;
    profile: ProfileData | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    isStudent: boolean;
    isRecruiter: boolean;
    isAdmin: boolean;
    userRole: 'student' | 'recruiter' | 'admin' | null;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, role?: 'student' | 'recruiter') => Promise<{ success: boolean; needsEmailConfirmation?: boolean; role?: string } | void>;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch profile for authenticated user - OPTIMIZED with parallel queries
    const fetchProfile = useCallback(async (authUser: SupabaseUser) => {
        try {
            // Fetch all profiles in parallel for speed
            const [userResult, studentResult, recruiterResult] = await Promise.all([
                supabase
                    .from('users')
                    .select('id, email, role, account_status, created_at')
                    .eq('id', authUser.id)
                    .maybeSingle(),
                supabase
                    .from('student_profiles')
                    .select('*')
                    .eq('id', authUser.id)
                    .maybeSingle(),
                supabase
                    .from('recruiter_profiles')
                    .select('*')
                    .eq('id', authUser.id)
                    .maybeSingle(),
            ]);

            const userData = userResult.data;
            if (!userData) {
                console.log('User profile not found');
                setProfile(null);
                return;
            }

            // Pick the right role profile based on user role
            const roleProfile = userData.role === 'student' 
                ? studentResult.data 
                : userData.role === 'recruiter' 
                    ? recruiterResult.data 
                    : null;

            setProfile({
                ...userData,
                profile: roleProfile,
            });
        } catch (err) {
            // Profile might not exist for new users
            console.log('Profile not found, user may need to complete profile');
            setProfile(null);
        }
    }, []);

    // Initialize auth state on mount
    useEffect(() => {
        const initAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setSession(session);
                setUser(session?.user || null);

                if (session?.user) {
                    await fetchProfile(session.user);
                }
            } catch (err) {
                console.error('Auth init error:', err);
            } finally {
                setLoading(false);
            }
        };

        initAuth();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setSession(session);
                setUser(session?.user || null);

                if (event === 'SIGNED_OUT') {
                    setProfile(null);
                } else if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
                    await fetchProfile(session.user);
                }
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, [fetchProfile]);

    const signIn = useCallback(async (email: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            // Auth state change listener will handle the rest
        } catch (err: any) {
            const message = err.message || 'Sign in failed';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const signUp = useCallback(async (email: string, password: string, role: 'student' | 'recruiter' = 'student') => {
        setLoading(true);
        setError(null);
        try {
            // Call backend API to create user with role in users table
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const response = await fetch(`${API_URL}/api/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, role }),
            });

            const data = await response.json();
            console.log('Signup response:', data);
            
            if (!response.ok) {
                throw new Error(data.error || 'Sign up failed');
            }

            // Signup successful - now sign in immediately
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            console.log('SignIn response:', signInData, signInError);

            if (signInError) {
                // If email confirmation is required, don't throw - just return
                console.log('SignIn after signup:', signInError.message);
                return { success: true, needsEmailConfirmation: true };
            }
            
            return { success: true, needsEmailConfirmation: false, role };
        } catch (err: any) {
            console.error('Signup error:', err);
            const message = err.message || 'Sign up failed';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const signOut = useCallback(async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            setUser(null);
            setSession(null);
            setProfile(null);
        } catch (err: any) {
            const message = err.message || 'Sign out failed';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const refreshProfile = useCallback(async () => {
        if (user) {
            await fetchProfile(user);
        }
    }, [user, fetchProfile]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Get role from profile if available, otherwise from user metadata (for new users)
    const userRole = profile?.role ||
        (user?.user_metadata?.role as 'student' | 'recruiter' | 'admin' | undefined) ||
        null;

    const value: AuthContextType = {
        user,
        session,
        profile,
        loading,
        error,
        isAuthenticated: !!user,
        isStudent: userRole === 'student',
        isRecruiter: userRole === 'recruiter',
        isAdmin: userRole === 'admin',
        userRole,
        signIn,
        signUp,
        signOut,
        refreshProfile,
        clearError,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
}
