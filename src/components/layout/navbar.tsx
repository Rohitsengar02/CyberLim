
"use client";

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import React, { useRef } from 'react';
import { MagneticLink } from '../elements/MagneticLink';
import { AnimatedLogo } from '../elements/AnimatedLogo';
import type { NavbarConfig } from '@/types/navbar';
import { cn } from '@/lib/utils';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface NavbarProps {
  config: NavbarConfig | null; // Allow null
  className?: string;
}

export const Navbar = React.forwardRef<HTMLElement, NavbarProps>(({ config, className }, ref) => {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  const safeConfig = config || {};
  const logoText = safeConfig.logoText;
  const logoImageUrl = safeConfig.logoImageUrl;
  const logoHoverText = Array.isArray(safeConfig.logoHoverText) ? safeConfig.logoHoverText : [];
  const leftMenuItems = Array.isArray(safeConfig.leftMenuItems) ? safeConfig.leftMenuItems : [];
  const rightMenuItems = Array.isArray(safeConfig.rightMenuItems) ? safeConfig.rightMenuItems : [];
  const allMenuItems = [...leftMenuItems, ...rightMenuItems];
  
  useGSAP(() => {
    // Animate background blur on scroll
    ScrollTrigger.create({
      trigger: 'body',
      start: 'top top-=20',
      end: 'bottom bottom',
      toggleClass: {
        targets: headerRef.current,
        className: 'scrolled'
      },
      // markers: true,
    });

    // Animate progress bar
    gsap.to(progressBarRef.current, {
        width: '100%',
        ease: 'none',
        scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.1
        }
    });

  }, { scope: headerRef });

  return (
    <header 
        ref={headerRef} 
        className={cn("transition-colors duration-300", className)}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="hidden md:flex h-20 items-center justify-between">
          <nav className="flex items-center space-x-2 w-1/3">
            {leftMenuItems.map((link) => (
              <MagneticLink
                key={link.label}
                href={link.href}
                className="nav-link text-sm font-medium text-muted-foreground font-sans p-2"
              >
                {link.label}
              </MagneticLink>
            ))}
          </nav>

          <div className="flex justify-center w-1/3">
            <AnimatedLogo href="/" text={logoText} imageUrl={logoImageUrl} logoHoverText={logoHoverText} />
          </div>

          <nav className="flex items-center justify-end space-x-2 w-1/3">
            {rightMenuItems.map((link) => (
              <MagneticLink
                key={link.label}
                href={link.href}
                className="nav-link text-sm font-medium text-muted-foreground font-sans p-2"
              >
                {link.label}
              </MagneticLink>
            ))}
          </nav>
        </div>

        <div className="md:hidden flex h-20 items-center justify-between">
          <AnimatedLogo href="/" text={logoText} imageUrl={logoImageUrl} />
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-primary hover:bg-accent/20">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px] bg-background p-0 text-foreground">
              <SheetHeader className="p-6 pb-2 border-b border-border/50">
                  <Link href="/" className="flex items-center" aria-label="CyberLIM Home">
                    <AnimatedLogo text={logoText} imageUrl={logoImageUrl} />
                  </Link>
              </SheetHeader>
              <nav className="flex flex-col space-y-1 p-4">
                {allMenuItems.map((link) => (
                  <SheetClose asChild key={link.label}>
                    <Link
                      href={link.href}
                      className="nav-link text-base font-medium text-muted-foreground hover:text-primary hover:bg-accent/10 transition-colors duration-200 py-3 px-3 rounded-md"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div 
        ref={progressBarRef}
        className="absolute bottom-0 left-0 h-1 bg-accent"
        style={{ 
          boxShadow: `0 0 5px hsl(var(--accent)), 0 0 10px hsl(var(--accent))`,
          width: 0,
        }}
      />
       <style jsx>{`
            .scrolled {
                background-color: hsla(var(--background) / 0.8);
                backdrop-filter: blur(4px);
                --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
                --tw-shadow-colored: 0 0 #0000;
                box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
            }
        `}</style>
    </header>
  );
});

Navbar.displayName = "Navbar";
