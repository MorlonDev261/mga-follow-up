import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.formData();
  const file = data.get("file") as File;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  interface CloudinaryResponse {
    secure_url: string;
    public_id: string;
  }

  const uploadRes = await new Promise<CloudinaryResponse>((resolve, reject) => {
    cloudinary.uploader.upload_stream({ folder: "avatars" }, (error, result) => {
      if (error || !result) {
        return reject(error || new Error("Upload failed with no result"));
      }

      resolve({
        secure_url: result.secure_url,
        public_id: result.public_id,
      });
    }).end(buffer);
  });

  return NextResponse.json({
    url: uploadRes.secure_url,
    public_id: uploadRes.public_id,
  });
}
