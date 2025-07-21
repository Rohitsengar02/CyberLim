
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { AboutUsContentConfig } from '@/types/about-us-content';
import { Skeleton } from '../ui/skeleton';
import WoofyHoverImage from '../ui/woofy-hover-image';
import { Button } from '../ui/button';
import { Check } from 'lucide-react';
import Link from 'next/link';

interface AboutSectionProps {
  config: AboutUsContentConfig | null;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export const AboutSection = React.forwardRef<HTMLElement, AboutSectionProps>(({ config }, ref) => {

  if (!config) {
    return (
      <section id="about" ref={ref} className="relative min-h-screen snap-start flex items-center justify-center p-8 bg-background">
        <Skeleton className="w-full h-[600px]" />
      </section>
    );
  }

  return (
    <motion.section 
      id="about" 
      ref={ref}
      className="relative bg-background py-16 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
        <div className="absolute inset-0 z-0">
          <div className="about-blob about-blob-1" />
          <div className="about-blob about-blob-2" />
      </div>

      <div className="container mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 lg:gap-24 items-center">
        
        {/* Left Column (Image) */}
        <motion.div variants={itemVariants} className="relative w-full aspect-[4/3] md:w-full md:aspect-auto md:h-full flex items-center">
             <div
                className="relative w-full md:w-[80%] mx-auto aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            >
                <WoofyHoverImage
                    src={config.imageUrl!}
                    alt={config.heading}
                    className="w-full h-full"
                    effectType="blackWhite"
                    turbulenceIntensity={0.15}
                    maskRadius={0.4}
                />
            </div>
        </motion.div>

        {/* Right Column (Content) */}
        <div className="space-y-12">
            <motion.div variants={itemVariants} className="text-left">
                <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">{config.heading}</h2>
                <p className="text-lg text-muted-foreground">{config.description}</p>
            </motion.div>
            
            {config.missionStatement && (
                <motion.div variants={itemVariants} className="p-8 rounded-2xl bg-secondary/30 backdrop-blur-lg border border-white/10">
                    <h3 className="text-2xl font-bold text-primary mb-3">Our Mission</h3>
                    <p className="text-muted-foreground leading-relaxed">{config.missionStatement}</p>
                </motion.div>
            )}

            {config.coreValues && config.coreValues.length > 0 && (
                <motion.div variants={itemVariants}>
                    <h3 className="text-2xl font-bold text-primary mb-4">What Drives Us</h3>
                    <ul className="space-y-3">
                        {config.coreValues.map((value, index) => (
                           <li key={index} className="flex items-center text-muted-foreground text-lg">
                               <Check className="w-5 h-5 text-accent mr-3" />
                               <span>{value}</span>
                           </li>
                        ))}
                    </ul>
                </motion.div>
            )}

             {config.whyChooseUs && config.whyChooseUs.length > 0 && (
                <motion.div variants={itemVariants}>
                    <h3 className="text-2xl font-bold text-primary mb-4">Why Choose Cyber Lim?</h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                        {config.whyChooseUs.map((reason, index) => (
                           <li key={index} className="flex items-center text-muted-foreground">
                               <Check className="w-4 h-4 text-green-500 mr-2 shrink-0" />
                               <span>{reason}</span>
                           </li>
                        ))}
                    </ul>
                </motion.div>
            )}

            {config.ctaHeading && (
                <motion.div variants={itemVariants} className="text-center p-8 rounded-2xl bg-secondary/30 backdrop-blur-lg border border-white/10">
                    <h3 className="text-3xl font-bold text-primary mb-4">{config.ctaHeading}</h3>
                    <div className="flex justify-center gap-4">
                        <Button asChild size="lg">
                            <Link href="/#contact">Get in Touch</Link>
                        </Button>
                         <Button asChild variant="outline" size="lg">
                            <Link href="/#projects">View Our Projects</Link>
                        </Button>
                    </div>
                </motion.div>
            )}
        </div>

      </div>
    </motion.section>
  );
});

AboutSection.displayName = "AboutSection";
