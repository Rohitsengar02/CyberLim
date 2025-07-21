
import type { Project } from '@/types/project';

export const projectsData: Project[] = [
  {
    id: 1,
    slug: 'ai-chatbot-for-e-commerce',
    title: 'AI Chatbot for E-commerce',
    tagline: 'A smart assistant that elevates the shopping experience by providing instant, personalized support.',
    description: 'A smart assistant that elevates the shopping experience by providing instant, personalized support.',
    tags: ['AI', 'Next.js', 'Firebase'],
    href: '/projects/ai-chatbot-for-e-commerce',
    liveUrl: '#',
    isFeatured: true,
    animationColor: 'pink',
    gridClassName: 'md:col-span-2 md:row-span-2',
    imageUrl: 'https://i.pinimg.com/736x/3c/5f/f8/3c5ff8b0a7b255c797489aae211961ce.jpg',
    gallery: [
      'https://placehold.co/1280x720.png',
      'https://placehold.co/1280x720.png',
      'https://placehold.co/1280x720.png',
      'https://placehold.co/1280x720.png',
    ],
    overview: {
      industry: "E-commerce",
      problem: "The client, a large online retailer, was struggling with high volumes of customer support queries, leading to slow response times and customer dissatisfaction. They also wanted to increase user engagement and provide personalized shopping experiences.",
      solution: "We developed a sophisticated AI-powered chatbot integrated directly into their e-commerce platform. The chatbot handles common queries, provides real-time order tracking, and offers personalized product recommendations based on browsing history and user preferences, significantly improving the customer journey."
    },
    goals: [
      "Reduce customer service overhead by 50%",
      "Increase average order value through personalization",
      "Provide 24/7 instant customer support",
      "Improve overall customer satisfaction scores"
    ],
    challenges: [
      "Integrating with a complex, existing product catalog API.",
      "Ensuring the chatbot's natural language understanding was accurate.",
      "Creating a seamless handover process to human agents for complex issues."
    ],
    approach: {
      research: "Analyzed thousands of historical support tickets to identify common query patterns and training data for the AI.",
      design: "Prototyped conversation flows in Figma to ensure a natural and intuitive user interaction.",
      development: "Used an agile methodology with 2-week sprints to rapidly iterate and deploy new features based on user feedback."
    },
    techStack: [
        { name: 'Next.js', category: 'Frontend' },
        { name: 'TypeScript', category: 'Language' },
        { name: 'Tailwind CSS', category: 'Frontend' },
        { name: 'Firebase', category: 'Backend' },
        { name: 'Dialogflow', category: 'Tools' },
        { name: 'Vercel', category: 'Platform' }
    ],
    features: [
        "Natural Language Processing (NLP)",
        "Personalized Product Recommendations",
        "Real-time Order Tracking",
        "Seamless Human-Agent Handover",
        "Customer Feedback Collection",
        "Admin Dashboard for Analytics"
    ],
    results: [
      { title: 'Increase in Conversion Rate', value: '40%' },
      { title: 'Reduction in Support Tickets', value: '65%' },
      { title: 'Increase in Average Order Value', value: '25%' }
    ],
    client: {
        name: "ShopSphere Inc.",
        testimonial: "CyberLim delivered beyond our expectations. The AI chatbot has revolutionized our customer interaction, leading to a 40% increase in conversion rates.",
        satisfaction: "happy"
    }
  },
  {
    id: 2,
    slug: 'blockchain-payroll-platform',
    title: 'Blockchain Payroll Platform',
    tagline: 'Automating salary distribution and financial reporting for web3 companies using smart contracts.',
    description: 'Automating salary distribution and financial reporting for web3 companies using smart contracts.',
    tags: ['Web3', 'React', 'Solidity'],
    href: '/projects/blockchain-payroll-platform',
    liveUrl: '#',
    animationColor: 'green',
    gridClassName: 'md:col-span-2 md:row-span-1',
    imageUrl: 'https://i.pinimg.com/736x/cf/a1/fb/cfa1fb21482bce624a815408e07e0944.jpg',
    gallery: [
      'https://placehold.co/1280x720.png',
      'https://placehold.co/1280x720.png',
      'https://placehold.co/1280x720.png',
      'https://placehold.co/1280x720.png',
    ],
    overview: {
        industry: "FinTech / Web3",
        problem: "Web3 native companies face unique challenges in managing payroll, especially when dealing with multiple cryptocurrencies and team members distributed globally. Traditional payroll systems are not equipped for this.",
        solution: "We built a decentralized application (dApp) that allows companies to automate payroll using smart contracts. The platform supports payments in various tokens, handles vesting schedules, and provides transparent, on-chain financial records."
    },
    goals: [
        "Automate multi-currency payroll.",
        "Ensure transparency and security of funds.",
        "Reduce administrative overhead.",
        "Provide tamper-proof financial reporting."
    ],
    challenges: [
        "Optimizing smart contracts for low gas fees.",
        "Ensuring robust security against vulnerabilities.",
        "Creating an intuitive UI for non-technical HR managers."
    ],
    approach: {
        research: "Conducted market analysis of existing DeFi protocols and payroll solutions to identify gaps and opportunities.",
        design: "Wireframed a user-centric dashboard that simplifies complex blockchain interactions.",
        development: "Followed a test-driven development (TDD) approach for smart contracts to ensure maximum security and reliability."
    },
    techStack: [
        { name: 'React', category: 'Frontend' },
        { name: 'Ethers.js', category: 'Frontend' },
        { name: 'Solidity', category: 'Language' },
        { name: 'Hardhat', category: 'Tools' },
        { name: 'IPFS', category: 'Database' },
        { name: 'TheGraph', category: 'Backend' }
    ],
    features: [
        "Smart Contract-based Automation",
        "Multi-token Payment Support",
        "Automated Vesting Schedules",
        "On-chain Transaction History",
        "Role-based Access Control",
        "CSV Upload for Bulk Payments"
    ],
    results: [
        { title: 'Reduction in Payroll Processing Time', value: '90%' },
        { title: 'Transaction Gas Fees Saved', value: '30%' },
        { title: 'Admin Hours Saved Per Month', value: '40+' }
    ],
    client: {
        name: "CryptoPay",
        testimonial: "The platform is a game-changer for Web3 startups. It's secure, transparent, and has saved us countless hours in payroll processing.",
        satisfaction: "happy"
    }
  },
  {
    id: 3,
    slug: 'digital-art-marketplace',
    title: 'Digital Art Marketplace',
    tagline: 'A decentralized platform for artists to mint, showcase, and trade their unique digital creations as NFTs.',
    description: 'A decentralized platform for artists to mint, showcase, and trade their unique digital creations as NFTs.',
    tags: ['NFT', 'Vue.js', 'IPFS'],
    href: '/projects/digital-art-marketplace',
    liveUrl: '#',
    animationColor: 'white',
    gridClassName: 'md:col-span-1 md:row-span-1',
    imageUrl: 'https://i.pinimg.com/736x/74/b7/73/74b77366f37158d3ad354fc511fdbb9d.jpg',
    gallery: [
      'https://placehold.co/1280x720.png',
      'https://placehold.co/1280x720.png',
      'https://placehold.co/1280x720.png',
      'https://placehold.co/1280x720.png',
    ],
     overview: {
        industry: "Art / NFT",
        problem: "Existing NFT marketplaces were often criticized for high fees, lack of curation, and being difficult for non-technical artists to use. Artists needed a platform that prioritized their needs.",
        solution: "We created a curated NFT marketplace with a focus on user experience. It features a simple, no-code minting process for artists, low transaction fees, and a beautiful gallery to showcase digital art. All metadata is stored on IPFS for true decentralization."
    },
    goals: [
        "Provide an easy-to-use NFT minting process.",
        "Create a highly curated and visually appealing gallery.",
        "Lower transaction fees compared to competitors.",
        "Ensure art and metadata are stored decentrally."
    ],
    challenges: [
        "Building a performant UI that could handle high-resolution images.",
        "Educating a new user base on how to use a web3 wallet.",
        "Implementing a fair and transparent curation process."
    ],
    approach: {
        research: "Interviewed digital artists to understand their pain points with existing platforms.",
        design: "Focused on a minimalist and image-forward design to let the artwork be the hero.",
        development: "Built the front-end and smart contracts in parallel to ensure tight integration and a smooth user flow."
    },
    techStack: [
        { name: 'Vue.js', category: 'Frontend' },
        { name: 'Pinia', category: 'Frontend' },
        { name: 'ERC-721', category: 'Backend' },
        { name: 'IPFS', category: 'Database' },
        { name: 'Hardhat', category: 'Tools' },
        { name: 'Alchemy', category: 'Platform' }
    ],
    features: [
        "No-code NFT Minting",
        "Gas-efficient Smart Contracts",
        "Curated Artist Galleries",
        "Decentralized Artwork Storage",
        "Secondary Market Royalties",
        "Community Voting System"
    ],
    results: [
        { title: 'Artist Sign-ups in First Month', value: '500+' },
        { title: 'Avg. Secondary Sale Royalty', value: '10%' },
        { title: 'Transaction Fee Reduction', value: '50%' }
    ],
    client: {
        name: "Artify",
        testimonial: "Working with CyberLim was a pleasure. They understood our vision for a creator-centric platform and brought it to life flawlessly.",
        satisfaction: "happy"
    }
  },
  {
    id: 4,
    slug: 'vr-training-simulation',
    title: 'VR Training Simulation',
    tagline: 'Immersive virtual reality simulations for complex industrial training, reducing risks and improving skills.',
    description: 'Immersive virtual reality simulations for complex industrial training, reducing risks and improving skills.',
    tags: ['VR', 'Unity', 'C#'],
    href: '/projects/vr-training-simulation',
    liveUrl: '#',
    animationColor: 'pink',
    gridClassName: 'md:col-span-1 md:row-span-1',
    imageUrl: 'https://i.pinimg.com/736x/01/c4/93/01c49330a880592577764817feb047e6.jpg',
    gallery: [
      'https://placehold.co/1280x720.png',
      'https://placehold.co/1280x720.png',
      'https://placehold.co/1280x720.png',
      'https://placehold.co/1280x720.png',
    ],
    overview: {
        industry: "Industrial / Education",
        problem: "Training heavy machinery operators is expensive, dangerous, and time-consuming. On-the-job mistakes can lead to costly damages and serious injuries.",
        solution: "We developed a high-fidelity VR simulation that provides a safe, repeatable, and measurable training environment. Trainees can practice operating complex machinery in a variety of scenarios without any real-world risk, and trainers can track their performance through an analytics dashboard."
    },
    goals: [
        "Create a realistic and immersive training experience.",
        "Reduce training-related accidents to zero.",
        "Decrease the time required to onboard new operators.",
        "Provide trainers with data-driven performance metrics."
    ],
    challenges: [
        "Achieving realistic physics and machine behavior in VR.",
        "Optimizing performance for standalone VR headsets (Oculus Quest 2).",
        "Designing an intuitive user interface for use within a VR environment."
    ],
    approach: {
        research: "Collaborated with veteran machine operators and safety instructors to ensure simulation accuracy.",
        design: "Iterated on VR interaction models to find the most intuitive control scheme.",
        development: "Focused on performance optimization from day one to ensure a smooth, high-framerate experience."
    },
    techStack: [
        { name: 'Unity', category: 'Platform' },
        { name: 'C#', category: 'Language' },
        { name: 'Oculus SDK', category: 'Tools' },
        { name: 'Node.js', category: 'Backend' },
        { name: 'Express', category: 'Backend' },
        { name: 'AWS', category: 'Platform' }
    ],
    features: [
        "Realistic Physics Simulation",
        "Scenario-based Training Modules",
        "Performance Tracking & Analytics",
        "Multi-user Collaborative Mode",
        "Emergency Situation Drills",
        "Haptic Feedback Integration"
    ],
    results: [
        { title: 'Reduction in On-site Accidents', value: '100%' },
        { title: 'Faster Operator Certification', value: '45%' },
        { title: 'Increase in Operator Confidence', value: '95%' }
    ],
    client: {
        name: "SafeWorks Industries",
        testimonial: "The VR simulation has become an indispensable part of our training program. It's safer, more effective, and more engaging than our previous methods.",
        satisfaction: "happy"
    }
  },
  {
    id: 5,
    slug: 'health-and-wellness-app',
    title: 'Health & Wellness App',
    tagline: 'A comprehensive mobile app for tracking fitness, nutrition, and mental well-being with AI-driven insights.',
    description: 'A comprehensive mobile app for tracking fitness, nutrition, and mental well-being with AI-driven insights.',
    tags: ['Mobile', 'AI', 'SwiftUI'],
    href: '/projects/health-and-wellness-app',
    liveUrl: '#',
    animationColor: 'white',
    gridClassName: 'md:col-span-2 md:row-span-1',
    imageUrl: 'https://i.pinimg.com/736x/ce/3c/f8/ce3cf83384b435d98fe46b1ded3b8ece.jpg',
    gallery: [
      'https://placehold.co/1280x720.png',
      'https://placehold.co/1280x720.png',
      'https://placehold.co/1280x720.png',
      'https://placehold.co/1280x720.png',
    ],
    overview: {
      industry: "Health & Wellness",
      problem: "Users often feel overwhelmed by generic fitness and nutrition advice. They needed a personalized experience that adapts to their unique body, lifestyle, and goals.",
      solution: "We built a native mobile application that acts as a personal wellness coach. It uses an AI model to analyze user-inputted data (activity, diet, mood) and provides actionable, personalized insights and plans. Features include a barcode scanner for food logging and guided meditations."
    },
    goals: [
      "Deliver highly personalized wellness plans.",
      "Increase daily user engagement.",
      "Achieve seamless integration with Apple Health / Google Fit.",
      "Create an intuitive and motivating user experience."
    ],
    challenges: [
      "Developing a cross-platform AI model that runs efficiently.",
      "Ensuring user data privacy and HIPAA compliance.",
      "Motivating long-term user retention in a competitive market."
    ],
    approach: {
      research: "Conducted user surveys and competitor analysis to define a unique value proposition.",
      design: "Created a clean, calming UI with a focus on positive reinforcement and data visualization.",
      development: "Built fully native applications for iOS and Android to ensure the best performance and platform integration."
    },
    techStack: [
      { name: 'SwiftUI', category: 'Frontend' },
      { name: 'Kotlin', category: 'Frontend' },
      { name: 'Python', category: 'Backend' },
      { name: 'FastAPI', category: 'Backend' },
      { name: 'PostgreSQL', category: 'Database' },
      { name: 'CoreML', category: 'Tools' }
    ],
    features: [
      "AI-driven Personalized Plans",
      "Apple Health & Google Fit Sync",
      "Barcode Scanner for Food Logging",
      "Guided Meditations & Mindfulness",
      "Progress Tracking & Gamification",
      "Secure User Data Vault"
    ],
    results: [
      { title: 'Increase in Daily Active Users', value: '300%' },
      { title: 'User Retention After 3 Months', value: '60%' },
      { title: 'App Store Rating', value: '4.9 ★' }
    ],
    client: {
        name: "Aura Health",
        testimonial: "The app is beautifully designed and incredibly smart. Our user engagement has skyrocketed since we launched the new AI features built by CyberLim.",
        satisfaction: "happy"
    }
  },
  {
    id: 6,
    slug: 'decentralized-social-network',
    title: 'Decentralized Social Network',
    tagline: 'A user-owned social media platform that prioritizes data privacy and censorship resistance.',
    description: 'A user-owned social media platform that prioritizes data privacy and censorship resistance.',
    tags: ['Web3', 'React Native', 'Gun.js'],
    href: '/projects/decentralized-social-network',
    liveUrl: '#',
    animationColor: 'green',
    gridClassName: 'md:col-span-2 md:row-span-1',
    imageUrl: 'https://i.pinimg.com/736x/b2/fc/64/b2fc64fdd65e83d7caecec5aefd9f5e7.jpg',
    gallery: [
      'https://placehold.co/1280x720.png',
      'https://placehold.co/1280x720.png',
      'https://placehold.co/1280x720.png',
      'https://placehold.co/1280x720.png',
    ],
    overview: {
      industry: "Social Media / Web3",
      problem: "Traditional social media platforms control user data, censor content, and are centralized points of failure. Users are seeking alternatives where they own their data and control their online identity.",
      solution: "We built a mobile-first decentralized social network where users are in control. Using a peer-to-peer database, all data is synchronized directly between users' devices, eliminating the need for a central server. This makes the platform censorship-resistant and ensures data sovereignty."
    },
    goals: [
      "Empower users with full ownership of their data.",
      "Create a censorship-resistant communication platform.",
      "Build a scalable peer-to-peer network.",
      "Provide end-to-end encrypted messaging."
    ],
    challenges: [
      "Managing data synchronization in a peer-to-peer network.",
      "Ensuring a smooth user experience despite network latency.",
      "Implementing a decentralized identity and reputation system."
    ],
    approach: {
      research: "Explored various decentralized storage and identity solutions to find the right fit for a mobile-first experience.",
      design: "Designed a familiar social media UI to lower the barrier to entry for new users.",
      development: "Focused on building a robust data layer with Gun.js before developing the UI on top of it with React Native."
    },
    techStack: [
      { name: 'React Native', category: 'Frontend' },
      { name: 'Gun.js', category: 'Database' },
      { name: 'WebRTC', category: 'Tools' },
      { name: 'Ethereum ID', category: 'Backend' }
    ],
    features: [
      "Peer-to-Peer Data Synchronization",
      "End-to-end Encrypted Messaging",
      "User-owned Identity and Social Graph",
      "Decentralized Content Feeds",
      "Community Moderation Tools",
      "Open-source and Community-governed"
    ],
    results: [
      { title: 'Centralized Servers', value: '0' },
      { title: 'Data Owned by Users', value: '100%' },
      { title: 'Platform Uptime', value: '99.99%' }
    ],
    client: {
        name: "FreedomNet",
        testimonial: "CyberLim's expertise in decentralized technologies was invaluable. They helped us build a platform that truly embodies the principles of Web3.",
        satisfaction: "happy"
    }
  }
];
