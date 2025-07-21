// src/components/elements/project-card.tsx
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import type { Project } from '@/types/project';
import Image from 'next/image';
import { BorderBeam } from '../ui/border-beam';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '../ui/button';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  return (
    <motion.div
      className="project-card group absolute w-full h-full rounded-2xl bg-black/40 backdrop-blur-lg border border-white/10 p-4 flex flex-col justify-between overflow-hidden"
      style={{
        boxShadow: '0px 20px 40px rgba(0,0,0,0.1)',
        transformOrigin: 'top center',
      }}
    >
        <BorderBeam 
            colorFrom="hsl(var(--accent))" 
            colorTo="hsl(var(--primary))" 
            delay={index * 0.2}
        />
        <div className="relative w-full h-2/3 rounded-lg overflow-hidden mb-4">
             {project.imageUrl && (
                <Image 
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
             )}
        </div>
        <div className="flex justify-between items-end">
            <div>
                <h3 className="text-xl font-bold text-primary">{project.title}</h3>
                <p className="text-sm text-muted-foreground">{project.tagline}</p>
            </div>
            <Button asChild variant="ghost" size="icon" className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white transition-transform group-hover:scale-110">
                <Link href={project.href}>
                    <ArrowUpRight className="w-6 h-6" />
                </Link>
            </Button>
        </div>
    </motion.div>
  );
};
