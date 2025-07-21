
'use server';
/**
 * @fileOverview A Genkit flow for generating a full project case study.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateProjectInputSchema = z.object({
  prompt: z.string().min(10).describe("A detailed prompt describing the project to be generated."),
});
export type GenerateProjectInput = z.infer<typeof GenerateProjectInputSchema>;

const GenerateProjectOutputSchema = z.object({
    title: z.string().describe("A concise, compelling title for the project."),
    tagline: z.string().describe("A catchy, one-sentence tagline for the project."),
    description: z.string().describe("A full, detailed paragraph describing the project."),
    
    industry: z.string().describe("The industry the project belongs to (e.g., 'E-commerce', 'FinTech')."),
    problem: z.string().describe("The core problem the project solves, written as a paragraph."),
    solution: z.string().describe("The solution the project provides, written as a paragraph."),
    
    goals: z.array(z.string()).describe("A list of 3-4 key project goals."),
    challenges: z.array(z.string()).describe("A list of 2-3 key challenges faced during the project."),
    
    research: z.string().describe("A paragraph describing the research phase of the approach."),
    design: z.string().describe("A paragraph describing the design phase of the approach."),
    development: z.string().describe("A paragraph describing the development phase of the approach."),
    
    techStack: z.array(z.object({
        name: z.string(),
        category: z.enum(['Frontend', 'Backend', 'Database', 'Tools', 'Platform', 'Language'])
    })).describe("A list of 5-7 technologies used, with their correct category."),

    features: z.array(z.string()).describe("A list of 5-6 key features built for the project."),

    results: z.array(z.object({
        value: z.string().describe("The metric value (e.g., '40%', '500+')."),
        title: z.string().describe("The title of the metric (e.g., 'Increase in Conversion Rate').")
    })).describe("A list of 3 tangible results or outcomes."),
    
    clientName: z.string().describe("A plausible, fictional name for the client company."),
    testimonial: z.string().describe("A positive, one-sentence testimonial from the fictional client."),
    
    liveUrl: z.string().describe("A placeholder URL for the live project, e.g., 'https://example.com'."),
    tags: z.array(z.string()).describe("A list of 3-4 relevant tags for the project (e.g., 'AI', 'Next.js')."),
    gridClassName: z.string().optional().describe("An optional Tailwind CSS class for bento grid layout (e.g., 'md:col-span-2'). Can be an empty string."),
});
export type GenerateProjectOutput = z.infer<typeof GenerateProjectOutputSchema>;


export async function generateProjectDetails(input: GenerateProjectInput): Promise<GenerateProjectOutput> {
  return generateProjectDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProjectDetailsPrompt',
  input: { schema: GenerateProjectInputSchema },
  output: { schema: GenerateProjectOutputSchema },
  prompt: `You are a creative director and project manager at a digital agency called CyberLim.
Your task is to generate a complete, detailed, and professional-sounding project case study based on a user's prompt.
The case study should be well-written, plausible, and structured according to the required JSON format.

Fill out ALL fields in the output schema. Be creative and generate realistic details for every field.

User's Project Prompt:
---
{{{prompt}}}
---

Your response MUST be in the required JSON format.
`,
});

const generateProjectDetailsFlow = ai.defineFlow(
  {
    name: 'generateProjectDetailsFlow',
    inputSchema: GenerateProjectInputSchema,
    outputSchema: GenerateProjectOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate project details.");
    }
    return output;
  }
);
