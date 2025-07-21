import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "@/lib/session";

export async function middleware(request: NextRequest) {
    const session = await getSession();

    if (request.nextUrl.pathname.startsWith("/admin")) {
        if (!session.isAuthed) {
            return NextResponse.redirect(new URL("/auth/signin", request.url));
        }
    }

    if (request.nextUrl.pathname.startsWith("/auth/signin")) {
        if (session.isAuthed) {
            return NextResponse.redirect(new URL("/admin", request.url));
        }
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/auth/signin"],
};
