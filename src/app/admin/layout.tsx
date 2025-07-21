
"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "./components/sidebar";
import { AdminHeader } from "./components/header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
        <AdminSidebar />
        <main className="relative flex flex-1 flex-col bg-transparent">
          <div className="admin-content-blob-1" />
          <div className="admin-content-blob-2" />
          <AdminHeader />
          <div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
    </SidebarProvider>
  );
}
