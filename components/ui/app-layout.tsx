"use client";

import { SidebarProvider, Sidebar } from "@/components/ui/sidebar";
import { AppNavBar } from "@/components/ui/app-nav-bar";
import { MobileSidebar } from "@/components/ui/app-mobile-sidebar";
import Image from "next/image";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full">
        <Sidebar />

        <div className="flex-1 flex flex-col  w-full">
          {/* Fixed Navbar */}
          <MobileSidebar />

          <header className="fixed top-0 left-0 right-0 z-50">
            <AppNavBar />
          </header>

          {/* Content */}
          <main className="pt-16">
            <Image
              src={"/assets/bannerv3.png"}
              width={1600}
              height={100}
              alt="Top Image"
              className="max-h-96 object-cover"
              loading="eager"
            />
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
