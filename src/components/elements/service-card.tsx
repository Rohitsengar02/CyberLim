'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Icon, type IconName } from '@/lib/icons';
import { AnimatedOceanWaves } from '../ui/animated-ocean-waves';

interface ServiceCardProps {
  card: {
    id: string;
    iconName: IconName;
    title: string;
    subtitle?: string;
    description: string;
  };
  index: number;
}

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.25, 1, 0.5, 1],
    },
  }),
};

const colors = [
  { gradient: 'linear-gradient(to right, #6d28d9, #4f46e5)', stop: 'via-purple-500' },
  { gradient: 'linear-gradient(to right, #0891b2, #0284c7)', stop: 'via-cyan-500' },
  { gradient: 'linear-gradient(to right, #059669, #10b981)', stop: 'via-emerald-500' },
  { gradient: 'linear-gradient(to right, #d97706, #ea580c)', stop: 'via-amber-500' },
  { gradient: 'linear-gradient(to right, #be185d, #e11d48)', stop: 'via-rose-500' },
  { gradient: 'linear-gradient(to right, #0ea5e9, #06b6d4)', stop: 'via-sky-500' },
];

export function ServiceCard({ card, index }: ServiceCardProps) {
  const { iconName, title, subtitle, description } = card;
  const color = colors[index % colors.length];

  const renderDescription = (desc: string) => {
    return desc.split('\n').map((line, i) => {
      if (line.startsWith('🔹')) {
        return (
          <li key={i} className="flex items-start text-sm">
            <CheckCircle2 className="w-4 h-4 text-current mr-2 mt-0.5 shrink-0" />
            <span>{line.substring(2)}</span>
          </li>
        );
      }
      return <p key={i} className="text-sm">{line}</p>;
    });
  };

  return (
    <div
      className="service-card group relative w-full h-[420px] rounded-2xl bg-secondary/30 backdrop-blur-lg border border-white/10 shadow-lg overflow-hidden transition-all duration-300"
    >
      <div className="flex flex-col h-full text-left">
        {/* Top Part */}
        <div className="p-6 h-1/3">
          <div className="w-12 h-12 rounded-lg bg-background/50 flex items-center justify-center border border-border mb-3">
             <Icon name={iconName} className="w-7 h-7 text-accent" />
          </div>
          <h3 className="text-xl font-bold text-primary">{title}</h3>
        </div>

        {/* Wave and Bottom Part */}
        <div className="flex-1 relative text-white overflow-hidden">
           <AnimatedOceanWaves 
                height="100%"
                oceanBackground={color.gradient}
                waveDuration={10}
                frontWaveOpacity={0.1}
                backWaveOpacity={0.2}
            />

           <div className="relative z-10 p-6 flex flex-col h-full">
                <div className="mb-4">
                    <p className="font-semibold text-base">{subtitle}</p>
                </div>
                <ul className="space-y-2 flex-grow">
                    {renderDescription(description)}
                </ul>
                <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm">
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
           </div>
        </div>
      </div>
    </div>
  );
}
