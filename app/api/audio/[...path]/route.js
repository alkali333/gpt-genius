import { NextResponse } from "next/server";
import { createReadStream } from "fs";
import { join } from "path";
import { stat } from "fs/promises";

export async function GET(request) {
  const path = request.nextUrl.pathname.split("/").slice(3);
  console.log("Requested path:", path);

  const filePath = join(process.cwd(), "public", "user-audio", ...path);
  console.log("Full file path:", filePath);

  try {
    await stat(filePath);
    console.log("File exists, attempting to serve");

    const stream = createReadStream(filePath);

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": `inline; filename="${path[path.length - 1]}"`,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "File not found", details: error.message },
      { status: 404 }
    );
  }
}
