import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export type ApiHandler = (req: Request, context: { userId: string }) => Promise<NextResponse>;

export async function withAuth(
  req: Request,
  handler: ApiHandler,
): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return handler(req, { userId: session.user.id });
}

export function apiError(error: unknown, status = 500): NextResponse {
  const message = error instanceof Error ? error.message : "Internal server error";
  console.error("[API Error]", message);
  return NextResponse.json({ error: message }, { status });
}

export function apiSuccess<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ data }, { status });
}