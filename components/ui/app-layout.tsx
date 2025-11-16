"use client";

import { SidebarProvider, Sidebar } from "@/components/ui/sidebar";
import { AppNavBar } from "@/components/ui/app-nav-bar";
import { MobileSidebar } from "@/components/ui/app-mobile-sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          {/* Fixed Navbar */}
          <MobileSidebar />

          <header className="fixed top-0 left-0 right-0 z-50">
            <AppNavBar />
          </header>

          {/* Content */}
          <main className="pt-16 p-4">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
