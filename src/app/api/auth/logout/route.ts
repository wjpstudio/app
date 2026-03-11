import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_URL || "https://wjp.studio"));

  response.cookies.set("dashboard_auth", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  response.cookies.set("dashboard_user", "", {
    httpOnly: false,
    secure: true,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
