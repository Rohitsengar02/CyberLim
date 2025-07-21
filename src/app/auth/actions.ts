"use server";

import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export async function login(prevState: any, data: FormData): Promise<{ error: string | null }> {
    const email = data.get("email");
    const password = data.get("password");

    if (
        email === process.env.ADMIN_EMAIL &&
        password === process.env.ADMIN_PASSWORD
    ) {
        const session = await getSession();
        session.isAuthed = true;
        session.userId = "admin";
        await session.save();
        redirect("/admin");
    }

    return { error: "Invalid email or password" };
}

export async function logout() {
    const session = await getSession();
    session.destroy();
    redirect("/auth/signin");
}
