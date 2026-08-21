import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, apiSuccess } from "@/lib/api-helper";
import { musicTrackSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  return withAuth(req, async (req, { userId }) => {
    const { searchParams } = new URL(req.url);
    const weddingId = searchParams.get("weddingId");
    const tracks = await prisma.musicTrack.findMany({
      where: weddingId ? { weddingId } : { wedding: { userId } },
      orderBy: { createdAt: "desc" },
    });
    return apiSuccess(tracks);
  });
}

export async function POST(req: NextRequest) {
  return withAuth(req, async (req) => {
    const body = await req.json();
    const parsed = musicTrackSchema.parse(body);
    const track = await prisma.musicTrack.create({ data: parsed });
    return apiSuccess(track, 201);
  });
}