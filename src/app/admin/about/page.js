"use client";
import Link from 'next/link';
import { Folder } from 'lucide-react';

export default function AdminAboutPage() {
    const folders = [
        { name: 'Faculty', href: '/admin/about/faculty' },
    ];

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            padding: '3rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <div style={{ marginBottom: '2rem' }}>
                <Link
                    href="/admin"
                    style={{
                        color: '#fbbf24',
                        textDecoration: 'none',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    ← Back to Admin Panel
                </Link>
            </div>

            <h1 style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                color: '#fff',
                marginBottom: '3rem',
                textAlign: 'center'
            }}>
                About Management
            </h1>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '2rem',
                width: '100%',
                maxWidth: '900px'
            }}>
                {folders.map((folder) => (
                    <Link
                        key={folder.name}
                        href={folder.href}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '2.5rem 2rem',
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '16px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            textDecoration: 'none',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.3)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <Folder
                            size={80}
                            color="#fbbf24"
                            fill="#fbbf24"
                            style={{ marginBottom: '1rem' }}
                        />
                        <span style={{
                            fontSize: '1.25rem',
                            fontWeight: '600',
                            color: '#fff',
                            textAlign: 'center'
                        }}>
                            {folder.name}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
