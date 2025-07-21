
'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { 
  ArrowLeft, 
  ExternalLink, 
  Quote, 
  Smile, 
  Meh, 
  Frown, 
  CheckCircle2,
  Cpu,
  Database,
  Wrench,
  Monitor,
  Briefcase,
  Users,
  Target,
  Lightbulb,
  Palette,
  Code2,
  Rocket
} from 'lucide-react';

import { getProjectBySlug } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Project } from '@/types/project';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProjectLongDetailPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
      async function fetchProject() {
          setIsLoading(true);
          const fetchedProject = await getProjectBySlug(params.slug);
          if (fetchedProject) {
              setProject(fetchedProject);
              const allImages = [
                ...(fetchedProject.imageUrl ? [fetchedProject.imageUrl] : []),
                ...(fetchedProject.gallery || [])
              ];
              if (allImages.length > 0) {
                  setActiveImage(allImages[0]);
              }
          }
          setIsLoading(false);
      }
      fetchProject();
  }, [params.slug]);


  useGSAP(() => {
    if (!project || isLoading) return;
    
    gsap.fromTo(
      '.anim-element',
      { y: 50, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.15,
        delay: 0.2,
      }
    );
  }, { scope: contentRef, dependencies: [project, isLoading] });
  
  if (isLoading) {
      return (
          <div className="bg-background min-h-screen">
              <div className="flex flex-col lg:flex-row max-w-7xl mx-auto">
                 <div className="lg:w-1/2 p-8">
                     <div className="flex flex-col h-full gap-4">
                         <Skeleton className="flex-grow w-full rounded-xl aspect-[4/3]" />
                         <div className="flex-shrink-0 flex space-x-2">
                             <Skeleton className="w-20 h-20 rounded-md" />
                             <Skeleton className="w-20 h-20 rounded-md" />
                             <Skeleton className="w-20 h-20 rounded-md" />
                             <Skeleton className="w-20 h-20 rounded-md" />
                         </div>
                     </div>
                 </div>
                 <div className="lg:w-1/2 p-8 space-y-8">
                     <Skeleton className="h-12 w-3/4" />
                     <Skeleton className="h-8 w-1/2" />
                     <Skeleton className="h-64 w-full" />
                 </div>
              </div>
          </div>
      )
  }

  if (!project) {
    return notFound();
  }

  const satisfactionMap = {
    happy: { Icon: Smile, color: 'text-green-400', label: 'Happy Client' },
    neutral: { Icon: Meh, color: 'text-yellow-400', label: 'Client Satisfied' },
    unhappy: { Icon: Frown, color: 'text-red-400', label: 'Feedback Provided' }
  };
  
  const techCategoryIcons = {
    Frontend: Monitor,
    Backend: Cpu,
    Database: Database,
    Tools: Wrench,
    Platform: Briefcase,
    Language: Code2
  };

  const displayGallery = [
    ...(project.imageUrl ? [project.imageUrl] : []),
    ...(project.gallery || [])
  ];
  
  const clientSatisfaction = project.client ? satisfactionMap[project.client.satisfaction] : null;
  
  const groupedTechStack = (project.techStack || []).reduce((acc, tech) => {
    acc[tech.category] = acc[tech.category] || [];
    acc[tech.category].push(tech.name);
    return acc;
  }, {} as Record<Project['techStack'][0]['category'], string[]>);


  return (
    <>
      <Button
        onClick={() => router.back()}
        variant="ghost"
        className="fixed top-6 left-6 z-50 text-muted-foreground hover:text-primary backdrop-blur-sm bg-black/10 rounded-full"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <main className="bg-background text-primary">
         <div className="flex flex-col lg:flex-row min-h-screen">
            {/* Left - Image Gallery */}
            <div className="lg:w-1/2 lg:h-screen lg:sticky lg:top-0 p-4 md:p-6 lg:p-8">
                <div className="flex flex-col gap-4">
                    {/* Main Image Display */}
                    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-lg border border-white/10 group">
                        {activeImage && (
                            <Image 
                                src={activeImage} 
                                alt={`${project.title} main image`}
                                fill
                                className="object-cover transition-opacity duration-300 ease-in-out"
                                key={activeImage} // Add key to force re-render on image change for transition
                            />
                        )}
                        {!activeImage && <div className="bg-secondary w-full h-full"></div>}
                    </div>
                    
                    {/* Thumbnails */}
                    {displayGallery.length > 1 && (
                        <div className="flex-shrink-0">
                            <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-2">
                                {displayGallery.map((imgUrl, index) => (
                                    <button 
                                        key={index} 
                                        onClick={() => setActiveImage(imgUrl)}
                                        className={cn(
                                            "relative w-20 h-20 shrink-0 rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-accent transition-all duration-200",
                                            activeImage === imgUrl ? 'border-2 border-accent scale-105' : 'border-2 border-transparent hover:border-white/50'
                                        )}
                                    >
                                        <Image src={imgUrl} alt={`gallery thumbnail ${index + 1}`} fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right - Content */}
            <div ref={contentRef} className="lg:w-1/2 p-4 md:p-6 lg:p-12 space-y-12 lg:space-y-16">
                 <header className="anim-element text-left lg:pt-8">
                    <h1 className="font-headline text-4xl md:text-6xl font-extrabold text-primary text-left mb-4">
                        {project.title}
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground mb-6">
                        {project.tagline}
                    </p>
                    <p className="text-foreground/80 leading-relaxed">
                        {project.description}
                    </p>
                </header>

                 <div className="anim-element p-6 md:p-8 rounded-2xl bg-secondary/30 backdrop-blur-lg border border-white/10">
                    <h2 className="text-2xl font-bold text-primary mb-4 flex items-center"><Briefcase className="mr-3 text-accent"/> Project Overview</h2>
                    <div className="space-y-6 text-muted-foreground leading-relaxed">
                        {project.overview?.problem && (
                            <div>
                            <h3 className="font-semibold text-primary mb-1">The Problem</h3>
                            <p>{project.overview.problem}</p>
                            </div>
                        )}
                        {project.overview?.solution && (
                            <div>
                            <h3 className="font-semibold text-primary mb-1">The Solution</h3>
                            <p>{project.overview.solution}</p>
                            </div>
                        )}
                    </div>
                    {project.liveUrl && (
                        <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block">
                        <Button variant="outline" size="lg" className="rounded-full">
                            View Live Site <ExternalLink className="ml-2"/>
                        </Button>
                        </Link>
                    )}
                </div>

                {project.approach && (
                    <div className="anim-element p-6 md:p-8 rounded-2xl bg-secondary/30 backdrop-blur-lg border border-white/10">
                        <h2 className="text-2xl font-bold text-primary mb-6 text-center">Our Approach</h2>
                        <div className="grid md:grid-cols-3 gap-6 text-center">
                        <div className="flex flex-col items-center">
                            <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center mb-3"><Lightbulb className="w-7 h-7 text-accent"/></div>
                            <h3 className="text-lg font-semibold text-primary mb-1">Research</h3>
                            <p className="text-muted-foreground text-sm">{project.approach.research}</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center mb-3"><Palette className="w-7 h-7 text-accent"/></div>
                            <h3 className="text-lg font-semibold text-primary mb-1">Design</h3>
                            <p className="text-muted-foreground text-sm">{project.approach.design}</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center mb-3"><Rocket className="w-7 h-7 text-accent"/></div>
                            <h3 className="text-lg font-semibold text-primary mb-1">Development</h3>
                            <p className="text-muted-foreground text-sm">{project.approach.development}</p>
                        </div>
                        </div>
                    </div>
                 )}

                {project.techStack && project.techStack.length > 0 && (
                    <div className="anim-element p-6 md:p-8 rounded-2xl bg-secondary/30 backdrop-blur-lg border border-white/10">
                        <h2 className="text-2xl font-bold text-primary mb-6 flex items-center"><Code2 className="mr-3 text-accent" /> Tech Stack</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {Object.entries(groupedTechStack).map(([category, techs]) => {
                            const Icon = techCategoryIcons[category as keyof typeof techCategoryIcons];
                            return (
                            <div key={category}>
                                <h3 className="font-semibold text-primary mb-2 flex items-center">
                                    {Icon && <Icon className="mr-2 h-4 w-4" />}
                                    {category}
                                </h3>
                                <div className="flex flex-wrap gap-1.5">
                                {techs.map(tech => (
                                    <Badge key={tech} variant="secondary" className="bg-secondary/50 text-secondary-foreground">{tech}</Badge>
                                ))}
                                </div>
                            </div>
                            )
                        })}
                        </div>
                    </div>
                )}

                {project.features && project.features.length > 0 && (
                    <div className="anim-element p-6 md:p-8 rounded-2xl bg-secondary/30 backdrop-blur-lg border border-white/10">
                        <h2 className="text-2xl font-bold text-primary mb-6 flex items-center"><CheckCircle2 className="mr-3 text-accent" /> Features Built</h2>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-muted-foreground">
                        {project.features.map((feature, i) => (
                            <li key={i} className="flex items-start">
                            <CheckCircle2 className="w-4 h-4 text-green-400 mr-2.5 mt-1 shrink-0" />
                            <span>{feature}</span>
                            </li>
                        ))}
                        </ul>
                    </div>
                )}
                
                {project.client?.testimonial && clientSatisfaction && (
                    <div className="anim-element p-6 md:p-10 rounded-2xl bg-secondary/30 backdrop-blur-lg border border-white/10">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="text-center md:text-left flex-shrink-0">
                            <Quote className="w-12 h-12 text-accent mx-auto md:mx-0" />
                            </div>
                            <div className="flex-1">
                            <blockquote className="text-lg md:text-xl italic text-primary leading-relaxed">
                                "{project.client.testimonial}"
                            </blockquote>
                            <footer className="mt-4 flex items-center gap-3">
                                <clientSatisfaction.Icon className={cn("w-7 h-7", clientSatisfaction.color)} />
                                <div>
                                <p className="font-bold text-primary">{project.client.name}</p>
                                <p className={cn("text-sm font-medium", clientSatisfaction.color)}>{clientSatisfaction.label}</p>
                                </div>
                            </footer>
                            </div>
                        </div>
                    </div>
                )}
                
                <div className="anim-element text-center py-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">Have a similar project in mind?</h2>
                    <p className="text-muted-foreground mb-8 max-w-lg mx-auto">Let's build something amazing together. Reach out to us to discuss your ideas.</p>
                    <div className="flex justify-center gap-4">
                    <Link href="/#contact" passHref>
                        <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                        Let's Talk
                        </Button>
                    </Link>
                    <Link href="/#projects" passHref>
                        <Button size="lg" variant="outline">
                        View More Projects
                        </Button>
                    </Link>
                    </div>
                </div>
            </div>
         </div>
      </main>
    </>
  );
}
