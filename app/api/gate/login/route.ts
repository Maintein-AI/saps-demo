import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "saps_gate";

export async function POST(req: NextRequest) {
  let body: { username?: string; password?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const expectedUser = process.env.GATE_USERNAME || "admin";
  const expectedPass = process.env.GATE_PASSWORD || "saps2026";
  const secret = process.env.GATE_SECRET || "saps-gate-default-secret-change-me";

  const username = (body.username || "").trim();
  const password = body.password || "";

  if (username === expectedUser && password === expectedPass) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE_NAME, secret, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 12, // 12 hours
    });
    return res;
  }

  return NextResponse.json({ ok: false, error: "Invalid username or password." }, { status: 401 });
}
