
export interface Project {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  href: string;
  liveUrl?: string;
  isFeatured?: boolean;
  animationColor: 'pink' | 'green' | 'white';
  gridClassName?: string;
  imageUrl?: string;
  createdAt?: string;

  // Optional detailed fields
  gallery?: string[];
  overview?: {
    industry: string;
    problem: string;
    solution: string;
  };
  goals?: string[];
  challenges?: string[];
  approach?: {
    research: string;
    design: string;
    development: string;
  };
  techStack?: {
    name: string;
    category: 'Frontend' | 'Backend' | 'Database' | 'Tools' | 'Platform' | 'Language';
  }[];
  features?: string[];
  results?: {
    title: string;
    value: string;
  }[];
  client?: {
    name: string;
    testimonial: string;
    satisfaction: 'happy' | 'neutral' | 'unhappy';
  };
}
