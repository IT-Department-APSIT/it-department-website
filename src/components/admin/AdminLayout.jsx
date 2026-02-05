"use client";
import { AuthProvider } from '@/context/AuthContext';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayout({ children }) {
    return (
        <AuthProvider>
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
            }}>
                <AdminHeader />
                <main>
                    {children}
                </main>
            </div>
        </AuthProvider>
    );
}
