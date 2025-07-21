"use server";
import { getIronSession, type IronSession } from "iron-session";
import { cookies } from "next/headers";
import type { SessionPayload } from "@/types/session";

const sessionOptions = {
    password: process.env.SESSION_SECRET as string,
    cookieName: "cyberlim-session",
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    },
};

export async function getSession(): Promise<IronSession<SessionPayload>> {
    const session = await getIronSession<SessionPayload>(cookies(), sessionOptions);

    if (!session.isAuthed) {
        session.isAuthed = false;
        session.userId = "";
    }

    return session;
}
