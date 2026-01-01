import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { LanguageProvider } from "@/contexts/language-context";
import { Toaster } from "@/components/ui/toaster";

const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-open-sans" });

export const metadata: Metadata = {
  title: "SmartSupport - AI-Powered Ticket Classification",
  description: "Intelligent ticket classification and support system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${openSans.variable} ${openSans.className}`}>
        <LanguageProvider>
          <Providers>
            {children}
            <Toaster />
          </Providers>
        </LanguageProvider>
      </body>
    </html>
  );
}


