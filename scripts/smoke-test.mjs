#!/usr/bin/env node
/**
 * Suite de tests fonctionnels — Solange's Hair Braiding
 *
 *   node scripts/smoke-test.mjs [baseUrl]
 *
 * Vérifie : pages publiques, protection de l'admin, authentification des routes API,
 * intégrité de la base, écriture/lecture des réservations et des messages.
 *
 * N'ENVOIE AUCUN EMAIL : les formulaires publics passent par des server actions qui
 * déclenchent Resend. La suite teste les routes API et la base directement, afin de ne
 * jamais expédier de courrier réel pendant un test.
 *
 * Les données créées sont préfixées ZZTEST et supprimées en fin d'exécution.
 */
import mysql from "mysql2/promise";
import { SignJWT } from "jose";
import { config } from "dotenv";

config({ path: ".env.local" });

const BASE = process.argv[2] || "http://localhost:3000";

let pass = 0, fail = 0;
const failures = [];

function check(name, ok, detail = "") {
  if (ok) { pass++; console.log(`  \x1b[32m✓\x1b[0m ${name}`); }
  else {
    fail++; failures.push(`${name}${detail ? ` — ${detail}` : ""}`);
    console.log(`  \x1b[31m✗\x1b[0m ${name}${detail ? `\n      ${detail}` : ""}`);
  }
}

function section(title) { console.log(`\n\x1b[1m${title}\x1b[0m`); }

async function status(path, opts = {}) {
  try {
    const res = await fetch(BASE + path, { redirect: "manual", ...opts });
    return res.status;
  } catch (e) { return `ERR:${e.message}`; }
}

async function body(path, opts = {}) {
  const res = await fetch(BASE + path, opts);
  return { status: res.status, text: await res.text() };
}

// ── Jeton de session admin, forgé avec le secret local ────────────────
async function adminCookie() {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const token = await new SignJWT({ username: "smoke-test" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("10m").setIssuedAt().sign(secret);
  return { Cookie: `admin_session=${token}` };
}

function dbConn() {
  return mysql.createConnection({
    host: process.env.DB_HOST, port: process.env.DB_PORT,
    user: process.env.DB_USER, password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
}

async function main() {
  console.log(`\n\x1b[1mSuite de tests — ${BASE}\x1b[0m`);
  const auth = await adminCookie();

  // ── 1. Pages publiques ──────────────────────────────────────────────
  section("1. Pages publiques");
  const publicPages = [
    "/", "/gallery", "/contact", "/booking",
    "/about", "/faq",
  ];
  for (const p of publicPages) {
    const s = await status(p);
    check(`${p}`, s === 200, `attendu 200, reçu ${s}`);
  }

  const home = await body("/");
  check("L'accueil affiche le nom du salon", home.text.includes("Solange"));
  check("L'accueil affiche le téléphone", home.text.includes("443.320.1312"));

  // Les pages de prestations et la page tarifs ont été retirées du site.
  for (const gone of ["/services", "/services/box-braids", "/pricing"]) {
    const s = await status(gone);
    check(`${gone} → 404 (page retirée)`, s === 404, `reçu ${s}`);
  }

  const booking = await body("/booking");
  check("La réservation propose un champ libre", booking.text.includes('name="serviceName"'));
  check("La réservation n'a plus de liste de prestations", !booking.text.includes('name="serviceSlug"'));

  // ── 2. Photos du salon ──────────────────────────────────────────────
  section("2. Photos du salon");
  for (const f of ["salon-reception", "salon-stations", "salon-styling"]) {
    const s = await status(`/images/salon/${f}.jpg`);
    check(`/images/salon/${f}.jpg`, s === 200, `reçu ${s}`);
  }

  // ── 2b. Photos du salon servies en local, sans catégorie ────────────
  section("2b. Catalogue photo — photos du salon, sans catégorie");
  {
    const probe = await dbConn();
    const [sample] = await probe.query(
      "SELECT cloudinary_url u FROM images WHERE is_active = 1 ORDER BY id LIMIT 5"
    );
    const [external] = await probe.query(
      "SELECT COUNT(*) n FROM images WHERE is_active = 1 AND cloudinary_url NOT LIKE '/images/%'"
    );
    const [categorised] = await probe.query(
      "SELECT COUNT(*) n FROM images WHERE is_active = 1 AND service_slug IS NOT NULL"
    );
    const [total] = await probe.query(
      "SELECT COUNT(*) n FROM images WHERE is_active = 1"
    );
    await probe.end();

    check("Toutes les images pointent vers un chemin local", external[0].n === 0,
      `${external[0].n} images encore externes`);
    check("Aucune image n'a de catégorie", categorised[0].n === 0,
      `${categorised[0].n} images encore rattachées à un service`);
    check(`Le catalogue contient les photos du salon (${total[0].n})`, total[0].n > 0);

    for (const row of sample) {
      const s = await status(row.u);
      check(`${row.u}`, s === 200, `reçu ${s}`);
    }
  }

  // Une page prérendue sans base afficherait ses placeholders : on le détecte ici.
  for (const p of ["/", "/gallery"]) {
    const page = await body(p);
    check(`${p} sert des photos du salon`, page.text.includes("/images/gallery") || page.text.includes("%2Fimages%2Fgallery"),
      "aucune photo dans le HTML — page probablement figée au build");
    check(`${p} n'appelle plus Cloudinary`, !page.text.includes("res.cloudinary.com"));
  }

  const galleryHtml = (await body("/gallery")).text;
  check("La galerie n'a plus d'onglets de catégorie", !galleryHtml.includes("category="));

  const homeHtml = (await body("/")).text;
  check("La galerie de l'accueil est remplie (pas de placeholders)",
    !homeHtml.includes("animate-pulse"),
    "des blocs animate-pulse subsistent : la requête images a échoué au rendu");

  // ── 3. Protection de l'espace admin ─────────────────────────────────
  section("3. Protection de l'espace admin");
  for (const p of ["/admin", "/admin/bookings", "/admin/messages", "/admin/catalog", "/admin/services", "/admin/images"]) {
    const s = await status(p);
    check(`${p} sans session → redirection`, s === 307 || s === 302, `reçu ${s}`);
  }
  check("/admin/login accessible", (await status("/admin/login")) === 200);

  for (const p of ["/admin", "/admin/bookings", "/admin/messages", "/admin/catalog"]) {
    const s = await status(p, { headers: auth });
    check(`${p} avec session → 200`, s === 200, `reçu ${s}`);
  }

  // ── 4. Authentification des routes API ──────────────────────────────
  section("4. Routes API — refus sans session");
  const guarded = [
    ["GET",    "/api/booking"],
    ["GET",    "/api/admin/services"],
    ["POST",   "/api/admin/services"],
    ["DELETE", "/api/admin/services"],
    ["GET",    "/api/images/download"],
    ["POST",   "/api/images/download"],
    ["PATCH",  "/api/images/download"],
    ["DELETE", "/api/images/download"],
    ["POST",   "/api/images/upload"],
    ["GET",    "/api/images/search?q=braids"],
    ["GET",    "/api/images/google-check"],
  ];
  for (const [method, path] of guarded) {
    const s = await status(path, {
      method,
      headers: { "Content-Type": "application/json" },
      body: method === "GET" ? undefined : "{}",
    });
    check(`${method} ${path} → 401`, s === 401, `reçu ${s}`);
  }

  section("5. Routes API — acceptation avec session");
  for (const path of ["/api/booking", "/api/admin/services", "/api/images/download"]) {
    const s = await status(path, { headers: auth });
    check(`GET ${path} → 200`, s === 200, `reçu ${s}`);
  }

  // ── 6. Liste blanche du PATCH catalogue ─────────────────────────────
  section("6. PATCH catalogue — liste blanche des colonnes");
  const inj = await body("/api/images/download", {
    method: "PATCH",
    headers: { ...auth, "Content-Type": "application/json" },
    body: JSON.stringify({ imageId: 1, updates: { "is_active` = 0, `title": "pwned" } }),
  });
  check("Colonne inconnue rejetée (400)", inj.status === 400, `reçu ${inj.status} ${inj.text.slice(0, 120)}`);

  const noField = await body("/api/images/download", {
    method: "PATCH",
    headers: { ...auth, "Content-Type": "application/json" },
    body: JSON.stringify({ imageId: 1, updates: {} }),
  });
  check("Mise à jour vide rejetée (400)", noField.status === 400, `reçu ${noField.status}`);

  // ── 7. Intégrité de la base ─────────────────────────────────────────
  section("7. Intégrité de la base");
  const db = await dbConn();
  const counts = {};
  for (const t of ["services", "images", "reviews", "bookings", "contact_messages"]) {
    const [r] = await db.query(`SELECT COUNT(*) n FROM \`${t}\``);
    counts[t] = r[0].n;
  }
  check(`Table services peuplée (${counts.services})`, counts.services >= 13);
  check(`Table images peuplée (${counts.images})`, counts.images >= 20);
  check(`Table reviews peuplée (${counts.reviews})`, counts.reviews >= 1);

  const [orphans] = await db.query(
    `SELECT COUNT(*) n FROM images i
     WHERE i.is_active = 1
       AND i.service_slug IS NOT NULL
       AND NOT EXISTS (SELECT 1 FROM services s WHERE s.slug = i.service_slug)`
  );
  check("Aucune image orpheline (service inexistant)", orphans[0].n === 0, `${orphans[0].n} orphelines`);

  const [noUrl] = await db.query(
    "SELECT COUNT(*) n FROM images WHERE is_active = 1 AND (cloudinary_url IS NULL OR cloudinary_url = '')"
  );
  check("Toutes les images actives ont une URL", noUrl[0].n === 0, `${noUrl[0].n} sans URL`);

  // ── 8. Cycle de vie d'une réservation ───────────────────────────────
  section("8. Réservation — création, lecture, statut");
  const created = await body("/api/booking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      serviceName: "ZZTEST — des tresses knotless mi-longues, couleur 1B",
      date: "2026-09-01", time: "11:00 AM",
      name: "ZZTEST Cliente", phone: "4435550000", email: "zztest@example.com",
      notes: "Réservation générée par la suite de tests",
    }),
  });
  check("POST /api/booking crée la réservation", created.status === 200, `reçu ${created.status}`);

  const [rows] = await db.query("SELECT * FROM bookings WHERE client_name = 'ZZTEST Cliente'");
  check("La réservation est bien en base", rows.length === 1, `${rows.length} lignes`);
  check("Statut initial « pending »", rows[0]?.status === "pending", `reçu ${rows[0]?.status}`);

  const missing = await status("/api/booking", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ serviceName: "ZZTEST incomplet" }),
  });
  check("Champs manquants → 400", missing === 400, `reçu ${missing}`);

  const listed = await body("/api/booking", { headers: auth });
  check("La réservation apparaît dans la liste admin", listed.text.includes("ZZTEST Cliente"));

  const bookingsPage = await body("/admin/bookings", { headers: auth });
  check("La réservation s'affiche sur /admin/bookings", bookingsPage.text.includes("ZZTEST Cliente"));
  check("Les coordonnées sont affichées", bookingsPage.text.includes("zztest@example.com"));

  // ── 9. Cycle de vie d'un message ────────────────────────────────────
  section("9. Message de contact — écriture et lecture");
  await db.query(
    "INSERT INTO contact_messages (name, phone, email, service, message) VALUES (?,?,?,?,?)",
    ["ZZTEST Visiteuse", "2025550000", "zztest2@example.com", "Knotless Braids", "Message de test <script>alert(1)</script>"]
  );
  const msgPage = await body("/admin/messages", { headers: auth });
  check("Le message s'affiche sur /admin/messages", msgPage.text.includes("ZZTEST Visiteuse"));
  check("Le message est marqué non lu", msgPage.text.includes("Nouveau"));
  check("Le HTML du message est échappé", !msgPage.text.includes("<script>alert(1)</script>"));

  const dash = await body("/admin", { headers: auth });
  check("Le dashboard affiche les compteurs", dash.text.includes("Réservations en attente") && dash.text.includes("Messages non lus"));

  // ── 10. Nettoyage ───────────────────────────────────────────────────
  section("10. Nettoyage");
  const [d1] = await db.query("DELETE FROM bookings WHERE client_name LIKE 'ZZTEST%'");
  const [d2] = await db.query("DELETE FROM contact_messages WHERE name LIKE 'ZZTEST%'");
  check("Réservations de test supprimées", d1.affectedRows >= 1);
  check("Messages de test supprimés", d2.affectedRows >= 1);

  const [after] = await db.query("SELECT COUNT(*) n FROM bookings WHERE client_name LIKE 'ZZTEST%'");
  check("Aucun résidu de test en base", after[0].n === 0);
  await db.end();

  // ── Bilan ───────────────────────────────────────────────────────────
  console.log(`\n${"─".repeat(56)}`);
  console.log(`\x1b[1m${pass} réussis, ${fail} échoués\x1b[0m`);
  if (fail) {
    console.log("\n\x1b[31mÉchecs :\x1b[0m");
    failures.forEach((f) => console.log(`  · ${f}`));
  }
  console.log("");
  process.exit(fail ? 1 : 0);
}

main().catch((e) => { console.error("\n\x1b[31mLa suite a planté :\x1b[0m", e); process.exit(1); });
