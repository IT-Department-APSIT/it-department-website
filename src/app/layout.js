import { Poppins, Playfair_Display, Dancing_Script, Inter } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dancing",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Department of Information Technology | A.P. Shah Institute of Technology",
  description: "Welcome to the Department of Information Technology at A.P. Shah Institute of Technology, Thane. Discover our programs, events, achievements, and innovation.",
  keywords: "IT Department, APSIT, A.P. Shah Institute of Technology, Information Technology, Engineering, Thane",
  icons: {
    icon: '/logo.jpg',
    shortcut: '/logo.jpg',
    apple: '/logo.jpg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/assets/hero-pics/IMG-20251001-WA0007.jpg" as="image" fetchPriority="high" />
        <link rel="preload" href="/assets/hero-pics/ss3.jpeg" as="image" fetchPriority="high" />
      </head>
      <body className={`${poppins.variable} ${playfairDisplay.variable} ${dancingScript.variable} ${inter.variable}`}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
