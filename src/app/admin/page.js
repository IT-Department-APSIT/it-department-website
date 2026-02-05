"use client";
import Link from 'next/link';
import { Folder } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAuth } from '@/context/AuthContext';

function AdminDashboardContent() {
    const { admin, loading } = useAuth();

    const folders = [
        { name: 'Home', href: '/admin/home' },
        { name: 'Events', href: '/admin/events' },
        { name: 'About', href: '/admin/about' },
        { name: 'ITSA', href: '/admin/itsa' },
    ];

    if (loading) {
        return (
            <div style={{
                minHeight: 'calc(100vh - 70px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    border: '3px solid rgba(255, 255, 255, 0.1)',
                    borderTopColor: '#fbbf24',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                }} />
                <style jsx>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div style={{
            padding: '3rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: '#fff',
                    marginBottom: '0.5rem'
                }}>
                    Welcome back, {admin?.name || 'Admin'}!
                </h1>
                <p style={{
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: '1rem'
                }}>
                    Select a section to manage
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
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
                            color: '#fff'
                        }}>
                            {folder.name}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default function AdminPage() {
    return (
        <AdminLayout>
            <AdminDashboardContent />
        </AdminLayout>
    );
}
