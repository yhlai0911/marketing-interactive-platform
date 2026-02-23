import { NextRequest, NextResponse } from "next/server";

// 簡易記憶體存儲（MVP 階段）
const progressStore = new Map<string, Record<number, unknown>>();

export async function GET(request: NextRequest) {
  const userId = request.headers.get("x-user-id") || "default";
  const data = progressStore.get(userId) || {};
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const userId = request.headers.get("x-user-id") || "default";
  const body = await request.json();

  const current = progressStore.get(userId) || {};
  if (body.week) {
    current[body.week as number] = body;
  }
  progressStore.set(userId, current);

  return NextResponse.json({ success: true });
}
