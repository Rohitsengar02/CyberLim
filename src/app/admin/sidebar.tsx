
"use client";

import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { LayoutDashboard, FolderKanban, Settings, LayoutTemplate, LayoutGrid, Users, Settings2, Mail } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export function AdminSidebar() {
  const pathname = usePathname();
  const sidebarContentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sidebarContentRef.current) return;
    gsap.from(".sidebar-menu-item", {
      opacity: 0,
      x: -20,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power2.out',
      delay: 0.3
    });
  }, { scope: sidebarContentRef });


  return (
    <Sidebar
      className="border-border/50 backdrop-blur-xl sidebar-animated-gradient overflow-hidden [&>div]:bg-transparent"
      variant="inset"
      collapsible="icon"
    >
      <div className="sidebar-blob-1" />
      <div className="sidebar-blob-2" />

      <SidebarHeader className="h-16 justify-between border-b border-border/50 p-3 bg-transparent">
        <Link href="/admin" className="flex items-center gap-2">
           
        </Link>
        <SidebarTrigger className="hidden md:flex" />
      </SidebarHeader>

      <SidebarContent ref={sidebarContentRef} className="bg-transparent">
        <SidebarMenu className="gap-y-2">
          <SidebarMenuItem className="sidebar-menu-item">
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith("/admin/dashboard") || pathname === "/admin"}
              tooltip="Dashboard"
              className="data-[active=true]:bg-white/10 hover:bg-white/10"
            >
              <Link href="/admin">
                <LayoutDashboard />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="sidebar-menu-item">
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith("/admin/hero")}
              tooltip="Hero Section"
              className="data-[active=true]:bg-white/10 hover:bg-white/10"
            >
              <Link href="/admin/hero">
                <LayoutTemplate />
                <span>Hero Section</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="sidebar-menu-item">
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith("/admin/features")}
              tooltip="Features Section"
              className="data-[active=true]:bg-white/10 hover:bg-white/10"
            >
              <Link href="/admin/features">
                <LayoutGrid />
                <span>Features</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem className="sidebar-menu-item">
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith("/admin/services")}
              tooltip="Services Section"
              className="data-[active=true]:bg-white/10 hover:bg-white/10"
            >
              <Link href="/admin/services">
                <Settings2 />
                <span>Services</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem className="sidebar-menu-item">
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith("/admin/about")}
              tooltip="About Section"
              className="data-[active=true]:bg-white/10 hover:bg-white/10"
            >
              <Link href="/admin/about">
                <Users />
                <span>About Section</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="sidebar-menu-item">
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith("/admin/projects")}
              tooltip="Projects"
              className="data-[active=true]:bg-white/10 hover:bg-white/10"
            >
              <Link href="/admin/projects">
                <FolderKanban />
                <span>Projects</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="sidebar-menu-item">
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith("/admin/contact")}
              tooltip="Contact"
              className="data-[active=true]:bg-white/10 hover:bg-white/10"
            >
              <Link href="/admin/contact">
                <Mail />
                <span>Contact</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="sidebar-menu-item">
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith("/admin/settings")}
              tooltip="Settings"
              className="data-[active=true]:bg-white/10 hover:bg-white/10"
            >
              <Link href="#">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
