"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";

export default function LayoutWrapper({ children }) {
    const pathname = usePathname();
    const isAdminPage = pathname?.startsWith("/admin");
    const isEventDetailPage = /^\/events\/[^/]+$/.test(pathname);

    return (
        <>
            {!isAdminPage && <Loading />}
            {!isAdminPage && <Navbar />}
            <main>{children}</main>
            {!isAdminPage && !isEventDetailPage && <Footer />}
        </>
    );
}
