import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export type ApiHandler = (req: Request, context: { userId: string }) => Promise<NextResponse>;

export async function withAuth(
  req: Request,
  handler: ApiHandler,
): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    return await handler(req, { userId: session.user.id });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
    logger.error('API error in withAuth', { error: error instanceof Error ? error.stack || error.message : String(error) });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function verifyWeddingOwnership(weddingId: string, userId: string): Promise<boolean> {
  const wedding = await prisma.wedding.findFirst({
    where: { id: weddingId, userId },
    select: { id: true },
  });
  return !!wedding;
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || 'unknown';
}

export function apiError(error: unknown, status = 500): NextResponse {
  const message = error instanceof Error ? error.message : "Internal server error";
  logger.error("[API Error]", { message });
  return NextResponse.json({ error: message }, { status });
}

export function apiSuccess<T>(data: T, status = 200, meta?: any): NextResponse {
  if (meta) {
    return NextResponse.json({ data, meta }, { status });
  }
  return NextResponse.json({ data }, { status });
}