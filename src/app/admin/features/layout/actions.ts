
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/firebase-admin";

const schema = z.object({
  layoutMode: z.enum(['scroll', 'grid']),
  cardWidthDesktop: z.coerce.number().min(200).max(500),
  cardHeightDesktop: z.coerce.number().min(200).max(500),
  cardWidthMobile: z.coerce.number().min(150).max(400),
  cardHeightMobile: z.coerce.number().min(150).max(500),
  backdropBlur: z.coerce.number().min(0).max(50),
});

export async function updateFeaturesLayoutConfig(prevState: any, formData: FormData) {
  try {
    const parsed = schema.safeParse({
      layoutMode: formData.get("layoutMode"),
      cardWidthDesktop: formData.get("cardWidthDesktop"),
      cardHeightDesktop: formData.get("cardHeightDesktop"),
      cardWidthMobile: formData.get("cardWidthMobile"),
      cardHeightMobile: formData.get("cardHeightMobile"),
      backdropBlur: formData.get("backdropBlur"),
    });

    if (!parsed.success) {
      return { success: false, message: parsed.error.errors.map(e => e.message).join(', ') };
    }

    const db = getDb();
    const docRef = db.collection("featuresContent").doc("layout");
    await docRef.set(parsed.data, { merge: true });

    revalidatePath("/");
    revalidatePath("/admin/features/layout");

    return { success: true, message: "Features layout updated successfully!" };
  } catch (error) {
    console.error("Error updating features layout config:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    return { success: false, message };
  }
}
