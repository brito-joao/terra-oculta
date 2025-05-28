import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

const prisma = new PrismaClient();
const SECRET = "your_secret_key"; // Change this in production

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        // Check if user exists
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return Response.json({ error: "User not found" }, { status: 404 });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return Response.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            SECRET,
            { expiresIn: "7d" }
          );
          

        // Set HTTP-only cookie (for security)
        const cookie = serialize("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
        });

        return new Response(JSON.stringify({ message: "Login successful" }), {
            status: 200,
            headers: { "Set-Cookie": cookie },
        });
    } catch (error) {
        return Response.json({ error: "Login failed" }, { status: 500 });
    }
}
