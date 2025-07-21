
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useIsMobile } from '@/hooks/use-mobile';
import { getHeroAnimationConfig } from '@/lib/data';
import type { HeroAnimationConfig } from '@/types/hero-animation';
import { Skeleton } from '@/components/ui/skeleton';

export function HeroAnimationElement() {
    const [config, setConfig] = useState<HeroAnimationConfig | null>(null);
    const isMobile = useIsMobile();
    
    useEffect(() => {
        async function fetchData() {
            const fetchedConfig = await getHeroAnimationConfig();
            setConfig(fetchedConfig);
        }
        fetchData();
    }, []);

    if (!config) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <Skeleton className="w-[500px] h-[700px] rounded-lg bg-secondary/50" />
            </div>
        );
    }
    
    const scale = isMobile ? config.mobileScale : config.desktopScale;

    if (!config.gifUrl) {
        return null;
    }

    return (
        <div className="w-full h-screen flex items-center justify-center overflow-hidden">
            <div
                className="relative transition-transform duration-500 ease-in-out"
                style={{
                    width: '500px',
                    height: '700px',
                    transform: `scale(${scale})`,
                }}
            >
                <div className="w-full h-full">
                    <Image
                        src={config.gifUrl}
                        alt="Abstract animated orb"
                        fill
                        style={{ objectFit: 'contain' }}
                        priority
                        unoptimized
                    />
                </div>
            </div>
        </div>
    );
}
