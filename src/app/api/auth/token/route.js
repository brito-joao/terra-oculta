import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) return new Response(JSON.stringify({ error: "No token found" }), { status: 401 });

  try {
    verify(token, "your_secret_key");
    return new Response(JSON.stringify({ token }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ error: "Invalid token" }), { status: 403 });
  }
}
