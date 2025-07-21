
"use server";

import { z } from 'zod';
import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import cloudinary from '@/lib/cloudinary';
import { getDb } from '@/lib/firebase-admin';

const uploadImage = async (file: File) => {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        uploadStream.end(buffer);
    });
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw new Error("Failed to upload image to Cloudinary.");
  }
};

const upsertSchema = z.object({
  cardId: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  username: z.string().min(1, "Username is required"),
  imageHint: z.string().optional(),
  avatarHint: z.string().optional(),
});

export async function upsertHeroCard(prevState: any, formData: FormData): Promise<{ success: boolean; message: string; }> {
    const parsed = upsertSchema.safeParse({
        cardId: formData.get("cardId") as string,
        name: formData.get("name") as string,
        username: formData.get("username") as string,
        imageHint: formData.get("imageHint") as string,
        avatarHint: formData.get("avatarHint") as string,
    });
    
    if (!parsed.success) {
        return { success: false, message: parsed.error.errors.map(e => e.message).join(', ') };
    }

    const { cardId, ...data } = parsed.data;

    let imageUrl = (formData.get("currentImageUrl") as string) || '';
    let avatarUrl = (formData.get("currentAvatarUrl") as string) || '';

    const imageFile = formData.get("imageUrl") as File;
    const avatarFile = formData.get("avatarUrl") as File;

    try {
        if (imageFile && imageFile.size > 0) {
            const result: any = await uploadImage(imageFile);
            imageUrl = result.secure_url;
        }

        if (avatarFile && avatarFile.size > 0) {
            const result: any = await uploadImage(avatarFile);
            avatarUrl = result.secure_url;
        }
        
        const cardData = { 
            ...data, 
            ...(imageUrl && { imageUrl }),
            ...(avatarUrl && { avatarUrl }),
        };
        
        const db = getDb();
        if (cardId) {
            await db.collection("heroCards").doc(cardId).set(cardData, { merge: true });
        } else {
             if (!imageUrl || !avatarUrl) {
                return { success: false, message: "Main image and avatar image are required for new cards." };
            }
            await db.collection("heroCards").add({ ...cardData, createdAt: FieldValue.serverTimestamp() });
        }

        revalidatePath('/');
        revalidatePath('/admin/hero/cards-carousel');
        
        return { success: true, message: "Card saved successfully!" };

    } catch (error) {
        console.error("Error upserting hero card:", error);
        const message = error instanceof Error ? error.message : "An unexpected error occurred.";
        return { success: false, message };
    }
}

export async function deleteHeroCard(prevState: any, formData: FormData) {
    const cardId = formData.get("cardId") as string;
    if (!cardId) {
        return { success: false, message: "Card ID is missing." };
    }

    try {
        const db = getDb();
        await db.collection("heroCards").doc(cardId).delete();
        revalidatePath('/');
        revalidatePath('/admin/hero/cards-carousel');
        return { success: true, message: "Card deleted successfully." };
    } catch (error) {
        console.error("Error deleting hero card:", error);
        return { success: false, message: "Failed to delete card." };
    }
}
