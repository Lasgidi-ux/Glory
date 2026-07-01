import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { addMedia } from "@/lib/data";

// Persist metadata for a file the browser just uploaded to Cloudinary.
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { publicId?: string; url?: string; resourceType?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!body.publicId || !body.url) {
    return NextResponse.json({ error: "Missing file data." }, { status: 422 });
  }

  const resourceType = body.resourceType === "video" ? "video" : "image";
  const res = await addMedia(userId, {
    publicId: body.publicId,
    url: body.url,
    resourceType,
  });

  if (!res.ok) {
    return NextResponse.json({ error: res.error }, { status: 503 });
  }
  return NextResponse.json({ ok: true });
}
