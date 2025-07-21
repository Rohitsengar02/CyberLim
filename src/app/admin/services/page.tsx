
"use client";

import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, GalleryHorizontal, Rows } from "lucide-react";
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';
import gsap from 'gsap';

const servicesSections = [
  {
    title: "Heading & Content",
    description: "Edit the main title, paragraph, and vertical spacing.",
    icon: <FileText className="h-6 w-6 text-accent" />,
    href: "/admin/services/heading",
  },
  {
    title: "Service Cards",
    description: "Add, edit, or delete the individual service cards.",
    icon: <GalleryHorizontal className="h-6 w-6 text-accent" />,
    href: "/admin/services/cards",
  },
  {
    title: "Layout",
    description: "Adjust the layout of the cards (grid, bento, carousel).",
    icon: <Rows className="h-6 w-6 text-accent" />,
    href: "/admin/services/layout",
  },
];

export default function ServicesAdminPage() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.fromTo('.service-admin-card', {
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
    <div ref={containerRef} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {servicesSections.map((section) => (
        <Card key={section.title} className="service-admin-card bg-secondary/30 backdrop-blur-lg border-white/10 transition-all duration-300 ease-in-out hover:scale-[1.03] hover:bg-secondary/50 hover:border-white/20 hover:shadow-xl hover:shadow-accent/10 flex flex-col">
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
                Edit Section
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
