
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import cloudinary from "@/lib/cloudinary";
import { getDb } from "@/lib/firebase-admin";

const schema = z.object({
  heading: z.string().min(1, "Heading is required"),
  description: z.string().min(1, "Description is required"),
  missionStatement: z.string().min(1, "Mission statement is required"),
  coreValues: z.array(z.string()).min(1, "At least one core value is required"),
  whyChooseUs: z.array(z.string()).min(1, "At least one reason is required"),
  ctaHeading: z.string().min(1, "CTA Heading is required"),
});

export async function updateAboutUsConfig(prevState: any, formData: FormData) {
  let imageUrl = formData.get("currentImageUrl") as string;
  const imageFile = formData.get("imageUrl") as File;

  try {
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result: any = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        uploadStream.end(buffer);
      });
      
      if (result?.secure_url) {
        imageUrl = result.secure_url;
      }
    }

    const coreValues = (formData.get("coreValues") as string).split('\n').map(s => s.trim()).filter(Boolean);
    const whyChooseUs = (formData.get("whyChooseUs") as string).split('\n').map(s => s.trim()).filter(Boolean);
    
    const parsed = schema.safeParse({
      heading: formData.get("heading"),
      description: formData.get("description"),
      missionStatement: formData.get("missionStatement"),
      coreValues: coreValues,
      whyChooseUs: whyChooseUs,
      ctaHeading: formData.get("ctaHeading"),
    });

    if (!parsed.success) {
      console.log(parsed.error);
      return { success: false, message: parsed.error.errors.map(e => e.message).join(', ') };
    }
    
    const configData = { ...parsed.data, imageUrl };

    const db = getDb();
    const docRef = db.collection("siteConfig").doc("aboutUs");
    await docRef.set(configData, { merge: true });

    revalidatePath("/");
    revalidatePath("/admin/about");

    return { success: true, message: "About Us section updated successfully!" };
  } catch (error) {
    console.error("Error updating About Us config:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    return { success: false, message };
  }
}
