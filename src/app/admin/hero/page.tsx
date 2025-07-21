
"use client";

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Navigation, GalleryHorizontal, Film, FileText, Scaling, LayoutGrid, Users, Settings2, Mail } from "lucide-react";

const heroSections = [
  {
    title: "Navbar",
    description: "Manage navigation links, logo, and overall header appearance.",
    icon: <Navigation className="h-6 w-6 text-accent" />,
    href: "/admin/hero/navbar",
  },
  {
    title: "Cards Carousel",
    description: "Add, edit, or delete the animated cards in the background.",
    icon: <GalleryHorizontal className="h-6 w-6 text-accent" />,
    href: "/admin/hero/cards-carousel",
  },
  {
    title: "Carousel Styling",
    description: "Adjust the size and spacing of the animated background cards.",
    icon: <Scaling className="h-6 w-6 text-accent" />,
    href: "/admin/hero/carousel-styling",
  },
  {
    title: "Animated GIF",
    description: "Change the central animated orb/GIF element.",
    icon: <Film className="h-6 w-6 text-accent" />,
    href: "/admin/hero/gif",
  },
  {
    title: "Hero Content",
    description: "Edit the main heading, paragraph, and layout.",
    icon: <FileText className="h-6 w-6 text-accent" />,
    href: "/admin/hero/content",
  },
  {
    title: "Features Section",
    description: "Manage the content and cards for the Features section.",
    icon: <LayoutGrid className="h-6 w-6 text-accent" />,
    href: "/admin/features",
  },
   {
    title: "Services Section",
    description: "Manage your offered services, including content and layout.",
    icon: <Settings2 className="h-6 w-6 text-accent" />,
    href: "/admin/services",
  },
  {
    title: "About Us Section",
    description: "Manage the content, stats, and image for the About Us section.",
    icon: <Users className="h-6 w-6 text-accent" />,
    href: "/admin/about",
  },
  {
    title: "Contact Submissions",
    description: "View and manage messages sent via the contact form.",
    icon: <Mail className="h-6 w-6 text-accent" />,
    href: "/admin/contact",
  },
];

export default function HeroAdminPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo('.hero-admin-card', {
      opacity: 0,
      y: 50,
      scale: 0.95
    }, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.15,
      delay: 0.2
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-primary">Manage Homepage Sections</h1>
      <p className="text-muted-foreground -mt-4">
        Update and customize the different components of your website's main page.
      </p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {heroSections.map((section) => (
          <Card key={section.title} className="hero-admin-card bg-secondary/30 backdrop-blur-lg border-white/10 transition-all duration-300 ease-in-out hover:scale-[1.03] hover:bg-secondary/50 hover:border-white/20 hover:shadow-xl hover:shadow-accent/10 flex flex-col">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
              {section.icon}
              <CardTitle className="text-xl font-semibold text-primary">
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">
                {section.description}
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href={section.href}>
                  Edit Section <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
