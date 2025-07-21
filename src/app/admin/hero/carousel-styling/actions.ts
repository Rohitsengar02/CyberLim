
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/firebase-admin";

const schema = z.object({
  cardWidthDesktop: z.coerce.number().min(100).max(500),
  cardHeightDesktop: z.coerce.number().min(100).max(700),
  cardWidthMobile: z.coerce.number().min(50).max(300),
  cardHeightMobile: z.coerce.number().min(80).max(500),
});

export async function updateHeroCarouselConfig(prevState: any, formData: FormData) {
  try {
    const parsed = schema.safeParse({
      cardWidthDesktop: formData.get("cardWidthDesktop"),
      cardHeightDesktop: formData.get("cardHeightDesktop"),
      cardWidthMobile: formData.get("cardWidthMobile"),
      cardHeightMobile: formData.get("cardHeightMobile"),
    });

    if (!parsed.success) {
      return { success: false, message: parsed.error.errors.map(e => e.message).join(', ') };
    }

    const db = getDb();
    const docRef = db.collection("siteConfig").doc("heroCarousel");
    await docRef.set(parsed.data, { merge: true });

    revalidatePath("/");
    revalidatePath("/admin/hero/carousel-styling");

    return { success: true, message: "Carousel styling updated successfully!" };
  } catch (error) {
    console.error("Error updating carousel config:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    return { success: false, message };
  }
}
