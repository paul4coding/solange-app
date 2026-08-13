#!/usr/bin/env node
/**
 * Remplace tout le catalogue photo par les vraies photos du salon.
 *
 *   node scripts/import-salon-photos.mjs [--dry]
 *
 * 1. Copie « image a remplacer/ » vers public/images/gallery/ sous des noms propres
 * 2. Vide la table images et réinsère les photos SANS catégorie (service_slug NULL)
 * 3. Régénère le bloc images de mysql-seed.sql
 *
 * Le site n'a plus de catégories : toutes les photos vivent dans un seul pool.
 */
import fs from "node:fs";
import path from "node:path";
import mysql from "mysql2/promise";
import { config } from "dotenv";

config({ path: ".env.local" });

const DRY      = process.argv.includes("--dry");
const SRC_DIR  = "image a remplacer";
const DEST_DIR = path.join("public", "images", "gallery");
const SEED     = "mysql-seed.sql";

// Capture d'un tableau comptable (noms de personnes + montants) glissée par
// erreur dans le dossier. Ne doit jamais se retrouver sur le site.
const EXCLUDE = new Set(["WhatsApp Image 2026-08-06 at 16.34.33 (1).jpeg"]);

function sqlEsc(v) {
  if (v === null || v === undefined) return "NULL";
  return `'${String(v).replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;
}

async function main() {
  if (!fs.existsSync(SRC_DIR)) {
    console.error(`Dossier introuvable : ${SRC_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(SRC_DIR)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .filter((f) => !EXCLUDE.has(f))
    .sort();

  console.log(`${files.length} photos retenues (${EXCLUDE.size} écartée)`);

  // ── 1. Copie sous des noms propres ───────────────────────────────────
  if (!DRY) {
    fs.rmSync(DEST_DIR, { recursive: true, force: true });
    fs.mkdirSync(DEST_DIR, { recursive: true });
  }

  const entries = files.map((f, i) => {
    const ext  = path.extname(f).toLowerCase().replace(".jpeg", ".jpg");
    const name = `salon-${String(i + 1).padStart(2, "0")}${ext}`;
    if (!DRY) fs.copyFileSync(path.join(SRC_DIR, f), path.join(DEST_DIR, name));
    return { name, webPath: `/images/gallery/${name}` };
  });
  console.log(`  copiées vers ${DEST_DIR}/ (salon-01 … salon-${String(entries.length).padStart(2, "0")})`);

  // ── 2. Remplacement complet du catalogue ─────────────────────────────
  const db = await mysql.createConnection({
    host: process.env.DB_HOST, port: process.env.DB_PORT,
    user: process.env.DB_USER, password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const [before] = await db.query("SELECT COUNT(*) n FROM images");
  console.log(`\nAncien catalogue : ${before[0].n} images`);

  if (!DRY) {
    await db.query("DELETE FROM images");
    await db.query("ALTER TABLE images AUTO_INCREMENT = 1");

    for (const e of entries) {
      await db.query(
        `INSERT INTO images
           (service_slug, title, source, cloudinary_url, cloudinary_public_id,
            alt_text, tags, is_featured, is_active)
         VALUES (NULL, ?, 'owner', ?, ?, ?, ?, 0, 1)`,
        [
          "Solange's Hair Braiding",
          e.webPath,
          e.name.replace(/\.[^.]+$/, ""),
          "Coiffure réalisée chez Solange's Hair Braiding",
          JSON.stringify(["salon"]),
        ]
      );
    }
  }

  const [after] = await db.query("SELECT COUNT(*) n FROM images WHERE is_active = 1");
  console.log(`Nouveau catalogue : ${DRY ? entries.length + " (simulation)" : after[0].n} images, sans catégorie`);

  // ── 3. Régénération du seed ──────────────────────────────────────────
  const [fresh] = await db.query("SELECT * FROM images WHERE is_active = 1 ORDER BY id ASC");
  const rows = DRY ? entries.map((e) => ({
    service_slug: null, title: "Solange's Hair Braiding", source: "owner",
    source_id: null, original_url: null, cloudinary_url: e.webPath,
    cloudinary_public_id: e.name.replace(/\.[^.]+$/, ""), width: null, height: null,
    alt_text: "Coiffure réalisée chez Solange's Hair Braiding",
    tags: JSON.stringify(["salon"]), photographer: null, photographer_url: null,
    is_featured: 0,
  })) : fresh;

  const values = rows.map((img) => {
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
    `--  Images (${values.length} photos du salon — sans catégorie)\n` +
    "--  Générées par scripts/import-salon-photos.mjs\n" +
    "-- ---------------------------------------------------------------\n" +
    "INSERT INTO `images`\n" +
    "  (`service_slug`,`title`,`source`,`source_id`,`original_url`,`cloudinary_url`,\n" +
    "   `cloudinary_public_id`,`width`,`height`,`alt_text`,`tags`,\n" +
    "   `photographer`,`photographer_url`,`is_featured`,`is_active`)\nVALUES\n" +
    values.join(",\n") + ";\n";

  const seed   = fs.readFileSync(SEED, "utf8");
  const marker = seed.search(/^-- -+\n--\s+Images \(/m);

  if (marker < 0) {
    console.log("\n⚠ Bloc « images » introuvable dans mysql-seed.sql — fichier inchangé.");
  } else if (!DRY) {
    fs.writeFileSync(SEED, seed.slice(0, marker) + block, "utf8");
    console.log(`\n${SEED} régénéré avec ${values.length} photos`);
  } else {
    console.log(`\n[--dry] ${SEED} aurait été régénéré avec ${values.length} photos`);
  }

  await db.end();
}

main().catch((e) => { console.error("Échec :", e); process.exit(1); });
