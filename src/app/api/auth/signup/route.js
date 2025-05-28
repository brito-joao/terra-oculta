import { PrismaClient,Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const { name, email, password } = await req.json();

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return new Response(JSON.stringify({ error: "User already exists" }), { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user in database
        const user = await prisma.user.create({
            data: { name, email, passwordHash: hashedPassword, profilePic:"/defaultUser.png",role:Role.FREE },
        });

        return new Response(JSON.stringify({ message: "User created", user }), { status: 201 });
    } catch (error) {
        console.error("Signup error:", error);
        return new Response(JSON.stringify({ error: "Signup failed" }), { status: 500 });
    }
}
