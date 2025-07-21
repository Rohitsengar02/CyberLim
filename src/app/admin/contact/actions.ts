
"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/firebase-admin";

export async function deleteContactSubmission(prevState: any, formData: FormData) {
    const submissionId = formData.get("submissionId") as string;
    if (!submissionId) {
        return { success: false, message: "Submission ID is missing." };
    }

    try {
        const db = getDb();
        await db.collection("contactSubmissions").doc(submissionId).delete();
        revalidatePath('/admin/contact');
        return { success: true, message: "Submission deleted successfully." };
    } catch (error) {
        console.error("Error deleting submission:", error);
        return { success: false, message: "Failed to delete submission." };
    }
}
