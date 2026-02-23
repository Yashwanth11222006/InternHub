'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestSignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [result, setResult] = useState<string>('');
    const [loading, setLoading] = useState(false);

    // TEST 1: Pure Supabase signup only - no extra inserts
    const testPureSignup = async () => {
        setLoading(true);
        setResult('Testing pure signup...');

        console.time("pure-signup");

        const { data, error } = await supabase.auth.signUp({
            email: email || `test${Date.now()}@gmail.com`,
            password: password || 'testpass123',
        });

        console.timeEnd("pure-signup");

        setLoading(false);

        if (error) {
            setResult(`❌ ERROR: ${error.message}`);
            console.log('Signup error:', error);
        } else {
            setResult(`✅ SUCCESS in console.time above\nUser ID: ${data.user?.id}\nEmail: ${data.user?.email}`);
            console.log('Signup data:', data);
        }
    };

    // TEST 2: Test insert into users table
    const testUsersInsert = async () => {
        setLoading(true);
        setResult('Testing users table insert...');

        const testId = crypto.randomUUID();

        console.time("users-insert");

        const { data, error } = await supabase
            .from('users')
            .insert([{
                id: testId,
                email: `test${Date.now()}@test.com`,
                role: 'student'
            }])
            .select();

        console.timeEnd("users-insert");

        setLoading(false);

        if (error) {
            setResult(`❌ USERS INSERT ERROR: ${error.message}\nCode: ${error.code}`);
            console.log('Insert error:', error);
        } else {
            setResult(`✅ USERS INSERT SUCCESS\n${JSON.stringify(data, null, 2)}`);
        }
    };

    // TEST 3: Test select from users table
    const testUsersSelect = async () => {
        setLoading(true);
        setResult('Testing users table select...');

        console.time("users-select");

        const { data, error } = await supabase
            .from('users')
            .select('*')
            .limit(1);

        console.timeEnd("users-select");

        setLoading(false);

        if (error) {
            setResult(`❌ USERS SELECT ERROR: ${error.message}`);
        } else {
            setResult(`✅ USERS SELECT SUCCESS\n${JSON.stringify(data, null, 2)}`);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8">
            <h1 className="text-2xl font-bold mb-6">🔬 Signup Debug Test</h1>

            <div className="space-y-4 max-w-md">
                <div>
                    <label className="block text-sm mb-1">Email (optional)</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={`test${Date.now()}@gmail.com`}
                        className="w-full p-2 rounded bg-slate-800 border border-slate-700"
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">Password (optional)</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="testpass123"
                        className="w-full p-2 rounded bg-slate-800 border border-slate-700"
                    />
                </div>

                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={testPureSignup}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        🧪 Test Pure Signup
                    </button>

                    <button
                        onClick={testUsersInsert}
                        disabled={loading}
                        className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
                    >
                        📝 Test Users Insert
                    </button>

                    <button
                        onClick={testUsersSelect}
                        disabled={loading}
                        className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 disabled:opacity-50"
                    >
                        📖 Test Users Select
                    </button>
                </div>

                {loading && (
                    <div className="text-yellow-400">⏳ Running test...</div>
                )}

                <pre className="mt-4 p-4 bg-slate-800 rounded text-sm whitespace-pre-wrap">
                    {result || 'Click a test button above. Check browser console for timing.'}
                </pre>

                <div className="text-xs text-slate-400 mt-4">
                    <p>📌 Open DevTools Console (F12) to see timing</p>
                    <p>📌 Open Network tab to see request times</p>
                    <p>📌 Expected: Pure signup should be &lt; 2 seconds</p>
                </div>
            </div>
        </div>
    );
}
