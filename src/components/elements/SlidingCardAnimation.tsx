
'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import type { HeroCard } from '@/types/hero-card';
import { getHeroCarouselConfig } from '@/lib/data';
import type { HeroCarouselConfig } from '@/types/hero-carousel-config';
import { Skeleton } from '@/components/ui/skeleton';

const cardGap = 10;
const speed = 0.05; // pixels per ms

interface SlidingCardAnimationProps {
    cardsData: HeroCard[];
}

export function SlidingCardAnimation({ cardsData }: SlidingCardAnimationProps) {
  const isMobile = useIsMobile();
  const [config, setConfig] = useState<HeroCarouselConfig | null>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    async function fetchConfig() {
      const carouselConfig = await getHeroCarouselConfig();
      setConfig(carouselConfig);
    }
    fetchConfig();
  }, []);

  const initializeCards = useCallback(() => {
    if (!containerRef.current || cardsData.length === 0 || !config) {
        setCards([]);
        setIsInitialized(false);
        return;
    };

    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    
    let initialCards: any[] = [];
    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;

    const cardWidth = isMobile ? config.cardWidthMobile : config.cardWidthDesktop;
    const cardHeight = isMobile ? config.cardHeightMobile : config.cardHeightDesktop;

    if (isMobile) {
        if (containerHeight === 0) return;
        const numCardsNeeded = Math.ceil(containerHeight / (cardHeight + cardGap)) + 2;
        const loopedData = Array.from({ length: numCardsNeeded }).map((_, i) => cardsData[i % cardsData.length]);
        initialCards = loopedData.map((profile, i) => {
            return {
                ...profile,
                id: `${profile.id}-${i}`,
                x: containerWidth / 2 - cardWidth / 2, // Centered horizontally
                y: i * (cardHeight + cardGap),
            };
        });
    } else { // Desktop
        if (containerWidth === 0) return;
        const numCardsNeeded = Math.ceil(containerWidth / (cardWidth + cardGap)) + 2;
        const loopedData = Array.from({ length: numCardsNeeded }).map((_, i) => cardsData[i % cardsData.length]);
        initialCards = loopedData.map((profile, i) => {
            return {
                ...profile,
                id: `${profile.id}-${i}`,
                x: i * (cardWidth + cardGap),
                y: containerHeight / 2 - cardHeight / 2, // Centered vertically
            };
        });
    }

    setCards(initialCards);
    setIsInitialized(true);
  }, [isMobile, cardsData, config]);

  useEffect(() => {
    initializeCards();
    window.addEventListener('resize', initializeCards);
    return () => window.removeEventListener('resize', initializeCards);
  }, [initializeCards]);

  const animate = useCallback((time: number) => {
    if (lastTimeRef.current != null && containerRef.current && cards.length > 0 && config) {
      const deltaTime = time - lastTimeRef.current;
      
      const cardWidth = isMobile ? config.cardWidthMobile : config.cardWidthDesktop;
      const cardHeight = isMobile ? config.cardHeightMobile : config.cardHeightDesktop;
      
      if (isMobile) {
        const containerHeight = containerRef.current.offsetHeight;
        const totalCarouselHeight = cards.length * (cardHeight + cardGap);
        const center = containerHeight / 2;
        const transitionZoneWidth = containerHeight * 0.15;
        const glassZoneStartY = containerHeight * 0.70;
        const glassZoneEndY = containerHeight * 0.30;

        setCards((prevCards) => {
          if (prevCards.length === 0) return [];
          return prevCards.map((card) => {
            let newY = card.y - speed * deltaTime;
            if (newY < -cardHeight) {
              newY += totalCarouselHeight;
            }
            let baseOpacity = 1;
            if (newY + cardHeight > glassZoneEndY && newY < glassZoneStartY) {
              baseOpacity = 1;
            }
            const cardCenter = newY + cardHeight / 2;
            const distanceFromCenter = Math.abs(cardCenter - center);
            let scale = Math.min(distanceFromCenter, transitionZoneWidth) / transitionZoneWidth;
            const opacity = baseOpacity * scale;
            return { ...card, y: newY, opacity, scale, zIndex: 10 };
          });
        });
      } else {
        const containerWidth = containerRef.current.offsetWidth;
        const totalCarouselWidth = cards.length * (cardWidth + cardGap);
        const center = containerWidth / 2;
        const transitionZoneWidth = containerWidth * 0.15;
        const glassZoneStartX = containerWidth * 0.775;
        const glassZoneEndX = containerWidth * 0.225;

        setCards((prevCards) => {
          if (prevCards.length === 0) return [];

          return prevCards.map((card) => {
            let newX = card.x - speed * deltaTime;
            if (newX < -cardWidth) {
              newX += totalCarouselWidth;
            }
            let baseOpacity = 1;
            if (newX + cardWidth > glassZoneEndX && newX < glassZoneStartX) {
              baseOpacity = 1;
            }
            const cardCenter = newX + cardWidth / 2;
            const distanceFromCenter = Math.abs(cardCenter - center);
            let scale = Math.min(distanceFromCenter, transitionZoneWidth) / transitionZoneWidth;
            const opacity = baseOpacity * scale;
            return { ...card, x: newX, opacity, scale, zIndex: 10 };
          });
        });
      }
    }
    lastTimeRef.current = time;
    animationFrameId.current = requestAnimationFrame(animate);
  }, [isMobile, cards.length, config]);

  useEffect(() => {
    if (isInitialized) {
      lastTimeRef.current = null;
      animationFrameId.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [animate, isInitialized]);
  
  if (cardsData.length === 0) {
    return null;
  }
  
  if (!config) {
    return (
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none flex items-center justify-center">
          <Skeleton className="w-full h-full bg-secondary/20" />
      </div>
    )
  }

  const cardWidth = isMobile ? config.cardWidthMobile : config.cardWidthDesktop;
  const cardHeight = isMobile ? config.cardHeightMobile : config.cardHeightDesktop;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
    >
      {cards.map((card) => {
        return (
          <div
            key={card.id}
            className={cn(
              'absolute bg-card/60 rounded-2xl shadow-2xl overflow-hidden border border-white/10'
            )}
            style={{
              width: `${cardWidth}px`,
              height: `${cardHeight}px`,
              transform: `translate3d(${card.x}px, ${card.y}px, 0) scale(${card.scale})`,
              opacity: card.opacity,
              willChange: 'transform, opacity',
              transition: 'transform 16ms linear, opacity 16ms linear',
              zIndex: card.zIndex,
              visibility: card.scale < 0.01 ? 'hidden' : 'visible',
            }}
          >
            <Image
              src={card.imageUrl}
              alt={card.name}
              fill
              style={{ objectFit: 'cover' }}
              className="z-0"
              data-ai-hint={card.imageHint}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 z-10" />
            <div className="relative z-20 flex flex-col justify-end h-full p-4 text-white">
              <div className="flex items-center gap-3">
                <Image
                  src={card.avatarUrl}
                  width={40}
                  height={40}
                  alt={card.name}
                  className="rounded-full border-2 border-white/50"
                  data-ai-hint={card.avatarHint}
                />
                <div>
                    <h3 className="font-bold text-lg drop-shadow-md">{card.name}</h3>
                    <p className="text-sm text-white/80">{card.username}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
