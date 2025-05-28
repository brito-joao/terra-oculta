import { serialize } from "cookie";

export async function POST() {
    // Invalidate the cookie by setting it with a past expiry
    console.log("hello woekflkj")
    const expiredCookie = serialize("authToken", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        expires: new Date(0), // Set the expiration in the past
    });

    return new Response(JSON.stringify({ message: "Logged out successfully" }), {
        status: 200,
        headers: {
            "Set-Cookie": expiredCookie,
        },
    });
}
