/**
 * Script: download-cloudinary-images.mjs
 * Télécharge toutes les images du compte Cloudinary et crée un ZIP
 */

import https from "https";
import http from "http";
import fs from "fs";
import path from "path";
import { createWriteStream } from "fs";
import { mkdir } from "fs/promises";
import { createGzip } from "zlib";

// ─── Config Cloudinary ─────────────────────────────────────
const CLOUD_NAME  = "dzqoifrmz";
const API_KEY     = "797764597586974";
const API_SECRET  = "0zuTyUxLsxdhFn2IZ-lW6-tK05g";
const OUTPUT_DIR  = path.join(process.cwd(), "cloudinary-images-download");
const ZIP_OUTPUT  = path.join(process.cwd(), "cloudinary-images.zip");

// ─── Helpers ───────────────────────────────────────────────
function fetchJson(url, auth) {
  return new Promise((resolve, reject) => {
    const options = { headers: { Authorization: "Basic " + Buffer.from(auth).toString("base64") } };
    https.get(url, options, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { reject(e); }
      });
    }).on("error", reject);
  });
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https") ? https : http;
    lib.get(url, (res) => {
      // Follow redirects
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const ws = createWriteStream(destPath);
      res.pipe(ws);
      ws.on("finish", () => ws.close(resolve));
      ws.on("error", reject);
    }).on("error", reject);
  });
}

// ─── Main ──────────────────────────────────────────────────
async function main() {
  const auth = `${API_KEY}:${API_SECRET}`;

  console.log("🔍 Récupération de la liste des images Cloudinary...");

  // Paginate through all resources
  let allResources = [];
  let nextCursor = null;

  do {
    let url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image?max_results=500&type=upload`;
    if (nextCursor) url += `&next_cursor=${nextCursor}`;

    const data = await fetchJson(url, auth);
    if (data.error) { console.error("❌ Erreur Cloudinary:", data.error.message); process.exit(1); }

    allResources = allResources.concat(data.resources || []);
    nextCursor = data.next_cursor || null;
    console.log(`  ↳ ${allResources.length} images trouvées jusqu'ici...`);
  } while (nextCursor);

  console.log(`\n✅ Total : ${allResources.length} images\n`);

  if (allResources.length === 0) {
    console.log("Aucune image trouvée sur Cloudinary.");
    process.exit(0);
  }

  // Create output directory
  await mkdir(OUTPUT_DIR, { recursive: true });

  // Download all images
  let ok = 0, fail = 0;
  for (let i = 0; i < allResources.length; i++) {
    const r = allResources[i];
    const ext = r.format || "jpg";
    const safeName = r.public_id.replace(/\//g, "_") + "." + ext;
    const destPath = path.join(OUTPUT_DIR, safeName);
    const imageUrl  = r.secure_url;

    process.stdout.write(`[${i + 1}/${allResources.length}] ${safeName} ... `);
    try {
      await downloadFile(imageUrl, destPath);
      console.log("✅");
      ok++;
    } catch (e) {
      console.log(`❌ (${e.message})`);
      fail++;
    }
  }

  console.log(`\n📥 Téléchargement terminé : ${ok} OK, ${fail} erreurs`);
  console.log(`\n🗜️  Création du ZIP...`);

  // Create ZIP using PowerShell (Windows-compatible)
  const { execSync } = await import("child_process");
  try {
    // Remove old zip if exists
    if (fs.existsSync(ZIP_OUTPUT)) fs.unlinkSync(ZIP_OUTPUT);

    execSync(
      `powershell -Command "Compress-Archive -Path '${OUTPUT_DIR}\\*' -DestinationPath '${ZIP_OUTPUT}' -Force"`,
      { stdio: "inherit" }
    );
    const sizeMB = (fs.statSync(ZIP_OUTPUT).size / 1024 / 1024).toFixed(1);
    console.log(`\n🎉 ZIP créé : ${ZIP_OUTPUT}`);
    console.log(`   Taille : ${sizeMB} MB`);
    console.log(`   Images : ${ok} fichiers`);
  } catch(e) {
    console.error("❌ Erreur création ZIP:", e.message);
    console.log(`Les images sont dans le dossier : ${OUTPUT_DIR}`);
  }
}

main().catch(e => { console.error("❌ Erreur fatale:", e); process.exit(1); });
