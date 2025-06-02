import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const places = await prisma.place.findMany({
      include: {
        likes: true,
        comments: {
          include: { user: true }
        }
      },
      orderBy: { id: "asc" }
    });
    return new Response(JSON.stringify(places), { status: 200 });
  } catch (error) {
    console.error("Error fetching places:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch places" }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { name, latitude, longitude, imageUrl, description } = await req.json();
    if (!name || !latitude || !longitude || !imageUrl || !description) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
    }

    const newPlace = await prisma.place.create({
      data: { name, latitude, longitude, imageUrl, description }
    });

    return new Response(JSON.stringify(newPlace), { status: 201 });
  } catch (error) {
    console.error("Error creating place:", error);
    return new Response(JSON.stringify({ error: "Failed to create place" }), { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { placeId, userId, type, content, name, latitude, longitude, imageUrl, description } = body;

    if (!placeId || !type) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    // LIKE
    if (type === "like") {
      if (!userId) return new Response(JSON.stringify({ error: "Missing userId" }), { status: 400 });

      const existingLike = await prisma.like.findFirst({ where: { placeId, userId } });
      if (existingLike) {
        return new Response(JSON.stringify({ error: "User already liked this place" }), { status: 400 });
      }

      await prisma.like.create({
        data: {
          place: { connect: { id: placeId } },
          user: { connect: { id: userId } }
        }
      });

      const updatedLikes = await prisma.like.count({ where: { placeId } });

      return new Response(JSON.stringify({ likes: updatedLikes }), { status: 201 });
    }

    // COMMENT
    if (type === "comment") {
      if (!userId || !content) {
        return new Response(JSON.stringify({ error: "Missing userId or content" }), { status: 400 });
      }

      const comment = await prisma.comment.create({
        data: {
          place: { connect: { id: placeId } },
          user: { connect: { id: userId } },
          content
        },
        include: { user: true }
      });

      return new Response(JSON.stringify(comment), { status: 201 });
    }

    // UPDATE PLACE
    if (type === "update") {
      const updatedPlace = await prisma.place.update({
        where: { id: placeId },
        data: {
          ...(name && { name }),
          ...(latitude && { latitude }),
          ...(longitude && { longitude }),
          ...(imageUrl && { imageUrl }),
          ...(description && { description })
        }
      });

      return new Response(JSON.stringify(updatedPlace), { status: 200 });
    }

    return new Response(JSON.stringify({ error: "Invalid request type" }), { status: 400 });
  } catch (error) {
    console.error("Error updating place:", error);
    return new Response(JSON.stringify({ error: "Failed to update place" }), { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { placeId, commentId } = await req.json();

    if (commentId) {
      await prisma.comment.delete({ where: { id: commentId } });
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    if (placeId) {
      await prisma.place.delete({ where: { id: placeId } });
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    return new Response(JSON.stringify({ error: "Missing required field" }), { status: 400 });
  } catch (error) {
    console.error("Error deleting resource:", error);
    return new Response(JSON.stringify({ error: "Failed to delete" }), { status: 500 });
  }
}
