import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const { name, imageUrl, description } = await req.json();

    const updatedPlace = await prisma.place.update({
      where: { id: Number(id) },
      data: {
        ...(name && { name }),
        ...(imageUrl && { imageUrl }),
        ...(description && { description }),
      },
    });

    return new Response(JSON.stringify(updatedPlace), { status: 200 });
  } catch (error) {
    console.error("Error updating place by ID:", error);
    return new Response(JSON.stringify({ error: "Failed to update place" }), { status: 500 });
  }
}
