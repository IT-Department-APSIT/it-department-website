"use client";
import Link from 'next/link';
import { Folder, ArrowLeft } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

function AboutManagementContent() {
    const folders = [
        { name: 'Faculty', href: '/admin/about/faculty' },
    ];

    return (
        <div style={{
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '900px',
                marginBottom: '2rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link
                        href="/admin"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '40px',
                            height: '40px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '10px',
                            color: '#fff',
                            textDecoration: 'none'
                        }}
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 style={{
                        fontSize: '1.75rem',
                        fontWeight: '700',
                        color: '#fff',
                        margin: 0
                    }}>
                        About Management
                    </h1>
                </div>
            </div>

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

export default function AdminAboutPage() {
    return (
        <AdminLayout>
            <AboutManagementContent />
        </AdminLayout>
    );
}
