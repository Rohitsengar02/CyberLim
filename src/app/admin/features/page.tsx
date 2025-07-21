
"use client";

import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, GalleryHorizontal, Rows } from "lucide-react";
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';
import gsap from 'gsap';

const featuresSections = [
  {
    title: "Heading & Content",
    description: "Edit the main title, paragraph, and vertical spacing.",
    icon: <FileText className="h-6 w-6 text-accent" />,
    href: "/admin/features/heading",
  },
  {
    title: "Feature Cards",
    description: "Add, edit, or delete the individual feature cards.",
    icon: <GalleryHorizontal className="h-6 w-6 text-accent" />,
    href: "/admin/features/cards",
    disabled: false,
  },
  {
    title: "Layout & Animation",
    description: "Adjust the layout and animation properties of the section.",
    icon: <Rows className="h-6 w-6 text-accent" />,
    href: "/admin/features/layout",
    disabled: false,
  },
];

export default function FeaturesAdminPage() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.fromTo('.feature-admin-card', {
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
      {featuresSections.map((section) => (
        <Card key={section.title} className="feature-admin-card bg-secondary/30 backdrop-blur-lg border-white/10 transition-all duration-300 ease-in-out hover:scale-[1.03] hover:bg-secondary/50 hover:border-white/20 hover:shadow-xl hover:shadow-accent/10 flex flex-col">
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
            <Button asChild variant="outline" className="w-full" disabled={section.disabled}>
              <Link href={section.href}>
                {section.disabled ? "Coming Soon" : "Edit Section"}
                {!section.disabled && <ArrowRight className="ml-2 h-4 w-4" />}
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
