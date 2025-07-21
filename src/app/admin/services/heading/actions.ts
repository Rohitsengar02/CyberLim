
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/firebase-admin";

const schema = z.object({
  heading: z.string().min(1, "Heading is required"),
  paragraph: z.string().min(1, "Paragraph is required"),
  paddingTopDesktop: z.coerce.number().min(0).max(500),
  paddingTopMobile: z.coerce.number().min(0).max(300),
});

export async function updateServicesHeadingConfig(prevState: any, formData: FormData) {
  try {
    const parsed = schema.safeParse({
      heading: formData.get("heading"),
      paragraph: formData.get("paragraph"),
      paddingTopDesktop: formData.get("paddingTopDesktop"),
      paddingTopMobile: formData.get("paddingTopMobile"),
    });

    if (!parsed.success) {
      return { success: false, message: parsed.error.errors.map(e => e.message).join(', ') };
    }

    const db = getDb();
    const docRef = db.collection("servicesContent").doc("main");
    await docRef.set(parsed.data, { merge: true });

    revalidatePath("/");
    revalidatePath("/admin/services/heading");

    return { success: true, message: "Services content updated successfully!" };
  } catch (error) {
    console.error("Error updating services content config:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    return { success: false, message };
  }
}
