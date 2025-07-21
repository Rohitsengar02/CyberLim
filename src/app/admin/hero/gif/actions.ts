
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import cloudinary from "@/lib/cloudinary";
import { getDb } from "@/lib/firebase-admin";

const schema = z.object({
  gifUrl: z.string().url("Must be a valid URL.").or(z.literal('')),
  desktopScale: z.coerce.number().min(0.1).max(5),
  mobileScale: z.coerce.number().min(0.1).max(5),
});

export async function updateHeroAnimationConfig(prevState: any, formData: FormData) {
  let finalGifUrl = formData.get("currentGifUrl") as string;
  const gifFile = formData.get("gifFile") as File;

  try {
    if (gifFile && gifFile.size > 0) {
      const bytes = await gifFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result: any = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "auto", upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        uploadStream.end(buffer);
      });
      
      if (!result?.secure_url) {
          throw new Error("Cloudinary upload failed: No secure URL returned.");
      }
      finalGifUrl = result.secure_url;
    } else {
      finalGifUrl = formData.get("gifUrl") as string;
    }

    const parsed = schema.safeParse({
      gifUrl: finalGifUrl,
      desktopScale: formData.get("desktopScale"),
      mobileScale: formData.get("mobileScale"),
    });

    if (!parsed.success) {
      return { success: false, message: parsed.error.errors.map(e => e.message).join(', ') };
    }
    
    const configData = {
      gifUrl: parsed.data.gifUrl,
      desktopScale: parsed.data.desktopScale,
      mobileScale: parsed.data.mobileScale,
    };

    const db = getDb();
    const docRef = db.collection("siteConfig").doc("heroAnimation");
    await docRef.set(configData, { merge: true });

    revalidatePath("/");
    revalidatePath("/admin/hero/gif");

    return { success: true, message: "Hero animation updated successfully!" };
  } catch (error) {
    console.error("Error updating hero animation config:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    return { success: false, message };
  }
}
