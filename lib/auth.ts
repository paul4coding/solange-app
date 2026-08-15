import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-please-change-in-production-32chars"
);
const COOKIE = "admin_session";

/**
 * Un cookie marqué `Secure` n'est accepté par le navigateur qu'en HTTPS
 * (localhost mis à part). Déployé sur http://mon-serveur:3000, la connexion
 * admin semblerait réussir puis retomberait sur le formulaire au premier
 * rechargement — la session n'étant jamais enregistrée.
 *
 * Par défaut on reste en HTTPS. COOKIE_SECURE=false permet un déploiement
 * temporaire en HTTP simple : le jeton de session circule alors en clair,
 * à ne faire que sur un réseau de confiance, le temps d'installer un certificat.
 */
function cookieSecure() {
  const flag = process.env.COOKIE_SECURE?.trim().toLowerCase();
  if (flag === "false" || flag === "0") return false;
  if (flag === "true"  || flag === "1") return true;
  return process.env.NODE_ENV === "production";
}

export async function createSession(username: string) {
  const token = await new SignJWT({ username })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .setIssuedAt()
    .sign(SECRET);

  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: cookieSecure(),
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });
}

export async function getSession(): Promise<{ username: string } | null> {
  try {
    const jar = await cookies();
    const token = jar.get(COOKIE)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, SECRET);
    return { username: payload.username as string };
  } catch {
    return null;
  }
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

/**
 * Guard for route handlers. The middleware only covers /admin/*, so API routes
 * must check the session themselves.
 * Returns a 401 response when unauthenticated, or null when the caller may proceed.
 */
export async function requireApiAuth(): Promise<NextResponse | null> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  return null;
}
