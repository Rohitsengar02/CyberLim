
"use server";

import { z } from "zod";
import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/firebase-admin";
import cloudinary from '@/lib/cloudinary';
import { generateProjectDetails } from "@/ai/flows/generate-project-details-flow";
import type { GenerateProjectOutput } from "@/ai/flows/generate-project-details-flow";
import { generateImage } from "@/ai/flows/generate-image-flow";
import type { GenerateImageOutput } from "@/ai/flows/generate-image-flow";

const layoutSchema = z.object({
  layout: z.enum(['bento', 'grid', 'carousel']),
});

export async function updateProjectLayoutConfig(prevState: any, formData: FormData) {
  try {
    const parsed = layoutSchema.safeParse({
      layout: formData.get("layout"),
    });

    if (!parsed.success) {
      return { success: false, message: parsed.error.errors.map(e => e.message).join(', ') };
    }

    const db = getDb();
    const docRef = db.collection("projectLayout").doc("main");
    await docRef.set(parsed.data, { merge: true });

    revalidatePath("/");
    revalidatePath("/admin/projects/cards");

    return { success: true, message: "Project layout updated successfully!" };
  } catch (error) {
    console.error("Error updating project layout config:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    return { success: false, message };
  }
}

export async function uploadImageAction(formData: FormData): Promise<{ success: boolean; message: string; imageUrl?: string }> {
    if (!process.env.CLOUDINARY_UPLOAD_PRESET) {
        return { success: false, message: "Cloudinary upload preset is not configured." };
    }

    const file = formData.get('file') as File | null;
    if (!file) {
        return { success: false, message: "No file provided." };
    }

    try {
        const dataUri = await file.arrayBuffer().then(buffer => {
            const b64 = Buffer.from(buffer).toString('base64');
            return `data:${file.type};base64,${b64}`;
        });
        
        const result = await cloudinary.uploader.upload(dataUri, {
            upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
        });

        if (!result?.secure_url) {
            return { success: false, message: "Image upload failed." };
        }

        return { success: true, message: "Image uploaded successfully.", imageUrl: result.secure_url };

    } catch (error) {
        console.error("Error uploading image:", error);
        const message = error instanceof Error ? error.message : "An unexpected error occurred.";
        return { success: false, message };
    }
}


const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text


// Helper function to parse 'Value (Title)' format
const parseValueTitle = (lines: string): {value: string, title: string}[] => {
  return lines.split('\n').map(line => {
    const match = line.match(/(.*)\s\((.*)\)/);
    if (match) {
      return { value: match[1].trim(), title: match[2].trim() };
    }
    return null;
  }).filter((item): item is {value: string, title: string} => item !== null);
};

const techStackCategories = ['Frontend', 'Backend', 'Database', 'Tools', 'Platform', 'Language'] as const;
type TechCategory = typeof techStackCategories[number];

// Helper to parse 'Tech Name (Category)' format
const parseTechStack = (lines: string): {name: string, category: TechCategory}[] => {
  return lines.split('\n').map(line => {
    const match = line.match(/(.*)\s\((.*)\)/);
    if (match) {
      const category = match[2].trim() as TechCategory;
      if (techStackCategories.includes(category)) {
        return { name: match[1].trim(), category };
      }
    }
    return null;
  }).filter((item): item is {name: string, category: TechCategory} => item !== null);
};


const upsertSchema = z.object({
  projectId: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  tagline: z.string().min(1, "Tagline is required"),
  description: z.string().min(1, "Description is required"),
  liveUrl: z.string().url().optional().or(z.literal('')),
  animationColor: z.enum(['pink', 'green', 'white']),
  gridClassName: z.string().optional(),
  tags: z.string().optional(),
  
  // Overview
  industry: z.string().optional(),
  problem: z.string().optional(),
  solution: z.string().optional(),

  // Goals & Challenges
  goals: z.string().optional(),
  challenges: z.string().optional(),

  // Approach
  research: z.string().optional(),
  design: z.string().optional(),
  development: z.string().optional(),

  // Tech & Features
  techStack: z.string().optional(),
  features: z.string().optional(),
  
  // Results & Client
  results: z.string().optional(),
  clientName: z.string().optional(),
  testimonial: z.string().optional(),
  satisfaction: z.enum(['happy', 'neutral', 'unhappy']).optional(),
});


export async function upsertProject(prevState: any, formData: FormData): Promise<{ success: boolean, message: string }> {
    if (!process.env.CLOUDINARY_UPLOAD_PRESET) {
        return { success: false, message: "Cloudinary upload preset is not configured. Please check your .env file." };
    }
    
    try {
        const rawProjectId = formData.get("projectId");
        const formValues = {
            projectId: rawProjectId ? String(rawProjectId) : undefined,
            title: formData.get("title") as string,
            tagline: formData.get("tagline") as string,
            description: formData.get("description") as string,
            liveUrl: formData.get("liveUrl") as string,
            animationColor: formData.get("animationColor") as "pink" | "green" | "white",
            gridClassName: formData.get("gridClassName") as string | undefined,
            tags: formData.get("tags") as string | undefined,
            industry: formData.get("industry") as string | undefined,
            problem: formData.get("problem") as string | undefined,
            solution: formData.get("solution") as string | undefined,
            goals: formData.get("goals") as string | undefined,
            challenges: formData.get("challenges") as string | undefined,
            research: formData.get("research") as string | undefined,
            design: formData.get("design") as string | undefined,
            development: formData.get("development") as string | undefined,
            techStack: formData.get("techStack") as string | undefined,
            features: formData.get("features") as string | undefined,
            results: formData.get("results") as string | undefined,
            clientName: formData.get("clientName") as string | undefined,
            testimonial: formData.get("testimonial") as string | undefined,
            satisfaction: formData.get("satisfaction") as "happy" | "neutral" | "unhappy" | undefined,
        };
        
        const parsed = upsertSchema.safeParse(formValues);
        
        if (!parsed.success) {
            console.error(parsed.error.flatten().fieldErrors);
            return { success: false, message: parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ') };
        }

        const { projectId, ...data } = parsed.data;
        const slug = slugify(data.title);
        
        const imageFile = formData.get("imageUrl") as File | null;
        let finalImageUrl = formData.get("currentImageUrl") as string;
        
        if (imageFile && imageFile instanceof File && imageFile.size > 0) {
            const dataUri = await imageFile.arrayBuffer().then(buffer => `data:${imageFile.type};base64,${Buffer.from(buffer).toString('base64')}`);
            const result = await cloudinary.uploader.upload(dataUri, { upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET });
            if (result?.secure_url) {
                finalImageUrl = result.secure_url;
            }
        }
        
        const galleryJSON = formData.get("galleryJSON") as string | null;
        const finalGalleryUrls = galleryJSON ? JSON.parse(galleryJSON) : [];
        
        if (!projectId && !finalImageUrl) {
            return { success: false, message: "A main image is required for new projects." };
        }
        
        const projectData = { 
            title: data.title,
            tagline: data.tagline,
            description: data.description,
            liveUrl: data.liveUrl,
            animationColor: data.animationColor,
            gridClassName: data.gridClassName,
            slug,
            href: `/projects/${slug}`,
            tags: data.tags?.split('\n').map(tag => tag.trim()).filter(Boolean) || [],
            imageUrl: finalImageUrl,
            gallery: finalGalleryUrls,
            createdAt: FieldValue.serverTimestamp(),
            overview: {
              industry: data.industry || '',
              problem: data.problem || '',
              solution: data.solution || '',
            },
            goals: data.goals?.split('\n').map(item => item.trim()).filter(Boolean) || [],
            challenges: data.challenges?.split('\n').map(item => item.trim()).filter(Boolean) || [],
            approach: {
              research: data.research || '',
              design: data.design || '',
              development: data.development || '',
            },
            techStack: data.techStack ? parseTechStack(data.techStack) : [],
            features: data.features?.split('\n').map(item => item.trim()).filter(Boolean) || [],
            results: data.results ? parseValueTitle(data.results) : [],
            client: (data.clientName || data.testimonial || data.satisfaction) ? {
              name: data.clientName || '',
              testimonial: data.testimonial || '',
              satisfaction: data.satisfaction || 'neutral',
            } : null
        };
        
        const db = getDb();
        if (projectId) {
            await db.collection("projects").doc(projectId).set(projectData, { merge: true });
        } else {
            await db.collection("projects").add(projectData);
        }

        revalidatePath('/');
        revalidatePath('/admin/projects');
        revalidatePath('/admin/projects/cards');
        revalidatePath(`/projects/${slug}`);
        
        return { success: true, message: 'Project saved successfully!' };

    } catch (error) {
        console.error("Error upserting project:", error);
        const message = error instanceof Error ? error.message : "An unexpected error occurred.";
        return { success: false, message };
    }
}

export async function deleteProject(prevState: any, formData: FormData) {
    const projectId = formData.get("projectId") as string;
    if (!projectId) {
        return { success: false, message: "Project ID is missing." };
    }

    try {
        const db = getDb();
        await db.collection("projects").doc(projectId).delete();
        revalidatePath('/');
        revalidatePath('/admin/projects/cards');
        return { success: true, message: "Project deleted successfully." };
    } catch (error) {
        console.error("Error deleting project:", error);
        return { success: false, message: "Failed to delete project." };
    }
}


export async function generateProjectDetailsAction(prevState: any, formData: FormData): Promise<{
    success: boolean;
    message: string;
    data?: GenerateProjectOutput | null;
}> {
    const prompt = formData.get("prompt") as string;
    if (!prompt || prompt.length < 10) {
        return { success: false, message: "Please provide a more detailed prompt.", data: null };
    }

    try {
        const aiResponse = await generateProjectDetails({ prompt });
        if (!aiResponse) {
            return { success: false, message: "AI failed to generate project details. Please try again.", data: null };
        }
        return { success: true, message: "Content generated successfully!", data: aiResponse };
    } catch (error) {
        console.error("Error in AI generation action:", error);
        const message = error instanceof Error ? error.message : "An unexpected error occurred during AI generation.";
        return { success: false, message, data: null };
    }
}

export async function generateProjectImageAction(prevState: any, formData: FormData): Promise<{
    success: boolean;
    message: string;
    data?: GenerateImageOutput | null;
}> {
    const prompt = formData.get("prompt") as string;
    if (!prompt || prompt.length < 3) {
        return { success: false, message: "Please provide a prompt.", data: null };
    }

    try {
        const aiResponse = await generateImage({ prompt });
        if (!aiResponse?.imageUrl) {
            return { success: false, message: "AI failed to generate an image.", data: null };
        }
        return { success: true, message: "Image generated successfully!", data: aiResponse };
    } catch (error) {
        console.error("Error in AI image generation action:", error);
        const message = error instanceof Error ? error.message : "An unexpected error occurred during AI generation.";
        return { success: false, message, data: null };
    }
}
