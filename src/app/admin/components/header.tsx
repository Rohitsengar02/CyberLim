"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserNav } from "./user-nav";
import { useIsMobile } from "@/hooks/use-mobile";
import Link from "next/link";

export function AdminHeader() {
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b border-border/50 bg-secondary/20 px-4 backdrop-blur-lg sm:px-6 lg:px-8">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <Link href="/" className="font-headline text-lg font-bold text-primary tracking-wider hidden md:block">
            CyberLIM
        </Link>
      </div>
      
      <div className="flex items-center gap-4">
        <UserNav />
      </div>
    </header>
  );
}
