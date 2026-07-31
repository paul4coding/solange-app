#!/usr/bin/env node
/**
 * Rend le site autonome vis-à-vis de Cloudinary.
 *
 *   node scripts/localize-images.mjs [--dry]
 *
 * 1. Copie les photos sauvegardées depuis cloudinary-images-download/
 *    vers public/images/catalog/<service>/<fichier>.jpg
 * 2. Réécrit images.cloudinary_url en chemin local (/images/catalog/…)
 * 3. Régénère le bloc « images » de mysql-seed.sql
 *
 * Idempotent : relancer le script ne casse rien.
 * Les lignes déjà locales sont laissées telles quelles.
 */
import fs from "node:fs";
import path from "node:path";
import mysql from "mysql2/promise";
import { config } from "dotenv";

config({ path: ".env.local" });

const DRY      = process.argv.includes("--dry");
const SRC_DIR  = "cloudinary-images-download";
const DEST_ROOT = path.join("public", "images", "catalog");
const SEED     = "mysql-seed.sql";
const PREFIX   = "solange-hair-braiding";

const log = (...a) => console.log(...a);

/** solange-hair-braiding_boho-braids_xxx.jpg → { service, file, publicId } */
function parseBackupName(filename) {
  const parts = filename.split("_");
  if (parts.length !== 3 || parts[0] !== PREFIX) return null;
  const [, service, file] = parts;
  return { service, file, publicId: `${PREFIX}/${service}/${file.replace(/\.[^.]+$/, "")}` };
}

function sqlEsc(v) {
  if (v === null || v === undefined) return "NULL";
  return `'${String(v).replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;
}

async function main() {
  if (!fs.existsSync(SRC_DIR)) {
    console.error(`Dossier introuvable : ${SRC_DIR}`);
    console.error("Décompresse cloudinary-images.zip à la racine du projet, puis relance.");
    process.exit(1);
  }

  // ── 1. Copie des fichiers ────────────────────────────────────────────
  const backups = fs.readdirSync(SRC_DIR).map(parseBackupName).filter(Boolean);
  log(`${backups.length} photos du salon trouvées dans ${SRC_DIR}/`);

  const byPublicId = new Map();
  let copied = 0, skipped = 0;

  for (const b of backups) {
    const destDir  = path.join(DEST_ROOT, b.service);
    const destFile = path.join(destDir, b.file);
    const webPath  = `/images/catalog/${b.service}/${b.file}`;
    byPublicId.set(b.publicId, webPath);

    if (fs.existsSync(destFile)) { skipped++; continue; }
    if (!DRY) {
      fs.mkdirSync(destDir, { recursive: true });
      fs.copyFileSync(path.join(SRC_DIR, `${PREFIX}_${b.service}_${b.file}`), destFile);
    }
    copied++;
  }
  log(`  ${copied} copiées, ${skipped} déjà présentes → ${DEST_ROOT}/`);

  // ── 2. Réécriture des URLs en base ───────────────────────────────────
  const db = await mysql.createConnection({
    host: process.env.DB_HOST, port: process.env.DB_PORT,
    user: process.env.DB_USER, password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const [rows] = await db.query(
    "SELECT id, cloudinary_public_id, cloudinary_url FROM images WHERE is_active = 1"
  );

  let updated = 0, alreadyLocal = 0;
  const unmatched = [];

  for (const r of rows) {
    if (r.cloudinary_url?.startsWith("/images/catalog/")) { alreadyLocal++; continue; }
    const local = byPublicId.get(r.cloudinary_public_id);
    if (!local) { unmatched.push(r.cloudinary_public_id); continue; }
    if (!DRY) {
      await db.query("UPDATE images SET cloudinary_url = ? WHERE id = ?", [local, r.id]);
    }
    updated++;
  }

  log(`\nBase : ${updated} URLs réécrites, ${alreadyLocal} déjà locales`);
  if (unmatched.length) {
    log(`  ⚠ ${unmatched.length} images sans fichier local correspondant :`);
    unmatched.slice(0, 5).forEach((p) => log(`     ${p}`));
    if (unmatched.length > 5) log(`     … et ${unmatched.length - 5} autres`);
  }

  // ── 3. Régénération du bloc images de mysql-seed.sql ─────────────────
  const [fresh] = await db.query(
    "SELECT * FROM images WHERE is_active = 1 ORDER BY id ASC"
  );

  const values = fresh.map((img) => {
    const tags = typeof img.tags === "string" ? img.tags : JSON.stringify(img.tags ?? []);
    return (
      `(${sqlEsc(img.service_slug)},${sqlEsc(img.title)},${sqlEsc(img.source)},` +
      `${sqlEsc(img.source_id)},${sqlEsc(img.original_url)},${sqlEsc(img.cloudinary_url)},` +
      `${sqlEsc(img.cloudinary_public_id)},` +
      `${img.width ?? "NULL"},${img.height ?? "NULL"},` +
      `${sqlEsc(img.alt_text)},${sqlEsc(tags)},` +
      `${sqlEsc(img.photographer)},${sqlEsc(img.photographer_url)},` +
      `${img.is_featured ? 1 : 0},1)`
    );
  });

  const block =
    "-- ---------------------------------------------------------------\n" +
    `--  Images (${fresh.length} photos — générées par scripts/localize-images.mjs)\n` +
    "--  Les URLs pointent vers /images/catalog/ : aucune dépendance à Cloudinary.\n" +
    "-- ---------------------------------------------------------------\n" +
    "INSERT INTO `images`\n" +
    "  (`service_slug`,`title`,`source`,`source_id`,`original_url`,`cloudinary_url`,\n" +
    "   `cloudinary_public_id`,`width`,`height`,`alt_text`,`tags`,\n" +
    "   `photographer`,`photographer_url`,`is_featured`,`is_active`)\nVALUES\n" +
    values.join(",\n") + ";\n";

  const seed = fs.readFileSync(SEED, "utf8");
  // Tout ce qui précède le premier commentaire « Images » est conservé tel quel
  const marker = seed.search(/^-{3,}-*\n--\s+Images \(/m) >= 0
    ? seed.search(/^-- -+\n--\s+Images \(/m)
    : seed.indexOf("INSERT INTO `images`");

  if (marker < 0) {
    log("\n⚠ Bloc « images » introuvable dans mysql-seed.sql — fichier laissé intact.");
  } else if (!DRY) {
    fs.writeFileSync(SEED, seed.slice(0, marker) + block, "utf8");
    log(`\n${SEED} régénéré : ${fresh.length} images en chemins locaux`);
  } else {
    log(`\n[--dry] ${SEED} aurait été régénéré avec ${fresh.length} images`);
  }

  const [remaining] = await db.query(
    "SELECT COUNT(*) n FROM images WHERE is_active = 1 AND cloudinary_url LIKE '%res.cloudinary.com%'"
  );
  log(`\nImages dépendant encore de Cloudinary : ${remaining[0].n}`);

  await db.end();
}

main().catch((e) => { console.error("Échec :", e); process.exit(1); });
