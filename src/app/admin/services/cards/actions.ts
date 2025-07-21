
"use server";

import { z } from 'zod';
import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getDb } from '@/lib/firebase-admin';
import { ALL_ICONS } from '@/lib/icons';

const upsertSchema = z.object({
  cardId: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  iconName: z.enum(ALL_ICONS),
});

export async function upsertServiceCard(prevState: any, formData: FormData) {
    const parsed = upsertSchema.safeParse({
        cardId: formData.get("cardId") as string | undefined,
        title: formData.get("title") as string,
        subtitle: formData.get("subtitle") as string,
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
            await db.collection("servicesCards").doc(cardId).set(cardData, { merge: true });
        } else {
            await db.collection("servicesCards").add(cardData);
        }

        revalidatePath('/');
        revalidatePath('/admin/services');
        revalidatePath('/admin/services/cards');

    } catch (error) {
        console.error("Error upserting service card:", error);
        const message = error instanceof Error ? error.message : "An unexpected error occurred.";
        return { success: false, message };
    }
    
    redirect('/admin/services/cards');
}

export async function deleteServiceCard(prevState: any, formData: FormData) {
    const cardId = formData.get("cardId") as string;
    if (!cardId) {
        return { success: false, message: "Card ID is missing." };
    }

    try {
        const db = getDb();
        await db.collection("servicesCards").doc(cardId).delete();
        revalidatePath('/');
        revalidatePath('/admin/services/cards');
        return { success: true, message: "Card deleted successfully." };
    } catch (error) {
        console.error("Error deleting service card:", error);
        return { success: false, message: "Failed to delete card." };
    }
}
