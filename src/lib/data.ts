
import { db } from './firebase';
import { doc, getDoc, collection, getDocs, query, orderBy, where, limit, type Timestamp } from 'firebase/firestore';
import type { NavbarConfig } from '@/types/navbar';
import type { HeroCard } from '@/types/hero-card';
import type { HeroAnimationConfig } from '@/types/hero-animation';
import type { HeroContentConfig } from '@/types/hero-content';
import type { HeroCarouselConfig } from '@/types/hero-carousel-config';
import type { FeaturesContentConfig } from '@/types/features-content';
import type { FeatureCard } from '@/types/feature-card';
import type { FeaturesLayoutConfig } from '@/types/features-layout';
import type { ProjectHeadingConfig } from '@/types/project-heading';
import type { Project } from '@/types/project';
import type { ProjectLayoutConfig } from '@/types/project-layout';
import type { AboutUsContentConfig } from '@/types/about-us-content';
import type { ServicesHeadingConfig } from '@/types/services-heading';
import type { ServiceCard } from '@/types/service-card';
import type { ServicesLayoutConfig } from '@/types/services-layout';
import type { ContactSubmission } from '@/types/contact-submission';

// Helper to convert Firestore data to Project type
function mapDocToProject(doc: any): Project {
    const data = doc.data();
    return {
        id: doc.id,
        slug: data.slug,
        title: data.title,
        tagline: data.tagline,
        description: data.description,
        tags: data.tags || [],
        href: data.href,
        liveUrl: data.liveUrl,
        isFeatured: data.isFeatured,
        animationColor: data.animationColor,
        gridClassName: data.gridClassName,
        imageUrl: data.imageUrl,
        gallery: data.gallery || [],
        overview: data.overview,
        goals: data.goals || [],
        challenges: data.challenges || [],
        approach: data.approach,
        techStack: data.techStack || [],
        features: data.features || [],
        results: data.results || [],
        client: data.client,
        createdAt: (data.createdAt as Timestamp)?.toDate().toISOString(),
    };
}


const defaultConfig: NavbarConfig = {
  logoText: 'CyberLIM',
  logoImageUrl: null,
  leftMenuItems: [
    { href: '#features', label: 'Features' },
    { href: '#projects', label: 'Projects' },
    { href: '#about', label: 'About' },
  ],
  rightMenuItems: [
    { href: '#contact', label: 'Contact' },
    { href: '/auth/signin', label: 'Admin' },
  ],
  logoHoverText: [],
};

export async function getNavbarConfig(): Promise<NavbarConfig> {
  try {
    const docRef = doc(db, 'navbar', 'main');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const config: NavbarConfig = {
        logoText: data.logoText,
        logoImageUrl: data.logoImageUrl === undefined ? null : data.logoImageUrl,
        leftMenuItems: Array.isArray(data.leftMenuItems) ? data.leftMenuItems : defaultConfig.leftMenuItems,
        rightMenuItems: Array.isArray(data.rightMenuItems) ? data.rightMenuItems : defaultConfig.rightMenuItems,
        logoHoverText: Array.isArray(data.logoHoverText) ? data.logoHoverText : defaultConfig.logoHoverText,
      };
      return config;
    } else {
      console.log('No navbar config found, returning default.');
      return defaultConfig;
    }
  } catch (error) {
    console.error("Error fetching navbar config:", error);
    return defaultConfig;
  }
}

export async function getHeroCards(): Promise<HeroCard[]> {
  try {
    const cardsRef = collection(db, 'heroCards');
    const q = query(cardsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const cards: HeroCard[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      cards.push({
        id: doc.id,
        name: data.name,
        username: data.username,
        imageUrl: data.imageUrl,
        avatarUrl: data.avatarUrl,
        imageHint: data.imageHint,
        avatarHint: data.avatarHint,
        createdAt: (data.createdAt as Timestamp)?.toDate().toISOString(),
      });
    });
    return cards;
  } catch (error) {
    console.error("Error fetching hero cards:", error);
    return [];
  }
}

export async function getHeroCardById(id: string): Promise<HeroCard | null> {
  try {
    const docRef = doc(db, 'heroCards', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data.name,
        username: data.username,
        imageUrl: data.imageUrl,
        avatarUrl: data.avatarUrl,
        imageHint: data.imageHint,
        avatarHint: data.avatarHint,
        createdAt: (data.createdAt as Timestamp)?.toDate().toISOString(),
      };
    } else {
      console.log(`No card found with id: ${id}`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching hero card by ID:", error);
    return null;
  }
}

const defaultHeroAnimationConfig: HeroAnimationConfig = {
  gifUrl: 'https://res.cloudinary.com/ds1wiqrdb/image/upload/v1750693773/noise-displace-copy_1_tlrvam.gif',
  desktopScale: 1,
  mobileScale: 2,
};

export async function getHeroAnimationConfig(): Promise<HeroAnimationConfig> {
  try {
    const docRef = doc(db, 'siteConfig', 'heroAnimation');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as HeroAnimationConfig;
    } else {
      return defaultHeroAnimationConfig;
    }
  } catch (error) {
    console.error("Error fetching hero animation config:", error);
    return defaultHeroAnimationConfig;
  }
}

const defaultHeroContentConfig: HeroContentConfig = {
  heading: 'WE ARE\nFULL-SERVICE\nAGENCY',
  paragraph: 'The first full-stack Web3 creative agency integrating AI technology to deliver best-in-class client experience.',
  headingFontSizeDesktop: 60,
  headingFontSizeMobile: 32,
  paragraphFontSizeDesktop: 14,
  paragraphFontSizeMobile: 12,
  glassWidthDesktop: '50%',
  glassHeightDesktop: '60%',
  glassWidthMobile: '95%',
  glassHeightMobile: '40%',
};

export async function getHeroContentConfig(): Promise<HeroContentConfig> {
  try {
    const docRef = doc(db, 'heroContent', 'main');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { ...defaultHeroContentConfig, ...docSnap.data() };
    } else {
      return defaultHeroContentConfig;
    }
  } catch (error) {
    console.error("Error fetching hero content config:", error);
    return defaultHeroContentConfig;
  }
}

const defaultHeroCarouselConfig: HeroCarouselConfig = {
  cardWidthDesktop: 240,
  cardHeightDesktop: 340,
  cardWidthMobile: 240,
  cardHeightMobile: 340,
};

export async function getHeroCarouselConfig(): Promise<HeroCarouselConfig> {
    try {
        const docRef = doc(db, 'siteConfig', 'heroCarousel');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as HeroCarouselConfig;
        } else {
            return defaultHeroCarouselConfig;
        }
    } catch (error) {
        console.error("Error fetching hero carousel config:", error);
        return defaultHeroCarouselConfig;
    }
}

const defaultFeaturesContentConfig: FeaturesContentConfig = {
  heading: 'Our Core Features',
  paragraph: 'We combine cutting-edge technology with strategic thinking to build solutions that drive results.',
  paddingTopDesktop: 80,
  paddingTopMobile: 60,
};

export async function getFeaturesContentConfig(): Promise<FeaturesContentConfig> {
  try {
    const docRef = doc(db, "featuresContent", "main");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { ...defaultFeaturesContentConfig, ...docSnap.data() };
    } else {
      return defaultFeaturesContentConfig;
    }
  } catch (error) {
    console.error("Error fetching features content config:", error);
    return defaultFeaturesContentConfig;
  }
}

export async function getFeatureCards(): Promise<FeatureCard[]> {
  try {
    const cardsRef = collection(db, 'featuresCards');
    const q = query(cardsRef, orderBy('createdAt', 'asc'));
    const querySnapshot = await getDocs(q);
    const cards: FeatureCard[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      cards.push({
        id: doc.id,
        title: data.title,
        description: data.description,
        iconName: data.iconName,
        createdAt: (data.createdAt as Timestamp)?.toDate().toISOString(),
      });
    });
    return cards;
  } catch (error) {
    console.error("Error fetching feature cards:", error);
    return [];
  }
}

export async function getFeatureCardById(id: string): Promise<FeatureCard | null> {
  try {
    const docRef = doc(db, 'featuresCards', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        title: data.title,
        description: data.description,
        iconName: data.iconName,
        createdAt: (data.createdAt as Timestamp)?.toDate().toISOString(),
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching feature card by ID:", error);
    return null;
  }
}

const defaultFeaturesLayoutConfig: FeaturesLayoutConfig = {
  layoutMode: 'scroll',
  cardWidthDesktop: 320,
  cardHeightDesktop: 360,
  cardWidthMobile: 300,
  cardHeightMobile: 340,
  backdropBlur: 16, // Corresponds to backdrop-blur-md
};

export async function getFeaturesLayoutConfig(): Promise<FeaturesLayoutConfig> {
  try {
    const docRef = doc(db, "featuresContent", "layout");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { ...defaultFeaturesLayoutConfig, ...docSnap.data() };
    } else {
      return defaultFeaturesLayoutConfig;
    }
  } catch (error) {
    console.error("Error fetching features layout config:", error);
    return defaultFeaturesLayoutConfig;
  }
}

const defaultProjectHeadingConfig: ProjectHeadingConfig = {
  heading: 'Our Projects',
  paragraph: 'We transform innovative ideas into reality. Explore some of our recent work across AI, Web3, and beyond.',
  paddingTopDesktop: 80,
  paddingTopMobile: 60,
};

export async function getProjectHeadingConfig(): Promise<ProjectHeadingConfig> {
  try {
    const docRef = doc(db, "projectHead", "main");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { ...defaultProjectHeadingConfig, ...docSnap.data() };
    } else {
      return defaultProjectHeadingConfig;
    }
  } catch (error) {
    console.error("Error fetching project heading config:", error);
    return defaultProjectHeadingConfig;
  }
}

export async function getProjectsData(): Promise<Project[]> {
    try {
        const projectsRef = collection(db, 'projects');
        const q = query(projectsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const projects: Project[] = [];
        querySnapshot.forEach((doc) => {
            projects.push(mapDocToProject(doc));
        });
        return projects;
    } catch (error) {
        console.error("Error fetching projects:", error);
        return [];
    }
}

export async function getProjectById(id: string): Promise<Project | null> {
    try {
        const docRef = doc(db, 'projects', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return mapDocToProject(docSnap);
        }
        return null;
    } catch (error) {
        console.error("Error fetching project by ID:", error);
        return null;
    }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const q = query(collection(db, 'projects'), where('slug', '==', slug), limit(1));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      return mapDocToProject(docSnap);
    }
    return null;
  } catch (error) {
    console.error(`Error fetching project by slug ${slug}:`, error);
    return null;
  }
}

const defaultProjectLayoutConfig: ProjectLayoutConfig = {
  layout: 'bento',
};

export async function getProjectLayoutConfig(): Promise<ProjectLayoutConfig> {
  try {
    const docRef = doc(db, "projectLayout", "main");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { ...defaultProjectLayoutConfig, ...docSnap.data() };
    } else {
      return defaultProjectLayoutConfig;
    }
  } catch (error) {
    console.error("Error fetching project layout config:", error);
    return defaultProjectLayoutConfig;
  }
}

const defaultAboutUsContentConfig: AboutUsContentConfig = {
  heading: 'Who We Are',
  description: 'At Cyber Lim, we are passionate about building scalable digital solutions that empower businesses. From startups to enterprises, we craft software, websites, and AI-powered products that drive real-world results.',
  missionStatement: 'Our mission is to simplify technology for businesses by delivering custom solutions with innovation, precision, and transparency.',
  imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop',
  coreValues: [
      'Innovation',
      'Quality-First Approach',
      'Customer-Centric Solutions',
      'Transparency & Trust',
  ],
  whyChooseUs: [
      'Experienced development team',
      'Modern tech stack',
      'Competitive pricing',
      'Timely delivery',
      'End-to-end project handling',
      'Focus on scalability and security',
  ],
  ctaHeading: 'Let’s Build Something Amazing Together.',
};

export async function getAboutUsContentConfig(): Promise<AboutUsContentConfig> {
  try {
    const docRef = doc(db, 'siteConfig', 'aboutUs');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      // Ensure all fields from the default config are present
      return { ...defaultAboutUsContentConfig, ...data };
    }
    return defaultAboutUsContentConfig;
  } catch (error) {
    console.error("Error fetching About Us config:", error);
    return defaultAboutUsContentConfig;
  }
}

const defaultServicesHeadingConfig: ServicesHeadingConfig = {
  heading: 'Our Services',
  paragraph: 'We provide a wide range of services to help you build and scale your digital products.',
  paddingTopDesktop: 80,
  paddingTopMobile: 60,
};

export async function getServicesHeadingConfig(): Promise<ServicesHeadingConfig> {
  try {
    const docRef = doc(db, "servicesContent", "main");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { ...defaultServicesHeadingConfig, ...docSnap.data() };
    } else {
      return defaultServicesHeadingConfig;
    }
  } catch (error) {
    console.error("Error fetching services heading config:", error);
    return defaultServicesHeadingConfig;
  }
}

const defaultServicesLayoutConfig: ServicesLayoutConfig = {
  layout: 'grid',
};

export async function getServicesLayoutConfig(): Promise<ServicesLayoutConfig> {
  try {
    const docRef = doc(db, "servicesLayout", "main");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { ...defaultServicesLayoutConfig, ...docSnap.data() };
    }
    return defaultServicesLayoutConfig;
  } catch (error) {
    console.error("Error fetching services layout config:", error);
    return defaultServicesLayoutConfig;
  }
}

const defaultServiceCards: ServiceCard[] = [
    { id: '1', iconName: 'Cog', title: 'Custom Software Development', subtitle: 'Tailored digital solutions built to solve your business challenges.', description: '🔹 Enterprise software, automation systems, and custom tools developed with precision.' },
    { id: '2', iconName: 'Monitor', title: 'Web Development (Any Tech Stack)', subtitle: 'From simple websites to complex web applications.', description: '🔹 Built using modern frameworks like React, Next.js, Node.js, Laravel, and more – flexible to any tech stack.' },
    { id: '3', iconName: 'Smartphone', title: 'Mobile App Development', subtitle: 'Native and cross-platform mobile apps to grow your business.', description: '🔹 Android and iOS apps with intuitive UI and seamless performance.' },
    { id: '4', iconName: 'ShoppingCart', title: 'E-Commerce Solutions + Branding', subtitle: 'Start selling online with a complete e-commerce package.', description: '🔹 Custom storefronts, secure payments, order management, and branded marketing materials to boost your online presence.' },
    { id: '5', iconName: 'Rocket', title: 'SaaS Product Development', subtitle: 'Transform your idea into a scalable Software-as-a-Service platform.', description: '🔹 From MVP development to full-scale SaaS products, designed for growth and performance.' },
    { id: '6', iconName: 'Share2', title: 'API Development & Integration', subtitle: 'Extend and connect your systems with powerful APIs.', description: '🔹 Secure REST APIs, third-party integrations, and custom backend solutions built for reliability and scalability.' },
];


export async function getServiceCards(): Promise<ServiceCard[]> {
  try {
    const cardsRef = collection(db, 'servicesCards');
    const q = query(cardsRef, orderBy('createdAt', 'asc'));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
        return defaultServiceCards;
    }
    
    const cards: ServiceCard[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      cards.push({
        id: doc.id,
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        iconName: data.iconName,
        createdAt: (data.createdAt as Timestamp)?.toDate().toISOString(),
      });
    });
    return cards;
  } catch (error) {
    console.error("Error fetching service cards:", error);
    return defaultServiceCards;
  }
}

export async function getServiceCardById(id: string): Promise<ServiceCard | null> {
  try {
    const docRef = doc(db, 'servicesCards', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        iconName: data.iconName,
        createdAt: (data.createdAt as Timestamp)?.toDate().toISOString(),
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching service card by ID:", error);
    return null;
  }
}

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  try {
    const submissionsRef = collection(db, 'contactSubmissions');
    const q = query(submissionsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const submissions: ContactSubmission[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      submissions.push({
        id: doc.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        createdAt: (data.createdAt as Timestamp)?.toDate().toISOString(),
      });
    });
    return submissions;
  } catch (error) {
    console.error("Error fetching contact submissions:", error);
    return [];
  }
}
