'use server';
/**
 * @fileOverview A Genkit flow for generating feature card content using AI.
 *
 * - generateFeatureCards - A function that generates titles, descriptions, and icons for feature cards.
 * - GenerateFeatureCardsInput - The input type for the generateFeatureCards function.
 * - GenerateFeatureCardsOutput - The return type for the generateFeatureCards function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { ALL_ICONS } from '@/lib/icons';

const GenerateFeatureCardsInputSchema = z.object({
  count: z.coerce.number().int().min(1).max(10).describe("The number of feature cards to generate."),
  context: z.string().min(10).describe("The project context or theme to base the features on."),
});
export type GenerateFeatureCardsInput = z.infer<typeof GenerateFeatureCardsInputSchema>;

const FeatureCardSchema = z.object({
    title: z.string().describe("A concise, compelling title for the feature."),
    description: z.string().describe("A brief, one-sentence description of the feature."),
    iconName: z.string().describe("A relevant icon name. This MUST be an exact match from the list of 'Available Icons' provided in the main prompt."),
});

const GenerateFeatureCardsOutputSchema = z.object({
  cards: z.array(FeatureCardSchema).describe("An array of generated feature cards."),
});
export type GenerateFeatureCardsOutput = z.infer<typeof GenerateFeatureCardsOutputSchema>;


export async function generateFeatureCards(input: GenerateFeatureCardsInput): Promise<GenerateFeatureCardsOutput> {
  return generateFeatureCardsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFeatureCardsPrompt',
  input: { schema: GenerateFeatureCardsInputSchema },
  output: { schema: GenerateFeatureCardsOutputSchema },
  prompt: `You are a creative strategist for a cutting-edge digital agency called CyberLim.
Your task is to brainstorm and generate content for feature cards for a client project.

Based on the project context provided, generate exactly {{{count}}} unique and compelling feature cards.

Each card MUST have:
1.  A short, catchy title (e.g., "AI-Powered Insights", "Decentralized Identity").
2.  A one-sentence description explaining the feature's benefit.
3.  A relevant icon name chosen STRICTLY from the list of available icons provided below. Do not invent icons.

Project Context:
---
{{{context}}}
---

Available Icons:
${ALL_ICONS.join(', ')}

Please provide your response in the required JSON format. Ensure the iconName for each card is an exact match from the list of available icons.
`,
});

const generateFeatureCardsFlow = ai.defineFlow(
  {
    name: 'generateFeatureCardsFlow',
    inputSchema: GenerateFeatureCardsInputSchema,
    outputSchema: GenerateFeatureCardsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate feature cards.");
    }
    
    // Validate that the returned icon exists in the list to prevent rendering errors.
    const validatedCards = output.cards.map(card => {
        const iconExists = (ALL_ICONS as readonly string[]).includes(card.iconName);
        return {
            ...card,
            iconName: iconExists ? card.iconName : 'HelpCircle', // Default to a fallback icon if invalid
        };
    });

    return { cards: validatedCards };
  }
);
