// src/components/sections/projects-section.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { ProjectsBackground } from '../elements/SplineScene';
import type { ProjectHeadingConfig } from '@/types/project-heading';
import { useIsMobile } from '@/hooks/use-mobile';
import { Skeleton } from '../ui/skeleton';
import { getProjectsData } from '@/lib/data';
import type { Project } from '@/types/project';
import { ProjectCard } from '../elements/project-card';

gsap.registerPlugin(ScrollTrigger);

interface ProjectsSectionProps {
  headingConfig: ProjectHeadingConfig | null;
}

export const ProjectsSection = React.forwardRef<HTMLElement, ProjectsSectionProps>(({ headingConfig }, ref) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      async function loadData() {
          setIsLoading(true);
          const fetchedProjects = await getProjectsData();
          setProjects(fetchedProjects);
          setIsLoading(false);
      }
      loadData();
  }, []);

  useGSAP(() => {
    if (isLoading || projects.length === 0 || !sectionRef.current || !cardsContainerRef.current) return;
    
    const cards = gsap.utils.toArray<HTMLElement>('.project-card');
    
    // Set initial positions
    gsap.set(cards, {
      y: (i) => i * -20, // Stack them with a vertical offset
      scale: (i) => 1 - i * 0.05,
      zIndex: (i) => projects.length - i
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        pin: true,
        scrub: 1,
        start: 'top top',
        end: () => `+=${(projects.length - 1) * 300}`,
        invalidateOnRefresh: true,
      }
    });

    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        tl.to(card, {
          y: '-=150',
          x: '+=50',
          rotation: '+=5',
          scale: '-=0.1',
          autoAlpha: 0,
          ease: 'power1.inOut',
        }, `card-${i}`);
      }
    });
    
    return () => {
      if(tl) tl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    }

  }, { scope: sectionRef, dependencies: [isLoading, projects, isMobile] });
  
  if (!headingConfig) {
    return (
      <section id="projects" ref={ref} className="relative min-h-screen snap-start bg-secondary p-8">
        <Skeleton className="w-full h-[600px]" />
      </section>
    );
  }
  
  const paddingTop = isMobile ? headingConfig.paddingTopMobile : headingConfig.paddingTopDesktop;

  return (
    <>
      <section
        id="projects"
        ref={sectionRef}
        className="relative min-h-screen snap-start bg-secondary flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden pt-16 md:pt-0"
        style={{ paddingTop: `${paddingTop}px`}}
      >
        <ProjectsBackground />

        <div className="relative z-10 w-full max-w-7xl h-full flex items-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full items-center">
                {/* Left side: Animated Cards */}
                <div 
                    ref={cardsContainerRef} 
                    className="relative w-full h-[300px] md:h-[450px]"
                    style={{ perspective: '1000px' }}
                >
                    {isLoading ? (
                        <Skeleton className="w-full h-full rounded-2xl" />
                    ) : (
                        projects.map((project, index) => (
                            <ProjectCard key={project.id} project={project} index={index} />
                        ))
                    )}
                </div>

                {/* Right side: Text Content */}
                <div className="text-left md:pl-10">
                    <h2 className="text-5xl md:text-7xl font-extrabold text-primary mb-6 leading-tight">
                        {headingConfig.heading.split(' ').map((word, i) => (
                            <span key={i} className="block">{word}</span>
                        ))}
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-md">
                        {headingConfig.paragraph}
                    </p>
                </div>
            </div>
        </div>
      </section>
    </>
  );
});

ProjectsSection.displayName = "ProjectsSection";
