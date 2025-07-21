'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Skeleton } from '@/components/ui/skeleton';
import { getServiceCards } from '@/lib/data';
import type { ServicesHeadingConfig } from '@/types/services-heading';
import type { ServiceCard } from '@/types/service-card';
import { ServiceCard as ServiceCardComponent } from '../elements/service-card';
import { cn } from '@/lib/utils';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';

gsap.registerPlugin(ScrollTrigger);

interface ServicesSectionProps {
  headingConfig: ServicesHeadingConfig | null;
}

const headingContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export const ServicesSection = React.forwardRef<HTMLElement, ServicesSectionProps>(({ headingConfig }, ref) => {
  const [cards, setCards] = useState<ServiceCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const fetchedCards = await getServiceCards();
      setCards(fetchedCards);
      setIsLoading(false);
    }
    loadData();
  }, []);

  useGSAP(() => {
    if (isLoading || isMobile || !sectionRef.current || !cardsContainerRef.current) return;

    const cardsWrapper = cardsContainerRef.current;
    const cardsArray = gsap.utils.toArray<HTMLElement>('.service-card');
    
    // Calculate the total width needed to scroll
    const scrollWidth = cardsWrapper.scrollWidth - window.innerWidth;

    const tl = gsap.to(cardsWrapper, {
        x: -scrollWidth,
        ease: 'none',
        scrollTrigger: {
            trigger: sectionRef.current,
            pin: true,
            scrub: 1,
            end: () => `+=${scrollWidth}`,
            invalidateOnRefresh: true,
        }
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    }

  }, { scope: sectionRef, dependencies: [isLoading, cards, isMobile] });


  if (!headingConfig) {
    return <section id="services" ref={ref} className="relative min-h-screen snap-start flex items-center justify-center p-8 bg-background"><Skeleton className="w-full h-[600px]" /></section>;
  }

  const paddingTop = isMobile ? headingConfig.paddingTopMobile : headingConfig.paddingTopDesktop;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-[420px] rounded-2xl" />)}
        </div>
      );
    }
    
    if (isMobile) {
      return (
        <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={{
                visible: { transition: { staggerChildren: 0.1 } }
            }}
        >
          {cards.map((card, index) => (
             <motion.div key={card.id} variants={cardVariants} custom={index}>
              <ServiceCardComponent card={card} index={index} />
             </motion.div>
          ))}
        </motion.div>
      );
    }

    // Desktop Horizontal Scroll
    return (
       <div ref={cardsContainerRef} className="flex flex-nowrap items-center h-full px-[10vw]">
        {cards.map((card, index) => (
          <div key={card.id} className="w-[320px] md:w-[400px] shrink-0 px-4">
            <ServiceCardComponent card={card} index={index} />
          </div>
        ))}
       </div>
    );
  };

  return (
    <section 
      id="services" 
      ref={sectionRef} 
      className="relative bg-background overflow-hidden py-16 md:py-0 md:min-h-screen md:flex md:flex-col"
      style={{paddingTop: isMobile ? `${paddingTop}px` : undefined}}
    >
      <div className="absolute inset-0 z-0">
          <div className="about-blob about-blob-1" />
          <div className="about-blob about-blob-2" />
      </div>

      <div className="container mx-auto relative z-10 flex flex-col flex-grow justify-center">
        <motion.div 
            className="text-center mb-12 md:mb-16 pt-16 md:pt-0" 
            variants={headingContainerVariants} 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
        >
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-primary mb-4">{headingConfig.heading}</motion.h2>
          <motion.p variants={itemVariants} className="text-lg text-muted-foreground max-w-3xl mx-auto">{headingConfig.paragraph}</motion.p>
        </motion.div>
        
        <div className={cn("w-full flex-grow flex items-center", isMobile ? 'justify-center' : '')}>
          {renderContent()}
        </div>
      </div>
    </section>
  );
});

ServicesSection.displayName = "ServicesSection";
