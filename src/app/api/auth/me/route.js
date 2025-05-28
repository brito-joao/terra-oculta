import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { parse } from "cookie";

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || "your_secret_key";  // Ensure you use the correct secret for your JWT

export async function GET(req) {
    try {
        // 1. Get the token from cookies
        const cookies = parse(req.headers.get("cookie") || "");
        const token = cookies.authToken; // Ensure the token is stored as 'authToken'

        console.log("Cookies received:", cookies); // Log cookies to check if the authToken is present

        if (!token) {
            // If the token is missing, return 401 Unauthorized
            console.error("Token not found in cookies");
            return new Response(
                JSON.stringify({ error: "Not authenticated" }),
                { status: 401 }
            );
        }

        // 2. Verify the token
        let decoded;
        try {
            decoded = jwt.verify(token, SECRET);  // Verify the JWT token with the secret
            console.log("Token decoded:", decoded); // Log decoded token to check if the verification works
        } catch (err) {
            console.error("Token verification failed:", err); // Log token verification failure
            return new Response(
                JSON.stringify({ error: "Invalid token" }),
                { status: 401 }
            );
        }

        // 3. Retrieve the user from Prisma
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, name: true, email: true, role:true }
        });

        console.log("Retrieved user:", user); // Log user data retrieved from Prisma

        if (user) {
            // If the user exists, return the user data
            return new Response(
                JSON.stringify({ user }),
                { status: 200 }
            );
        } else {
            // If no user is found, return a 404
            console.error("User not found for ID:", decoded.id); // Log when no user is found for the decoded token ID
            return new Response(
                JSON.stringify({ error: "User not found" }),
                { status: 404 }
            );
        }
    } catch (error) {
        console.error("Unexpected error:", error); // Log any unexpected errors

        // Handle errors and return unauthorized response
        return new Response(
            JSON.stringify({ error: "Invalid token" }),
            { status: 401 }
        );
    }
}
