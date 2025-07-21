
"use client";

import { Navbar } from '@/components/layout/navbar';
import { HeroSection } from '@/components/sections/hero-section';
import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Preloader } from '@/components/layout/preloader';
import { TextPlugin } from 'gsap/TextPlugin';
import { ProjectsSection } from '@/components/sections/projects-section';
import { getNavbarConfig, getHeroCards, getHeroContentConfig, getFeaturesContentConfig, getProjectHeadingConfig, getProjectLayoutConfig, getAboutUsContentConfig, getProjectsData, getServicesHeadingConfig, getServicesLayoutConfig } from '@/lib/data';
import type { NavbarConfig } from '@/types/navbar';
import type { HeroCard } from '@/types/hero-card';
import type { HeroContentConfig } from '@/types/hero-content';
import type { FeaturesContentConfig } from '@/types/features-content';
import type { ProjectHeadingConfig } from '@/types/project-heading';
import type { ProjectLayoutConfig } from '@/types/project-layout';
import type { AboutUsContentConfig } from '@/types/about-us-content';
import { FeaturesSection } from '@/components/sections/features-section';
import { AboutSection } from '@/components/sections/about-section';
import { ServicesSection } from '@/components/sections/services-section';
import type { Project } from '@/types/project';
import type { ServicesHeadingConfig } from '@/types/services-heading';
import type { ServicesLayoutConfig } from '@/types/services-layout';
import Lenis from 'lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ContactSection } from '@/components/sections/contact-section';

gsap.registerPlugin(useGSAP, TextPlugin, ScrollTrigger);


export default function Home() {
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);

  const [dataLoaded, setDataLoaded] = useState(false);
  const [preloaderFinished, setPreloaderFinished] = useState(false);
  
  const [navbarConfig, setNavbarConfig] = useState<NavbarConfig | null>(null);
  const [heroCards, setHeroCards] = useState<HeroCard[]>([]);
  const [heroContentConfig, setHeroContentConfig] = useState<HeroContentConfig | null>(null);
  const [featuresContentConfig, setFeaturesContentConfig] = useState<FeaturesContentConfig | null>(null);
  const [projectHeadingConfig, setProjectHeadingConfig] = useState<ProjectHeadingConfig | null>(null);
  const [projectLayoutConfig, setProjectLayoutConfig] = useState<ProjectLayoutConfig | null>(null);
  const [aboutUsContentConfig, setAboutUsContentConfig] = useState<AboutUsContentConfig | null>(null);
  const [servicesHeadingConfig, setServicesHeadingConfig] = useState<ServicesHeadingConfig | null>(null);
  const [servicesLayoutConfig, setServicesLayoutConfig] = useState<ServicesLayoutConfig | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);


  useEffect(() => {
    async function fetchData() {
      const [
        navConfig, 
        cards, 
        contentConfig, 
        featuresConfig,
        projHeadingConfig,
        projLayoutConfig,
        aboutConfig,
        projectsData,
        servHeadingConfig,
        servLayoutConfig,
      ] = await Promise.all([
          getNavbarConfig(),
          getHeroCards(),
          getHeroContentConfig(),
          getFeaturesContentConfig(),
          getProjectHeadingConfig(),
          getProjectLayoutConfig(),
          getAboutUsContentConfig(),
          getProjectsData(),
          getServicesHeadingConfig(),
          getServicesLayoutConfig(),
      ]);
      setNavbarConfig(navConfig);
      setHeroCards(cards);
      setHeroContentConfig(contentConfig);
      setFeaturesContentConfig(featuresConfig);
      setProjectHeadingConfig(projHeadingConfig);
      setProjectLayoutConfig(projLayoutConfig);
      setAboutUsContentConfig(aboutConfig);
      setProjects(projectsData);
      setServicesHeadingConfig(servHeadingConfig);
      setServicesLayoutConfig(servLayoutConfig);
      setDataLoaded(true);
    }
    fetchData();
  }, []);

  // Lenis smooth scroll integration
  useGSAP(() => {
    const lenis = new Lenis();
    
    lenis.on('scroll', ScrollTrigger.update);
    
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
    }
  }, []);


  // Main content entrance animation
  useGSAP(() => {
    if (!preloaderFinished || !dataLoaded) return;
    
    const preloader = document.querySelector('.preloader-container');
    const preloaderLogo = preloader?.querySelector('.logo');
    const mainContent = mainContainerRef.current;
    
    if (!preloader || !preloaderLogo || !mainContent) return;

    // Get the final position of the navbar logo
    const navbarLogo = mainContent.querySelector('.navbar-header .logo-container');
    if (!navbarLogo) return;

    const finalRect = navbarLogo.getBoundingClientRect();
    const initialRect = preloaderLogo.getBoundingClientRect();
    
    // Animate the preloader logo to the navbar position
    const tl = gsap.timeline();
    
    tl.to(preloaderLogo, {
        x: finalRect.left - initialRect.left,
        y: finalRect.top - initialRect.top,
        scale: finalRect.width / initialRect.width,
        duration: 1.2,
        ease: 'power3.inOut'
    })
    .to(preloader?.querySelector('.tagline-1'), { autoAlpha: 0, y: -20, duration: 0.5 }, '<')
    .to(preloader?.querySelector('.tagline-2'), { autoAlpha: 0, y: -20, duration: 0.5 }, '<0.1')
    .to(preloader, { autoAlpha: 0, duration: 0.5 }, '-=0.5')
    .call(() => {
        // Hide preloader completely after transition
        gsap.set(preloader, { display: 'none' });
        // Set main content to visible and start its entrance
        gsap.set(mainContent, { autoAlpha: 1 });
        
        const heroSection = heroSectionRef.current;
        if (!heroSection) return;
    
        const navbar = heroSection.querySelector('.navbar-header');
        const paragraphEl = heroSection.querySelector('.hero-paragraph');
        const heroAnimationEl = heroSection.querySelector('.hero-animation-container');

        if (!navbar) return;
        
        // --- Main Content Entrance Animation ---
        gsap.from(navbar.querySelectorAll('.nav-link'), { yPercent: -120, opacity: 0, stagger: 0.1, duration: 0.7, ease: 'power3.out' });
        gsap.from(heroSection.querySelectorAll('.char'), { y: 100, opacity: 0, stagger: 0.03, duration: 0.8, ease: 'power2.out' }, "<0.4");
        gsap.from(paragraphEl, { autoAlpha: 0, y: 20 }, "-=0.6");
        gsap.from(heroAnimationEl, { opacity: 0, duration: 1.5, ease: 'power2.inOut' }, "<");
    });
    
  }, { dependencies: [preloaderFinished, dataLoaded] });


  return (
    <>
      <Preloader onComplete={() => setPreloaderFinished(true)} />
      
      <div ref={mainContainerRef} className={preloaderFinished ? '' : 'invisible'}>
        
        {dataLoaded && heroContentConfig && featuresContentConfig && projectHeadingConfig && projectLayoutConfig && servicesHeadingConfig && servicesLayoutConfig && (
            <>
              <Navbar 
                  config={navbarConfig}
                  className="navbar-header fixed top-0 left-0 right-0 z-50"
              />
              <HeroSection 
                ref={heroSectionRef} 
                heroCards={heroCards} 
                heroContentConfig={heroContentConfig}
                navbarConfig={null} 
              />
              
              <FeaturesSection config={featuresContentConfig} />

              <ProjectsSection headingConfig={projectHeadingConfig} />

              <AboutSection config={aboutUsContentConfig} />
              
              <ServicesSection headingConfig={servicesHeadingConfig} />

              <ContactSection />

              <footer className="py-6 bg-background border-t border-border/50 snap-start">
                <div className="container mx-auto text-center text-xs text-muted-foreground">
                  © {new Date().getFullYear()} CyberLim. All rights reserved.
                </div>
              </footer>
            </>
        )}
      </div>
    </>
  );
}
