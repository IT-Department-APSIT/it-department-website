import { Poppins, Playfair_Display, Dancing_Script } from "next/font/google";
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

export const metadata = {
  title: "Department of Information Technology | A.P. Shah Institute of Technology",
  description: "Welcome to the Department of Information Technology at A.P. Shah Institute of Technology, Thane. Discover our programs, events, achievements, and innovation.",
  keywords: "IT Department, APSIT, A.P. Shah Institute of Technology, Information Technology, Engineering, Thane",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${playfairDisplay.variable} ${dancingScript.variable}`}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
