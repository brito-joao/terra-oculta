import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET = "your_secret_key"; // Keep this the same as in login API

export function middleware(req) {
    const token = req.cookies.get("authToken")?.value;

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        jwt.verify(token, SECRET);
        return NextResponse.next();
    } catch (error) {
        return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }
}

// Protect API routes
export const config = {
    matcher: ["/api/protected/:path*"], // Only applies to these routes
};
