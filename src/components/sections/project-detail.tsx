
// src/components/sections/project-detail.tsx
'use client';

import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { X, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import type { Project } from '@/types/project';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface ProjectDetailProps {
  selectedProject: Project;
  initialBounds: DOMRect;
  onClose: () => void;
}

export function ProjectDetail({ selectedProject, initialBounds, onClose }: ProjectDetailProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Refs for navigation animation
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const [activeImage, setActiveImage] = useState(selectedProject.imageUrl);
  const allImages = [selectedProject.imageUrl, ...(selectedProject.gallery || [])].filter(Boolean) as string[];

  useGSAP(() => {
    const modal = modalRef.current;
    const backdrop = backdropRef.current;
    const content = contentRef.current;
    if (!modal || !backdrop || !content || !initialBounds) return;

    gsap.set(modal, {
      top: initialBounds.top,
      left: initialBounds.left,
      width: initialBounds.width,
      height: initialBounds.height,
      borderRadius: '0.75rem',
      overflow: 'hidden',
    });
    gsap.set(backdrop, { opacity: 0 });
    gsap.set(content, { opacity: 0 });
    
    const tl = gsap.timeline();
    tl.to(backdrop, { opacity: 1, duration: 0.5, ease: 'power2.out' })
      .to(modal, {
        top: '5vh',
        left: '5vw',
        width: '90vw',
        height: '90vh',
        borderRadius: '1rem',
        duration: 0.7,
        ease: 'expo.inOut',
      }, "<")
      .to(content, { opacity: 1, duration: 0.5, ease: 'power2.out' }, "-=0.3");

  }, [initialBounds]);

  const handleClose = () => {
    const modal = modalRef.current;
    const backdrop = backdropRef.current;
    const content = contentRef.current;
    if (!modal || !backdrop || !content || !initialBounds) {
        onClose();
        return;
    };

    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(content, { opacity: 0, duration: 0.3, ease: 'power2.in' })
      .to(modal, {
        top: initialBounds.top,
        left: initialBounds.left,
        width: initialBounds.width,
        height: initialBounds.height,
        borderRadius: '0.75rem',
        duration: 0.7,
        ease: 'expo.inOut',
      }, "<")
      .to(backdrop, { opacity: 0, duration: 0.5, ease: 'power2.inOut' }, "<");
  };

  const handleNavigate = () => {
    const backdrop = backdropRef.current;
    const imageContainer = imageContainerRef.current;
    const title = titleRef.current;
    const description = descriptionRef.current;
    const tags = tagsRef.current;
    const button = buttonRef.current;

    if (!backdrop || !imageContainer || !title || !description || !tags || !button) {
      if (selectedProject.href && selectedProject.href !== '#') {
        router.push(selectedProject.href);
      }
      onClose();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        // After the animation, navigate to the project's page.
        router.push(selectedProject.href);
        // Close the modal to clean up the UI after navigation starts.
        onClose();
      }
    });

    // Animate everything out for the page transition effect
    tl.to(backdrop, { opacity: 0, duration: 0.6, ease: 'power2.in' })
      .to(imageContainer, { y: '-100%', opacity: 0, duration: 0.7, ease: 'power3.in' }, '<')
      .to([title, description, tags, button], {
        y: 30,
        opacity: 0,
        stagger: 0.08,
        duration: 0.5,
        ease: 'power2.in'
      }, '<0.2');
  };

  if (!selectedProject) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div ref={backdropRef} className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />
      <div ref={modalRef} className="absolute bg-secondary shadow-2xl">
        <div ref={contentRef} className="w-full h-full opacity-0 flex flex-col md:flex-row text-white overflow-hidden">
          <button onClick={handleClose} className="absolute top-4 right-4 z-20 text-white/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10">
            <X className="w-6 h-6 md:w-8 md:h-8" />
            <span className="sr-only">Close</span>
          </button>
          
           <div ref={imageContainerRef} className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col bg-black">
                {/* Main Image */}
                <div className="relative flex-grow">
                    {activeImage && (
                        <Image src={activeImage} alt={selectedProject.title} fill className="object-cover" priority />
                    )}
                </div>
                {/* Gallery Thumbnails */}
                {allImages.length > 1 && (
                    <div className="flex-shrink-0 p-2 bg-black/50 backdrop-blur-sm">
                        <div className="flex space-x-2 overflow-x-auto no-scrollbar">
                            {allImages.map((imgUrl, index) => (
                                <button 
                                    key={index}
                                    onClick={() => setActiveImage(imgUrl)}
                                    className={cn(
                                        "relative w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-accent",
                                        activeImage === imgUrl ? 'border-2 border-accent' : 'border-2 border-transparent'
                                    )}
                                >
                                    <Image src={imgUrl} alt={`gallery thumbnail ${index + 1}`} fill className="object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
          
          <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col p-6 md:p-12 overflow-y-auto no-scrollbar">
            <h2 ref={titleRef} className="text-3xl md:text-5xl font-bold mb-4 text-primary">{selectedProject.title}</h2>
            <p ref={descriptionRef} className="text-base md:text-lg text-muted-foreground mb-6 flex-grow">{selectedProject.description}</p>
            <div ref={tagsRef} className="flex flex-wrap gap-2 mb-8">
              {selectedProject.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-sm border-accent text-accent backdrop-blur-sm bg-accent/10">{tag}</Badge>
              ))}
            </div>
            <Button
              ref={buttonRef}
              onClick={handleNavigate}
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 w-full md:w-auto md:self-start"
            >
              View Case Study <ArrowUpRight className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
