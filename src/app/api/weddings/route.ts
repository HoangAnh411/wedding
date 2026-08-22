import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, apiSuccess } from "@/lib/api-helper";
import { weddingSchema } from "@/lib/validations";
import { generateSlug } from "@/lib/utils";
import bcrypt from "bcryptjs";
import { sendAccountEmail } from "@/lib/email";

export async function GET(req: NextRequest) {
  return withAuth(req, async (req, { userId, role }) => {
    let whereClause = {};
    if (role === "SUPERADMIN") {
      whereClause = {};
    } else if (role === "STAFF") {
      whereClause = { assignments: { some: { staffId: userId } } };
    } else {
      whereClause = { clientId: userId };
    }

    const weddings = await prisma.wedding.findMany({
      where: whereClause,
      include: { _count: { select: { guests: true, checklistItems: true } } },
      orderBy: { createdAt: "desc" },
    });
    return apiSuccess(weddings);
  });
}

export async function POST(req: NextRequest) {
  return withAuth(req, async (req, { userId }) => {
    const body = await req.json();
    const parsed = weddingSchema.parse(body);
    const { clientEmail, ...weddingData } = parsed;
    const slug = weddingData.slug || generateSlug(`${weddingData.groomName}-${weddingData.brideName}`);

    let clientId = undefined;

    if (clientEmail) {
      const existingUser = await prisma.user.findUnique({
        where: { email: clientEmail }
      });

      if (existingUser) {
        clientId = existingUser.id;
      } else {
        const rawPassword = Math.random().toString(36).slice(-6);
        const passwordHash = await bcrypt.hash(rawPassword, 10);
        const name = `${weddingData.groomName} & ${weddingData.brideName}`;

        const newUser = await prisma.user.create({
          data: {
            email: clientEmail,
            passwordHash,
            name,
            role: "CLIENT"
          }
        });
        clientId = newUser.id;

        // Send email asynchronously
        sendAccountEmail(clientEmail, rawPassword, name).catch(console.error);
      }
    }

    const wedding = await prisma.wedding.create({
      data: { ...weddingData, slug, userId, clientId },
    });
    
    return apiSuccess(wedding, 201);
  });
}