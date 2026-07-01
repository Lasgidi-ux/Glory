import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getCloudinary } from "@/lib/cloudinary";

// Returns signed params so the browser can upload directly to Cloudinary
// without exposing the API secret.
export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cld = getCloudinary();
  if (!cld) {
    return NextResponse.json(
      { error: "Cloudinary is not configured on the server." },
      { status: 503 }
    );
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = `glory/${userId}`;
  const signature = cld.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET as string
  );

  return NextResponse.json({
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    timestamp,
    folder,
    signature,
  });
}
