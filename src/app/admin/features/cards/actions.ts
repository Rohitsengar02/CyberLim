
"use server";

import { z } from 'zod';
import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getDb } from '@/lib/firebase-admin';
import { ALL_ICONS } from '@/lib/icons';
import { generateFeatureCards } from '@/ai/flows/generate-feature-cards-flow';

const upsertSchema = z.object({
  cardId: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  iconName: z.enum(ALL_ICONS),
});

export async function upsertFeatureCard(prevState: any, formData: FormData) {
    const parsed = upsertSchema.safeParse({
        cardId: formData.get("cardId") as string | undefined,
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        iconName: formData.get("iconName") as string,
    });
    
    if (!parsed.success) {
        return { success: false, message: parsed.error.errors.map(e => e.message).join(', ') };
    }

    const { cardId, ...data } = parsed.data;
    
    try {
        const cardData = { 
            ...data, 
            createdAt: FieldValue.serverTimestamp()
        };
        
        const db = getDb();
        if (cardId) {
            await db.collection("featuresCards").doc(cardId).set(cardData, { merge: true });
        } else {
            await db.collection("featuresCards").add(cardData);
        }

        revalidatePath('/');
        revalidatePath('/admin/features/cards');
        revalidatePath('/admin/features/cards/edit');

    } catch (error) {
        console.error("Error upserting feature card:", error);
        const message = error instanceof Error ? error.message : "An unexpected error occurred.";
        return { success: false, message };
    }
    
    redirect('/admin/features/cards');
}

export async function deleteFeatureCard(prevState: any, formData: FormData) {
    const cardId = formData.get("cardId") as string;
    if (!cardId) {
        return { success: false, message: "Card ID is missing." };
    }

    try {
        const db = getDb();
        await db.collection("featuresCards").doc(cardId).delete();
        revalidatePath('/');
        revalidatePath('/admin/features/cards');
        return { success: true, message: "Card deleted successfully." };
    } catch (error) {
        console.error("Error deleting feature card:", error);
        return { success: false, message: "Failed to delete card." };
    }
}


const generateSchema = z.object({
  count: z.coerce.number().int().min(1, "Must generate at least 1 card.").max(8, "Cannot generate more than 8 cards at a time."),
  context: z.string().min(10, "Project context must be at least 10 characters.").max(500, "Context is too long."),
});

export async function generateAndSaveFeatureCards(prevState: any, formData: FormData) {
    const parsed = generateSchema.safeParse({
        count: formData.get("count"),
        context: formData.get("context"),
    });

    if (!parsed.success) {
        return { success: false, message: parsed.error.errors.map(e => e.message).join(', ') };
    }
    
    try {
        const aiResponse = await generateFeatureCards(parsed.data);

        if (!aiResponse || !aiResponse.cards || aiResponse.cards.length === 0) {
            return { success: false, message: "AI failed to generate cards. Please try again." };
        }
        
        const db = getDb();
        const batch = db.batch();
        
        aiResponse.cards.forEach(card => {
            const newCardRef = db.collection("featuresCards").doc();
            batch.set(newCardRef, {
                ...card,
                createdAt: FieldValue.serverTimestamp()
            });
        });
        
        await batch.commit();

        revalidatePath('/');
        revalidatePath('/admin/features/cards');

        return { success: true, message: `${aiResponse.cards.length} cards generated and saved successfully!` };

    } catch (error) {
        console.error("Error generating feature cards with AI:", error);
        const message = error instanceof Error ? error.message : "An unexpected error occurred during AI generation.";
        return { success: false, message };
    }
}
