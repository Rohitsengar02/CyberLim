
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/firebase-admin";

const schema = z.object({
  heading: z.string().min(1, "Heading is required"),
  paragraph: z.string().min(1, "Paragraph is required"),
  headingFontSizeDesktop: z.coerce.number().min(10).max(200),
  headingFontSizeMobile: z.coerce.number().min(10).max(100),
  paragraphFontSizeDesktop: z.coerce.number().min(8).max(50),
  paragraphFontSizeMobile: z.coerce.number().min(8).max(40),
  glassWidthDesktop: z.string().min(1, "Required"),
  glassHeightDesktop: z.string().min(1, "Required"),
  glassWidthMobile: z.string().min(1, "Required"),
  glassHeightMobile: z.string().min(1, "Required"),
});

export async function updateHeroContentConfig(prevState: any, formData: FormData) {
  try {
    const parsed = schema.safeParse({
      heading: formData.get("heading"),
      paragraph: formData.get("paragraph"),
      headingFontSizeDesktop: formData.get("headingFontSizeDesktop"),
      headingFontSizeMobile: formData.get("headingFontSizeMobile"),
      paragraphFontSizeDesktop: formData.get("paragraphFontSizeDesktop"),
      paragraphFontSizeMobile: formData.get("paragraphFontSizeMobile"),
      glassWidthDesktop: formData.get("glassWidthDesktop"),
      glassHeightDesktop: formData.get("glassHeightDesktop"),
      glassWidthMobile: formData.get("glassWidthMobile"),
      glassHeightMobile: formData.get("glassHeightMobile"),
    });

    if (!parsed.success) {
      return { success: false, message: parsed.error.errors.map(e => e.message).join(', ') };
    }

    const db = getDb();
    const docRef = db.collection("heroContent").doc("main");
    await docRef.set(parsed.data, { merge: true });

    revalidatePath("/");
    revalidatePath("/admin/hero/content");

    return { success: true, message: "Hero content updated successfully!" };
  } catch (error) {
    console.error("Error updating hero content config:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    return { success: false, message };
  }
}
