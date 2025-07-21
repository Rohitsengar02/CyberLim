
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import cloudinary from "@/lib/cloudinary";
import { getDb } from "@/lib/firebase-admin";
import type { NavbarConfig } from "@/types/navbar";

const menuItemSchema = z.object({
  label: z.string().min(1, "Label is required"),
  href: z.string().min(1, "URL is required"),
});

const schema = z.object({
  logoText: z.string().optional(),
  leftMenuItems: z.array(menuItemSchema),
  rightMenuItems: z.array(menuItemSchema),
  logoHoverText: z.array(z.string()).optional(),
});

export async function updateNavbarConfig(prevState: any, formData: FormData) {
  let logoImageUrl: string | null | undefined = formData.get("currentLogoImageUrl") as string | null;
  const logoImageFile = formData.get("logoImage") as File;
  const deleteLogoImage = formData.get("deleteLogoImage") === 'true';

  if (logoImageUrl === '') {
    logoImageUrl = null;
  }

  if (deleteLogoImage) {
    logoImageUrl = null;
  } else if (logoImageFile && logoImageFile.size > 0) {
    try {
      const bytes = await logoImageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result: any = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result);
          }
        );
        uploadStream.end(buffer);
      });

      logoImageUrl = result.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      return { success: false, message: "Error uploading image." };
    }
  }

  const leftMenuItemsJSON = formData.get("leftMenuItemsJSON") as string;
  const rightMenuItemsJSON = formData.get("rightMenuItemsJSON") as string;
  const logoHoverTextJSON = formData.get("logoHoverTextJSON") as string;
  
  let leftMenuItems, rightMenuItems, logoHoverText;
  try {
    leftMenuItems = JSON.parse(leftMenuItemsJSON || '[]');
    rightMenuItems = JSON.parse(rightMenuItemsJSON || '[]');
    logoHoverText = JSON.parse(logoHoverTextJSON || '[]');
  } catch(e) {
    return { success: false, message: "Could not parse menu items. Invalid JSON." };
  }

  const logoText = formData.get("logoText") as string;

  const parsed = schema.safeParse({
    logoText,
    leftMenuItems,
    rightMenuItems,
    logoHoverText
  });

  if (!parsed.success) {
    console.error("Zod validation error:", parsed.error.flatten());
    return { success: false, message: "Invalid form data. Please check all fields." };
  }

  const navbarData: Partial<NavbarConfig> = {
    logoText: parsed.data.logoText,
    logoImageUrl: logoImageUrl,
    leftMenuItems: parsed.data.leftMenuItems,
    rightMenuItems: parsed.data.rightMenuItems,
    logoHoverText: parsed.data.logoHoverText
  };

  try {
    const db = getDb();
    const docRef = db.collection("navbar").doc("main");
    await docRef.set(navbarData, { merge: true });
    revalidatePath("/");
    revalidatePath("/admin/hero/navbar");
    return { success: true, message: "Navbar updated successfully!" };
  } catch (error) {
    console.error("Firestore error:", error);
    return { success: false, message: "Error saving to database." };
  }
}
