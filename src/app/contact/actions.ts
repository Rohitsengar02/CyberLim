
"use server";

import { z } from "zod";
import { FieldValue } from 'firebase-admin/firestore';
import { getDb } from "@/lib/firebase-admin";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  message: z.string().min(1, "Message is required"),
});

export async function submitContactForm(prevState: any, formData: FormData) {
  try {
    const parsed = schema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      message: formData.get("message"),
    });

    if (!parsed.success) {
      return { success: false, message: parsed.error.errors.map(e => e.message).join(', ') };
    }

    const submissionData = {
        ...parsed.data,
        createdAt: FieldValue.serverTimestamp(),
    };
    
    const db = getDb();
    await db.collection("contactSubmissions").add(submissionData);

    return { success: true, message: "Thank you! Your message has been sent, and we'll be in touch soon." };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred.";
    return { success: false, message };
  }
}
