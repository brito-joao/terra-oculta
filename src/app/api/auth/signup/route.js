import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET = "your_secret_key"; // Use env variable in production

export async function POST(req) {
  try {
    const { name, email, password, role, creatorToken } = await req.json();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "User already exists" }), { status: 400 });
    }

    // If admin creation requested, verify token
    let finalRole = Role.FREE;
    if (role === "ADMIN") {
      if (!creatorToken) {
        return new Response(JSON.stringify({ error: "Missing creator token" }), { status: 403 });
      }

      try {
        const decoded = jwt.verify(creatorToken, SECRET);
        if (decoded.role !== "ADMIN") {
          return new Response(JSON.stringify({ error: "Not authorized to create admins" }), { status: 403 });
        }

        finalRole = Role.ADMIN;
      } catch (err) {
        return new Response(JSON.stringify({ error: "Invalid creator token" }), { status: 403 });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        role: finalRole,
        profilePic: "/defaultUser.png",
      },
    });

    return new Response(JSON.stringify({ message: "User created", user }), { status: 201 });
  } catch (error) {
    console.error("Signup error:", error);
    return new Response(JSON.stringify({ error: "Signup failed" }), { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
