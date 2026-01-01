import type { Metadata } from "next";
import { LanguageSwitcher } from "@/components/dashboard/language-switcher";

export const metadata: Metadata = {
  title: "Dashboard - SmartSupport",
  description: "SmartSupport Dashboard",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary border-b border-primary/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">SmartSupport</h1>
          <LanguageSwitcher />
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}


