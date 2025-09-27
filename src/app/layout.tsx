import type { Metadata } from "next";
import "./globals.css";
import 'aos/dist/aos.css';
import { Montserrat, Great_Vibes } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-greatvibes",
});

export const metadata: Metadata = {
  title: "Wedding Invitation Faqih & Nia",
  description: "Digital wedding invitation of Faqih & Nia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${montserrat.variable} ${greatVibes.variable}`}>
      <body className="font-[var(--font-montserrat)] bg-white text-gray-800 antialiased">
        {children}
      </body>
    </html>
  );
}
