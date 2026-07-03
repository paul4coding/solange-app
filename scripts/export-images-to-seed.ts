/**
 * Exporte les images de MySQL local vers mysql-seed.sql
 * Lance avec : npx tsx scripts/export-images-to-seed.ts
 */
import mysql from "mysql2/promise";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

function esc(v: unknown): string {
  if (v === null || v === undefined) return "NULL";
  return `'${String(v).replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;
}

async function main() {
  const pool = mysql.createPool({
    host:     process.env.DB_HOST     || "localhost",
    port:     parseInt(process.env.DB_PORT || "3306"),
    database: process.env.DB_NAME     || "solange_hair",
    user:     process.env.DB_USER     || "root",
    password: process.env.DB_PASSWORD || "",
  });

  const [rows] = await pool.execute(
    "SELECT * FROM images WHERE is_active = 1 ORDER BY id ASC"
  ) as [Record<string, unknown>[], unknown];

  const images = rows as Record<string, unknown>[];
  console.log(`📸  ${images.length} images trouvées — génération du SQL…`);

  let sql = "\n-- ---------------------------------------------------------------\n";
  sql += `--  Images (${images.length} photos — générées automatiquement)\n`;
  sql += "-- ---------------------------------------------------------------\n";

  if (images.length > 0) {
    const vals = images.map((img) => {
      const tags =
        typeof img.tags === "string"
          ? img.tags
          : JSON.stringify(img.tags ?? []);
      return (
        `(${esc(img.service_slug)},${esc(img.title)},${esc(img.source)},` +
        `${esc(img.source_id)},${esc(img.original_url)},${esc(img.cloudinary_url)},` +
        `${esc(img.cloudinary_public_id)},` +
        `${img.width ?? "NULL"},${img.height ?? "NULL"},` +
        `${esc(img.alt_text)},${esc(tags)},` +
        `${esc(img.photographer)},${esc(img.photographer_url)},` +
        `${img.is_featured ? 1 : 0},1)`
      );
    });

    sql += "INSERT INTO `images`\n";
    sql +=
      "  (`service_slug`,`title`,`source`,`source_id`,`original_url`,`cloudinary_url`,\n" +
      "   `cloudinary_public_id`,`width`,`height`,`alt_text`,`tags`,\n" +
      "   `photographer`,`photographer_url`,`is_featured`,`is_active`)\nVALUES\n";
    sql += vals.join(",\n") + ";\n";
  }

  const seedPath = path.resolve(process.cwd(), "mysql-seed.sql");
  fs.appendFileSync(seedPath, sql, "utf8");

  console.log(`✅  ${images.length} images ajoutées à mysql-seed.sql`);
  await pool.end();
}

main().catch((e) => { console.error("❌", e); process.exit(1); });
