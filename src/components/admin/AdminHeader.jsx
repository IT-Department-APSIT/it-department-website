"use client";
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
    User, 
    LogOut, 
    ChevronDown, 
    Users, 
    Shield
} from 'lucide-react';

export default function AdminHeader() {
    const { user, signOut, loading } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const router = useRouter();

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSignOut = async () => {
        await signOut();
        router.push('/admin/login');
        router.refresh();
    };

    if (loading) {
        return (
            <header style={{
                background: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '1rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ width: '150px', height: '24px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }} />
                <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
            </header>
        );
    }

    return (
        <header style={{
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '0.75rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            {/* Left side - Logo/Title */}
            <Link 
                href="/admin"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    textDecoration: 'none'
                }}
            >
                <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Shield size={22} color="#1a1a2e" />
                </div>
                <span style={{
                    color: '#fff',
                    fontSize: '1.25rem',
                    fontWeight: '600'
                }}>
                    Admin Panel
                </span>
            </Link>

            {/* Right side - Profile */}
            <div style={{ position: 'relative' }} ref={dropdownRef}>
                <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.5rem 1rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    }}
                >
                    {/* Avatar */}
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <User size={18} color="#1a1a2e" />
                    </div>

                    {/* Email */}
                    <div style={{ textAlign: 'left' }}>
                        <div style={{
                            color: '#fff',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            maxWidth: '180px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}>
                            {user?.email || 'Admin'}
                        </div>
                    </div>

                    <ChevronDown 
                        size={16} 
                        color="rgba(255, 255, 255, 0.5)"
                        style={{
                            transition: 'transform 0.2s ease',
                            transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                        }}
                    />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                    <div style={{
                        position: 'absolute',
                        top: 'calc(100% + 0.5rem)',
                        right: 0,
                        width: '240px',
                        background: 'rgba(26, 26, 46, 0.98)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
                        overflow: 'hidden',
                        animation: 'fadeIn 0.2s ease'
                    }}>
                        {/* User Info */}
                        <div style={{
                            padding: '1rem',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                            <div style={{
                                color: 'rgba(255, 255, 255, 0.5)',
                                fontSize: '0.75rem',
                                marginBottom: '0.25rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                Signed in as
                            </div>
                            <div style={{
                                color: '#fff',
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                wordBreak: 'break-all'
                            }}>
                                {user?.email}
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div style={{ padding: '0.5rem' }}>
                            <Link
                                href="/admin/manage-admins"
                                onClick={() => setDropdownOpen(false)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.75rem 1rem',
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    textDecoration: 'none',
                                    borderRadius: '8px',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                    e.currentTarget.style.color = '#fff';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                                }}
                            >
                                <Users size={18} />
                                Manage Admins
                            </Link>
                        </div>

                        {/* Sign Out */}
                        <div style={{
                            padding: '0.5rem',
                            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                            <button
                                onClick={handleSignOut}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#ef4444',
                                    cursor: 'pointer',
                                    borderRadius: '8px',
                                    fontSize: '0.9rem',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                <LogOut size={18} />
                                Sign Out
                            </button>
                        </div>
                    </div>
                )}

                <style jsx>{`
                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                            transform: translateY(-10px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `}</style>
            </div>
        </header>
    );
}
