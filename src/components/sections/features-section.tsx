
// src/components/sections/features-section.tsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FeaturesBackground } from '../elements/SplineScene';
import type { FeaturesContentConfig } from '@/types/features-content';
import { useIsMobile } from '@/hooks/use-mobile';
import { getFeatureCards } from '@/lib/data';
import { Skeleton } from '../ui/skeleton';
import { Icon } from '@/lib/icons';
import { cn } from '@/lib/utils';
import { GlowingCard } from '../ui/glowing-cards';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface FeaturesSectionProps {
  config: FeaturesContentConfig;
}

export const FeaturesSection = React.forwardRef<HTMLElement, FeaturesSectionProps>(({ config }, ref) => {
  const [cards, setCards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const fetchedCards = await getFeatureCards();
      setCards(fetchedCards);
      setIsLoading(false);
    }
    loadData();
  }, []);

  useGSAP(() => {
    if (isLoading || cards.length === 0 || !sectionRef.current) return;

    const cardsArray = gsap.utils.toArray<HTMLElement>('.feature-card');
    
    // Set initial properties for all cards
    gsap.set(cardsArray, { 
      position: 'absolute', 
      top: '50%', 
      left: '50%', 
      xPercent: -50, 
      yPercent: -50,
      scale: 0.9,
      autoAlpha: 0,
    });
    
    // Set properties for the first card to be visible initially
    gsap.set(cardsArray[0], { scale: 1, autoAlpha: 1 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        pin: true,
        scrub: 1,
        start: 'top top',
        end: () => `+=${cardsArray.length * (isMobile ? 300 : 500)}`, // Give each card transition scroll distance
        invalidateOnRefresh: true,
      },
    });

    cardsArray.forEach((card, index) => {
      // Don't animate the first card in, it's already there
      if (index > 0) {
        tl.to(cardsArray[index - 1], { // Animate previous card out
          xPercent: isMobile ? -50 : -100, // Move left
          scale: 0.9,
          autoAlpha: 0,
          ease: 'power2.inOut',
        }, `card-${index}`)
        .fromTo(card, { // Animate current card in
            xPercent: isMobile ? -50 : 100,
            scale: 0.9,
            autoAlpha: 0,
        }, {
            xPercent: -50,
            scale: 1,
            autoAlpha: 1,
            ease: 'power2.inOut',
        }, `card-${index}`); // Start at the same time as the previous card animates out
      }
    });

    // Ensure the last card stays in the center at the end
    if (cardsArray.length > 0) {
        tl.to({}, { duration: 0.1 }); // Add a small delay to ensure the last animation completes
    }

    return () => {
      if(tl) tl.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    }

  }, { scope: sectionRef, dependencies: [isLoading, cards, isMobile] });
  
  const paddingTop = isMobile ? config.paddingTopMobile : config.paddingTopDesktop;

  const renderCards = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <Skeleton className="w-[320px] h-[250px] rounded-2xl" />
        </div>
      );
    }

    return cards.map((card) => (
      <div key={card.id} className="feature-card w-[320px] md:w-[400px]">
        <GlowingCard className="flex-col items-start text-left h-[280px] md:h-[320px]">
          <div className="mb-4 flex-shrink-0 w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center border border-accent/30">
            <Icon name={card.iconName} className="w-7 h-7 text-accent" />
          </div>
          <h3 className="text-xl font-bold text-primary mb-2">{card.title}</h3>
          <p className="text-sm text-muted-foreground flex-grow mb-4">{card.description}</p>
        </GlowingCard>
      </div>
    ));
  };

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative min-h-screen w-full snap-start bg-background flex flex-col justify-start overflow-hidden"
      style={{ paddingTop: `${paddingTop}px`}}
    >
      <FeaturesBackground />
      <div className="relative z-10 w-full flex-grow flex flex-col">
        <div className="text-center mb-10 md:mb-16 px-4">
          <h2 className="text-4xl md:text-6xl font-bold text-primary mb-4 md:mb-6">{config.heading}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{config.paragraph}</p>
        </div>
        
        {/* Container for the cards animation */}
        <div className="relative flex-grow w-full">
          {renderCards()}
        </div>
      </div>
    </section>
  );
});

FeaturesSection.displayName = "FeaturesSection";
