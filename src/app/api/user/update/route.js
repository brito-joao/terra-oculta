import { PrismaClient } from "@prisma/client";
import { parse } from "cookie";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || "your_secret_key";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email } = body;

    const cookies = parse(req.headers.get("cookie") || "");
    const token = cookies.authToken;

    if (!token) return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });

    const decoded = jwt.verify(token, SECRET);
    const userId = decoded.id;

    // Check if another user already uses the email
    const existing = await prisma.user.findFirst({
      where: {
        email,
        NOT: { id: userId }
      }
    });

    if (existing) {
      return new Response(JSON.stringify({ error: "Este email já está em uso por outro usuário." }), { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, email },
    });

    return new Response(JSON.stringify(updatedUser), { status: 200 });

  } catch (err) {
    console.error("Erro ao atualizar:", err);
    return new Response(JSON.stringify({ error: "Erro ao atualizar usuário" }), { status: 500 });
  }
}
