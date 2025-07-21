
'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import Image from 'next/image';
import Link from 'next/link';
import React, { useRef, useState } from 'react';

import { cn } from '@/lib/utils';

gsap.registerPlugin(TextPlugin);

interface LogoProps {
  text?: string;
  imageUrl?: string;
  className?: string;
  logoHoverText?: string[];
  href?: string;
}

export function AnimatedLogo({ text, imageUrl, className, logoHoverText = [], href }: LogoProps) {
  const [isHovering, setIsHovering] = useState(false);
  const timeline = useRef<gsap.core.Timeline>();
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const hasHoverText = logoHoverText.length > 0;

  useGSAP(() => {
    const container = containerRef.current;
    if (!container) return;
    
    gsap.set(container, { perspective: 800 });

    if (isHovering && hasHoverText) {
      const textEl = textRef.current;
      if (!textEl) return;
      
      gsap.to(container, {
        autoAlpha: 1,
        duration: 0.4
      });
      
      timeline.current?.kill();

      timeline.current = gsap.timeline({ repeat: -1, repeatDelay: 0.4 });
      logoHoverText.forEach((phrase) => {
        timeline.current!
          .set(textEl, { text: phrase, y: '-120%', opacity: 0, rotationX: -90 })
          .to(textEl, { y: '0%', opacity: 1, rotationX: 0, duration: 0.7, ease: 'power3.out' })
          .to(textEl, { y: '120%', opacity: 0, rotationX: 90, duration: 0.7, ease: 'power3.in', delay: 1.0 });
      });

    } else {
      gsap.to(container, {
        autoAlpha: 0,
        duration: 0.3
      });
      timeline.current?.pause().clear();
    }

    return () => {
      timeline.current?.kill();
    }
  }, { scope: containerRef, dependencies: [isHovering, hasHoverText, logoHoverText] });

  const LogoContent = () => (
    <div
      className={cn("logo-container group relative flex items-center justify-center p-3 transition-all duration-300", className)}
      onMouseEnter={() => hasHoverText && setIsHovering(true)}
      onMouseLeave={() => hasHoverText && setIsHovering(false)}
    >
      <div className="relative flex items-center transition-transform duration-500 ease-out group-hover:scale-90">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={text || 'CyberLIM Logo'}
            width={120}
            height={40}
            priority
            className="object-contain h-10 w-auto"
          />
        ) : (
          <span className="font-headline text-3xl md:text-4xl font-bold text-primary tracking-wider">
            {text || 'CyberLIM'}
          </span>
        )}
      </div>
      {hasHoverText && (
        <div ref={containerRef} className="absolute inset-0 z-10 flex items-center justify-center opacity-0 pointer-events-none">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-md rounded-lg"/>
          <span ref={textRef} className="relative text-sm font-semibold text-white"></span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href}>
        <LogoContent />
      </Link>
    );
  }

  return <LogoContent />;
}
