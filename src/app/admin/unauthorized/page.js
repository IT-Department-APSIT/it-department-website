"use client";
import Link from 'next/link';
import { ShieldX, Home, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
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
                textAlign: 'center',
                maxWidth: '450px'
            }}>
                <div style={{
                    width: '100px',
                    height: '100px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 2rem',
                    border: '2px solid rgba(239, 68, 68, 0.3)'
                }}>
                    <ShieldX size={48} color="#ef4444" />
                </div>

                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: '#fff',
                    marginBottom: '1rem'
                }}>
                    Access Denied
                </h1>

                <p style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    marginBottom: '2rem'
                }}>
                    You don't have permission to access the admin panel. 
                    Please contact the administrator if you believe this is an error.
                </p>

                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                }}>
                    <Link
                        href="/"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.875rem 1.5rem',
                            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                            borderRadius: '12px',
                            color: '#1a1a2e',
                            textDecoration: 'none',
                            fontWeight: '600',
                            fontSize: '0.95rem',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <Home size={18} />
                        Go to Homepage
                    </Link>

                    <Link
                        href="/admin/login"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.875rem 1.5rem',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            color: '#fff',
                            textDecoration: 'none',
                            fontWeight: '500',
                            fontSize: '0.95rem',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <ArrowLeft size={18} />
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
