
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/firebase-admin";

const layoutSchema = z.object({
  layout: z.enum(['bento', 'grid', 'carousel']),
});

export async function updateServicesLayoutConfig(prevState: any, formData: FormData) {
  try {
    const parsed = layoutSchema.safeParse({
      layout: formData.get("layout"),
    });

    if (!parsed.success) {
      return { success: false, message: parsed.error.errors.map(e => e.message).join(', ') };
    }

    const db = getDb();
    const docRef = db.collection("servicesLayout").doc("main");
    await docRef.set(parsed.data, { merge: true });

    revalidatePath("/");
    revalidatePath("/admin/services/layout");

    return { success: true, message: "Services layout updated successfully!" };
  } catch (error) {
    console.error("Error updating services layout config:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    return { success: false, message };
  }
}
