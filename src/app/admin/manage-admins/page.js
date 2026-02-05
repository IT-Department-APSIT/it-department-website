"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
    Users, 
    Mail,
    ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

function ManageAdminsContent() {
    const { loading } = useAuth();
    const [admins, setAdmins] = useState([]);
    const [loadingAdmins, setLoadingAdmins] = useState(true);

    // Fetch all admins from auth users API
    useEffect(() => {
        async function fetchAdmins() {
            try {
                const response = await fetch('/api/admin/users');
                const data = await response.json();
                
                if (response.ok) {
                    setAdmins(data.admins || []);
                }
            } catch (error) {
                console.error('Error fetching admins:', error);
            }
            setLoadingAdmins(false);
        }

        fetchAdmins();
    }, []);

    if (loading || loadingAdmins) {
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
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '2rem'
            }}>
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
                <div>
                    <h1 style={{
                        fontSize: '1.75rem',
                        fontWeight: '700',
                        color: '#fff',
                        margin: 0
                    }}>
                        Admin Accounts
                    </h1>
                    <p style={{
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontSize: '0.9rem',
                        margin: '0.25rem 0 0'
                    }}>
                        {admins.length} admin{admins.length !== 1 ? 's' : ''} with access
                    </p>
                </div>
            </div>

            {/* Admins List */}
            <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                overflow: 'hidden'
            }}>
                {/* Table Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem 1.5rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    <Users size={18} color="#fbbf24" />
                    <span style={{ 
                        color: 'rgba(255, 255, 255, 0.5)', 
                        fontSize: '0.85rem', 
                        fontWeight: '600', 
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        Admin Email Addresses
                    </span>
                </div>

                {/* Admin Rows */}
                {admins.map((adminUser, index) => (
                    <div
                        key={adminUser.id}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '1rem 1.5rem',
                            borderBottom: index < admins.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                        }}
                    >
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            <Mail size={18} color="#1a1a2e" />
                        </div>
                        <div style={{
                            color: '#fff',
                            fontSize: '1rem',
                            fontWeight: '500',
                            wordBreak: 'break-all'
                        }}>
                            {adminUser.email}
                        </div>
                    </div>
                ))}

                {admins.length === 0 && (
                    <div style={{
                        padding: '3rem',
                        textAlign: 'center',
                        color: 'rgba(255, 255, 255, 0.5)'
                    }}>
                        No admins found.
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ManageAdminsPage() {
    return (
        <AdminLayout>
            <ManageAdminsContent />
        </AdminLayout>
    );
}
