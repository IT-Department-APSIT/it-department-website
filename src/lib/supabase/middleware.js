import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function updateSession(request) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // Refresh session if expired
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Define public admin routes (no auth required)
    const publicAdminRoutes = ['/admin/login', '/admin/unauthorized'];
    const isPublicAdminRoute = publicAdminRoutes.some(route => 
        request.nextUrl.pathname === route
    );

    // Protect admin routes - if user is authenticated, they're an admin
    if (request.nextUrl.pathname.startsWith('/admin') && !isPublicAdminRoute) {
        if (!user) {
            // Redirect to login if not authenticated
            const url = request.nextUrl.clone();
            url.pathname = '/admin/login';
            return NextResponse.redirect(url);
        }
        // User is authenticated = they are an admin (only admins can sign up/login)
    }

    // Redirect authenticated users away from login page
    if (request.nextUrl.pathname === '/admin/login' && user) {
        const url = request.nextUrl.clone();
        url.pathname = '/admin';
        return NextResponse.redirect(url);
    }

    return supabaseResponse;
}
