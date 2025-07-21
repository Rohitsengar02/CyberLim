
"use client";

import { SlidingCardAnimation } from '@/components/elements/SlidingCardAnimation';
import { HeroAnimationElement } from '@/components/elements/HeroAnimationElement';
import { useIsMobile } from '@/hooks/use-mobile';
import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import type { HeroCard } from '@/types/hero-card';
import type { HeroContentConfig } from '@/types/hero-content';
import { Navbar } from '../layout/navbar';
import type { NavbarConfig } from '@/types/navbar';

gsap.registerPlugin(useGSAP, TextPlugin);

interface HeroSectionProps {
    heroCards: HeroCard[];
    heroContentConfig: HeroContentConfig;
    navbarConfig: NavbarConfig | null;
}

export const HeroSection = React.forwardRef<HTMLElement, HeroSectionProps>(({ 
  heroCards, 
  heroContentConfig,
  navbarConfig,
}, ref) => {
  const headingContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  const { 
    heading, 
    paragraph,
    headingFontSizeDesktop,
    headingFontSizeMobile,
    paragraphFontSizeDesktop,
    paragraphFontSizeMobile,
    glassWidthDesktop,
    glassHeightDesktop,
    glassWidthMobile,
    glassHeightMobile
  } = heroContentConfig;

  useGSAP(() => {
    const container = headingContainerRef.current;
    if (!container || !heading) return;

    // Setup heading characters
    const h1 = container.querySelector('.heading-main');
    if (h1) {
      h1.innerHTML = '';
      heading.split('\n').forEach((line) => {
        const lineSpan = document.createElement('span');
        lineSpan.className = 'block';
        if (line.trim() === '') {
          lineSpan.innerHTML = '&nbsp;';
        } else {
          line.split('').forEach(char => {
              const charSpan = document.createElement('span');
              charSpan.className = 'char inline-block';
              charSpan.innerHTML = char === ' ' ? '&nbsp;' : char;
              lineSpan.appendChild(charSpan);
          });
        }
        h1.appendChild(lineSpan);
      });
    }
    
    const p = container.querySelector('.hero-paragraph');
    if (p) {
        p.textContent = paragraph;
    }


    const torch = container.querySelector<HTMLElement>('.torch');
    const allChars = gsap.utils.toArray<HTMLElement>('.char');
    const heroParagraph = container.querySelector<HTMLElement>('.hero-paragraph');
    if (!torch || !heroParagraph || !allChars.length) return;

    const charMagnifyFns = allChars.map(char => ({
      scale: gsap.quickTo(char, "scale", { duration: 0.5, ease: 'power3.out' }),
      x: gsap.quickTo(char, "x", { duration: 0.5, ease: 'power3.out' }),
      y: gsap.quickTo(char, "y", { duration: 0.5, ease: 'power3.out' }),
    }));
    
    const paragraphMagnifyFns = {
      scale: gsap.quickTo(heroParagraph, "scale", { duration: 0.5, ease: 'power3.out' }),
      x: gsap.quickTo(heroParagraph, "x", { duration: 0.5, ease: 'power3.out' }),
      y: gsap.quickTo(heroParagraph, "y", { duration: 0.5, ease: 'power3.out' }),
    };

    const torchX = gsap.quickTo(torch, "x", { duration: 0.4, ease: "power2.out" });
    const torchY = gsap.quickTo(torch, "y", { duration: 0.4, ease: "power2.out" });

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { top, left } = container.getBoundingClientRect();
      const mouseX = clientX - left;
      const mouseY = clientY - top;

      torchX(mouseX);
      torchY(mouseY);
      
      allChars.forEach((char, i) => {
        const { offsetLeft, offsetTop, clientWidth, clientHeight } = char;
        const charX = offsetLeft + clientWidth / 2;
        const charY = offsetTop + clientHeight / 2;
        const dx = charX - mouseX;
        const dy = charY - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 100;

        if (distance < maxDist) {
          const scale = gsap.utils.mapRange(0, maxDist, 1.8, 1, distance);
          const moveX = gsap.utils.mapRange(0, maxDist, dx * -0.2, 0, distance);
          const moveY = gsap.utils.mapRange(0, maxDist, dy * -0.2, 0, distance);
          charMagnifyFns[i].scale(scale);
          charMagnifyFns[i].x(moveX);
          charMagnifyFns[i].y(moveY);
        } else {
          charMagnifyFns[i].scale(1);
          charMagnifyFns[i].x(0);
          charMagnifyFns[i].y(0);
        }
      });
      
      const { offsetLeft, offsetTop, clientWidth, clientHeight } = heroParagraph;
      const paraX = offsetLeft + clientWidth / 2;
      const paraY = offsetTop + clientHeight / 2;
      const dx = paraX - mouseX;
      const dy = paraY - mouseY;
      const distance = Math.sqrt(dx*dx + dy*dy);
      const maxDist = 150;

      if (distance < maxDist) {
        const scale = gsap.utils.mapRange(0, maxDist, 1.1, 1, distance);
        const moveX = gsap.utils.mapRange(0, maxDist, dx * -0.05, 0, distance);
        const moveY = gsap.utils.mapRange(0, maxDist, dy * -0.05, 0, distance);
        paragraphMagnifyFns.scale(scale);
        paragraphMagnifyFns.x(moveX);
        paragraphMagnifyFns.y(moveY);
      } else {
        paragraphMagnifyFns.scale(1);
        paragraphMagnifyFns.x(0);
        paragraphMagnifyFns.y(0);
      }
    };

    const handleMouseEnter = () => {
        if(!torch) return;
        gsap.to(torch, { scale: 1, autoAlpha: 1, duration: 0.3 });
    };

    const handleMouseLeave = () => {
      if(!torch) return;
      gsap.to(torch, { autoAlpha: 0, duration: 0.3 });
      allChars.forEach((_, i) => {
        charMagnifyFns[i].scale(1);
        charMagnifyFns[i].x(0);
        charMagnifyFns[i].y(0);
      });
      paragraphMagnifyFns.scale(1);
      paragraphMagnifyFns.x(0);
      paragraphMagnifyFns.y(0);
    }

    container.addEventListener('mouseenter', handleMouseEnter, true);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave, true);

    return () => {
      container.removeEventListener('mouseenter', handleMouseEnter, true);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave, true);
    };

  }, { scope: headingContainerRef, dependencies: [heading, paragraph] });

  const glassStyle = {
    width: isMobile ? glassWidthMobile : glassWidthDesktop,
    height: isMobile ? glassHeightMobile : glassHeightDesktop,
  };
  
  const headingStyle = {
    fontSize: `${isMobile ? headingFontSizeMobile : headingFontSizeDesktop}px`,
  };

  const pStyle = {
    fontSize: `${isMobile ? paragraphFontSizeMobile : paragraphFontSizeDesktop}px`,
  };

  return (
    <section 
      id="home" 
      ref={ref}
      className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden text-center bg-background p-0"
    >
      {navbarConfig && (
         <Navbar 
          config={navbarConfig}
          className="navbar-header absolute top-0 left-0 right-0 z-50"
        />
      )}
     

      <div className="hero-animation-container absolute inset-0 z-10 pointer-events-none">
        <HeroAnimationElement />
      </div>

      <div className="absolute inset-0 z-0 cards-container">
        <SlidingCardAnimation cardsData={heroCards} />
      </div>

      <div 
        style={glassStyle}
        className="absolute inset-x-0 mx-auto z-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/10 backdrop-blur-sm rounded-3xl border border-white/5 pointer-events-none" 
      />
      
      <div className="container mx-auto relative z-40 flex flex-col items-center justify-center h-full pt-20 md:pt-24 px-4 md:px-8">
        <div ref={headingContainerRef} className="w-full text-center relative" data-cursor-torch>
          <div className="torch absolute top-0 left-0 w-48 h-48 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0">
            <div className="torch-main" />
          </div>
          
           <div className="relative" style={{ mixBlendMode: 'difference' }}>
              <h1 
                className="font-headline font-extrabold text-primary leading-tight heading-main"
                style={headingStyle}
              >
                 {/* Content injected by GSAP */}
              </h1>
              <p 
                className="hero-paragraph mt-2 pb-12 text-white max-w-sm mx-auto"
                style={pStyle}
              >
                {/* Content injected by GSAP */}
              </p>
          </div>
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = "HeroSection";
