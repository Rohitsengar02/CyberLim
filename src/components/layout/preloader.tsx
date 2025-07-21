
'use client';

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(TextPlugin);

interface PreloaderProps {
  onComplete: () => void;
}

const PARTICLE_COUNT = 50;

export const Preloader = React.forwardRef<HTMLDivElement, PreloaderProps>(
  ({ onComplete }, ref) => {
    const preloaderRef = useRef<HTMLDivElement>(null);
    const phase1Ref = useRef<HTMLDivElement>(null);
    const phase2Ref = useRef<HTMLDivElement>(null);
    const kineticTextRef = useRef<HTMLHeadingElement>(null);
    const particlesContainerRef = useRef<HTMLDivElement>(null);
    const particleRefs = useRef<HTMLDivElement[]>([]);

    const splitTextIntoChars = (el: HTMLElement) => {
        const text = el.textContent || '';
        el.innerHTML = '';
        text.split('').forEach(char => {
            const span = document.createElement('span');
            span.className = 'char inline-block';
            span.textContent = char === ' ' ? '\u00A0' : char;
            el.appendChild(span);
        });
        return el.querySelectorAll('.char');
    };

    const breakIntoParticles = (element: HTMLElement) => {
        if (!particlesContainerRef.current || !preloaderRef.current) return;

        const rect = element.getBoundingClientRect();
        const preloaderRect = preloaderRef.current.getBoundingClientRect();

        particleRefs.current.forEach((particle) => {
            if (!particle) return;
            gsap.set(particle, {
                x: rect.left - preloaderRect.left + (Math.random() * rect.width),
                y: rect.top - preloaderRect.top + (Math.random() * rect.height),
                opacity: 1,
                scale: 1,
                display: 'block'
            });

            gsap.to(particle, {
                x: `+=${(Math.random() - 0.5) * 400}`,
                y: `+=${(Math.random() - 0.5) * 400}`,
                opacity: 0,
                scale: Math.random() * 0.5 + 0.5,
                duration: 0.8 + Math.random() * 0.5,
                ease: 'power2.out',
                onComplete: () => {
                    gsap.set(particle, { display: 'none' });
                }
            });
        });
    };

    useGSAP(() => {
      const container = preloaderRef.current;
      if (!container) return;

      const phase1 = phase1Ref.current;
      const phase2 = phase2Ref.current;
      const kineticTextEl = kineticTextRef.current;
      
      const logoEl = phase2?.querySelector('.logo');
      const sweepEl = phase2?.querySelector('.sweep');
      const tagline1El = phase2?.querySelector('.tagline-1');
      const tagline2El = phase2?.querySelector('.tagline-2');

      if (!phase1 || !phase2 || !kineticTextEl || !logoEl || !tagline1El || !tagline2El || !sweepEl) return;
      
      const dotsContainer = container.querySelector('.dots-bg');
      if (dotsContainer) {
          for(let i=0; i < 50; i++) {
              const dot = document.createElement('div');
              dot.className = 'bg-dot';
              dotsContainer.appendChild(dot);
              gsap.set(dot, {
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  opacity: 0,
              });
              gsap.to(dot, {
                  x: `+=${(Math.random() - 0.5) * 200}`,
                  y: `+=${(Math.random() - 0.5) * 200}`,
                  opacity: Math.random() * 0.3,
                  duration: 5 + Math.random() * 5,
                  repeat: -1,
                  yoyo: true,
                  ease: 'sine.inOut'
              })
          }
      }

      const tl = gsap.timeline({
        delay: 0.5,
        onComplete: onComplete
      });
      
      gsap.set(phase2, { autoAlpha: 0 });

      tl.fromTo(kineticTextEl, { text: { value: "Have an idea?", padSpace: true }, autoAlpha: 0, x: -50 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: 'power2.out' });
      tl.to(kineticTextEl, { autoAlpha: 0, duration: 0.2, delay: 0.4 });
      
      tl.fromTo(kineticTextEl, { text: { value: "Need a product?", padSpace: true }, autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(1.7)' });
      tl.to(kineticTextEl, { autoAlpha: 0, duration: 0.2, delay: 0.4 });
      
      tl.call(() => {
          kineticTextEl.textContent = "We build your vision.";
          const chars = splitTextIntoChars(kineticTextEl);
          gsap.fromTo(chars, 
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.03 }
          );
      });
      tl.to(kineticTextEl, { autoAlpha: 0, duration: 0.2, delay: 0.8 });
      
      tl.to(kineticTextEl, { text: { value: "With code that performs.", speed: 1 }, autoAlpha: 1, duration: 0.8, ease: 'none' });
      tl.to({}, { duration: 0.5 });
      
      tl.call(() => breakIntoParticles(kineticTextEl));
      tl.to(kineticTextEl, { autoAlpha: 0, duration: 0.1 });
      tl.to(phase2, { autoAlpha: 1, duration: 0.3 }, ">-0.5");

      tl.from(logoEl, { y: 20, autoAlpha: 0, duration: 0.5, ease: 'power2.out' });
      tl.fromTo(sweepEl, { x: '-100%' }, { x: '100%', duration: 0.7, ease: 'power2.inOut' }, "<0.1");

      tl.from(tagline1El, { y: 10, autoAlpha: 0, duration: 0.4, ease: 'power2.out' }, "-=0.2");
      tl.from(tagline2El, { scale: 0.9, autoAlpha: 0, duration: 0.4, ease: 'back.out(1.7)' });
      
      tl.to({}, { duration: 1.0 });

    }, { scope: preloaderRef, dependencies: [onComplete] });

    return (
      <div ref={preloaderRef} className="preloader-container fixed inset-0 z-[100] flex items-center justify-center bg-[#141414] text-primary overflow-hidden">
        <div className="dots-bg absolute inset-0 z-0 opacity-50" />
        <div ref={particlesContainerRef} className="particles-container absolute inset-0 z-20 pointer-events-none">
            {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
                <div key={i} ref={el => { if(el) particleRefs.current[i] = el }} className="particle hidden" />
            ))}
        </div>

        <div ref={phase1Ref} className="absolute text-center z-10">
            <h1 ref={kineticTextRef} className="text-3xl md:text-5xl font-semibold text-white/90"></h1>
        </div>
        
        <div ref={phase2Ref} className="absolute flex flex-col items-center justify-center opacity-0 z-10">
            <h1 className="logo font-headline text-5xl md:text-7xl font-bold text-primary tracking-wider relative overflow-hidden p-2">
                 Cyber Lim
                 <span className="sweep absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            </h1>
            <p className="tagline-1 mt-4 text-lg md:text-xl text-white/80 tracking-widest font-light">
                A Software Solution Company
            </p>
            <p className="tagline-2 mt-2 text-md text-accent tracking-wider font-semibold">
                Let’s Code and Create.
            </p>
        </div>

        <style jsx>{`
            .bg-dot {
                position: absolute;
                width: 3px;
                height: 3px;
                background-color: hsl(var(--accent));
                border-radius: 50%;
                will-change: transform, opacity;
            }
            .particle {
                position: absolute;
                width: 4px;
                height: 4px;
                background-color: hsl(var(--primary));
                border-radius: 50%;
                will-change: transform, opacity;
            }
        `}</style>
      </div>
    );
  }
);
Preloader.displayName = 'Preloader';
