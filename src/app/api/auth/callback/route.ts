import { NextRequest, NextResponse } from "next/server";

const ALLOWED_IDS = (process.env.DISCORD_ALLOWED_IDS || "").split(",").map((s) => s.trim()).filter(Boolean);

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const storedState = req.cookies.get("oauth_state")?.value;

  if (!code || !state || state !== storedState) {
    return NextResponse.redirect(new URL("/?error=invalid_state", req.url));
  }

  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXT_PUBLIC_URL || "https://wjp.studio"}/api/auth/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/?error=not_configured", req.url));
  }

  // Exchange code for token
  const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!tokenRes.ok) {
    return NextResponse.redirect(new URL("/?error=token_failed", req.url));
  }

  const { access_token } = await tokenRes.json();

  // Get user info
  const userRes = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  if (!userRes.ok) {
    return NextResponse.redirect(new URL("/?error=user_failed", req.url));
  }

  const user = await userRes.json();

  // Check allowlist
  if (ALLOWED_IDS.length > 0 && !ALLOWED_IDS.includes(user.id)) {
    return NextResponse.redirect(new URL("/?error=not_authorized", req.url));
  }

  // Set auth cookie
  const response = NextResponse.redirect(new URL("/dashboard", req.url));

  response.cookies.set("dashboard_auth", "1", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  response.cookies.set("dashboard_user", JSON.stringify({
    id: user.id,
    username: user.username,
    avatar: user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
      : null,
  }), {
    httpOnly: false,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  // Clear state cookie
  response.cookies.delete("oauth_state");

  return response;
}
