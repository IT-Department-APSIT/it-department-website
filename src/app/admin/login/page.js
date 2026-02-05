"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) {
                setError(signInError.message);
                setLoading(false);
                return;
            }

            // User authenticated successfully - they are an admin
            router.push('/admin');
            router.refresh();
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '420px',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '3rem 2.5rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{
                        width: '70px',
                        height: '70px',
                        background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                        boxShadow: '0 10px 30px rgba(251, 191, 36, 0.3)'
                    }}>
                        <LogIn size={32} color="#1a1a2e" />
                    </div>
                    <h1 style={{
                        fontSize: '1.75rem',
                        fontWeight: '700',
                        color: '#fff',
                        marginBottom: '0.5rem'
                    }}>
                        Admin Login
                    </h1>
                    <p style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '0.95rem'
                    }}>
                        Sign in to access the admin panel
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '1rem',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '12px',
                        marginBottom: '1.5rem'
                    }}>
                        <AlertCircle size={20} color="#ef4444" />
                        <span style={{ color: '#fca5a5', fontSize: '0.9rem' }}>{error}</span>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleLogin}>
                    {/* Email Field */}
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{
                            display: 'block',
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            marginBottom: '0.5rem'
                        }}>
                            Email Address
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Mail
                                size={18}
                                color="rgba(255, 255, 255, 0.4)"
                                style={{
                                    position: 'absolute',
                                    left: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)'
                                }}
                            />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@example.com"
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.875rem 1rem 0.875rem 2.75rem',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '12px',
                                    color: '#fff',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    transition: 'all 0.2s ease'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = 'rgba(251, 191, 36, 0.5)';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{
                            display: 'block',
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            marginBottom: '0.5rem'
                        }}>
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Lock
                                size={18}
                                color="rgba(255, 255, 255, 0.4)"
                                style={{
                                    position: 'absolute',
                                    left: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)'
                                }}
                            />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.875rem 3rem 0.875rem 2.75rem',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '12px',
                                    color: '#fff',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    transition: 'all 0.2s ease'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = 'rgba(251, 191, 36, 0.5)';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '0.25rem'
                                }}
                            >
                                {showPassword ? (
                                    <EyeOff size={18} color="rgba(255, 255, 255, 0.4)" />
                                ) : (
                                    <Eye size={18} color="rgba(255, 255, 255, 0.4)" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            background: loading
                                ? 'rgba(251, 191, 36, 0.5)'
                                : 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                            border: 'none',
                            borderRadius: '12px',
                            color: '#1a1a2e',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        {loading ? (
                            <>
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    border: '2px solid rgba(26, 26, 46, 0.3)',
                                    borderTopColor: '#1a1a2e',
                                    borderRadius: '50%',
                                    animation: 'spin 0.8s linear infinite'
                                }} />
                                Signing in...
                            </>
                        ) : (
                            <>
                                <LogIn size={20} />
                                Sign In
                            </>
                        )}
                    </button>
                </form>

                <style jsx>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        </div>
    );
}
