// src/components/sections/interactive-card.tsx
'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { type LucideIcon } from 'lucide-react';
import React, { useRef } from 'react';

export interface CardData {
  title: string;
  description: string;
  Icon: LucideIcon;
}

interface InteractiveCardProps {
  data: CardData;
  width: number;
  height: number;
  blur: number;
}

export const InteractiveCard = React.forwardRef<HTMLDivElement, InteractiveCardProps>(({ data, width, height, blur }, ref) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const card = cardRef.current;
    if (!card) return;

    const torch = card.querySelector<HTMLElement>('.radial-spotlight');
    if (!torch) return;

    const torchX = gsap.quickTo(torch, "x", { duration: 0.4, ease: "power2.out" });
    const torchY = gsap.quickTo(torch, "y", { duration: 0.4, ease: "power2.out" });

    const handleMouseMove = (e: MouseEvent) => {
      const { left, top } = card.getBoundingClientRect();
      const mouseX = e.clientX - left;
      const mouseY = e.clientY - top;
      
      torchX(mouseX); // Torch follows cursor
      torchY(mouseY);
    };

    const handleMouseEnter = () => {
      gsap.to(card, { scale: 1.05, duration: 0.4, ease: 'power3.out' });
      gsap.to(torch, { opacity: 1, duration: 0.4, ease: 'power2.out' });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        scale: 1,
        ease: 'elastic.out(1, 0.4)',
        duration: 0.8
      });
      gsap.to(torch, { opacity: 0, duration: 0.5, ease: 'power2.out' });
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, { scope: cardRef });

  return (
    <div
      ref={ref}
      className="shrink-0 snap-center"
      style={{ 
        transformStyle: 'preserve-3d',
        width: `${width}px` 
      }}
    >
      <div 
        ref={cardRef} 
        className="relative rounded-2xl p-4 bg-white/5 border border-white/10 shadow-2xl shadow-black/40 cursor-pointer overflow-hidden will-change-transform flex flex-col"
        style={{
          height: `${height}px`,
          backdropFilter: `blur(${blur}px)`,
        }}
      >
        <div className="radial-spotlight" />
        
        <div className="relative z-10 flex flex-col h-full">
            {/* Image/Icon Area */}
            <div className="flex-grow flex items-center justify-center bg-white/5 rounded-xl mb-6 p-8">
                <div className="w-20 h-20 rounded-full bg-accent/80 flex items-center justify-center text-accent-foreground shadow-lg">
                    <data.Icon className="w-10 h-10" />
                </div>
            </div>

            {/* Text Area */}
            <div className="text-center px-2">
                <h3 className="text-lg font-semibold text-white mb-1">{data.title}</h3>
                <p className="text-white/60 text-sm leading-snug">{data.description}</p>
            </div>
        </div>
      </div>
    </div>
  );
});

InteractiveCard.displayName = "InteractiveCard";
