# CyberLIM - Agency Portfolio & Admin Panel

This is a comprehensive, full-stack portfolio website for a digital agency named "CyberLIM". It features a dynamic, animated frontend built with Next.js and a powerful, integrated admin panel for managing all site content in real-time. The project leverages Firebase for the backend and Genkit for AI-powered content generation.

## Core Features

- **Dynamic Homepage:** A visually rich, animated homepage featuring:
  - Customizable Navbar with animated logo.
  - GSAP-powered animations for hero text and content reveals.
  - Infinite scrolling carousels for background elements.
  - Interactive "torch" and "spotlight" hover effects.
- **Content-Managed Sections:** All major sections of the website can be updated directly from the admin panel without touching code.
  - **Hero Section:** Edit heading, text, font sizes, and background elements.
  - **Features Section:** Add, edit, delete, and re-style feature cards.
  - **Projects Section:** Manage a full project portfolio with a dynamic layout switcher (Bento Grid, Grid, Carousel).
- **AI-Powered Content Generation:**
  - **Feature Cards:** Generate titles, descriptions, and select appropriate icons based on a project prompt.
  - **Project Case Studies:** Generate complete, detailed project pages from a single prompt, including descriptions, tech stacks, challenges, and more.
  - **Image Generation:** Create images for the project gallery using a text prompt.
- **Admin Panel:** A secure, behind-auth admin dashboard for site management.
  - **Real-time Updates:** All changes made in the admin panel are instantly reflected on the live site thanks to Next.js's `revalidatePath`.
  - **Cloudinary Integration:** Seamless image uploading for all content.
  - **Intuitive UI:** A clean, component-based interface for easy content management.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **AI:** [Firebase Genkit](https://firebase.google.com/docs/genkit) (with Gemini)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
- **Animations:** [GSAP (GreenSock Animation Platform)](https://gsap.com/)
- **Database & Auth:** [Firebase (Firestore & Authentication)](https://firebase.google.com/)
- **Image Management:** [Cloudinary](https://cloudinary.com/)
- **Deployment:** Assumed to be on a platform like Vercel or Firebase App Hosting.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd <project-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root of your project. You will need to populate it with the necessary API keys and secrets for Firebase, Google AI (Genkit), and Cloudinary, as well as your admin credentials and a session secret.

### Running the Development Server

To run the application in development mode, use the following command:

```bash
npm run dev
```

This will start the Next.js development server, typically on [http://localhost:9002](http://localhost:9002). You can access the admin panel by navigating to `/auth/signin`.
