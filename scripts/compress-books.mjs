// One-time: downscale public/books photos for web (max 1200px, q80).
// Run: node scripts/compress-books.mjs
import { readdirSync, statSync, writeFileSync, renameSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "books");
let before = 0;
let after = 0;
for (const f of readdirSync(DIR)) {
  if (!/\.(jpe?g|png|webp)$/i.test(f)) continue;
  const p = join(DIR, f);
  try {
    before += statSync(p).size;
    const img = sharp(p).rotate().resize({ width: 1200, withoutEnlargement: true });
    const buf = /\.png$/i.test(f)
      ? await img.png({ compressionLevel: 9 }).toBuffer()
      : await img.jpeg({ quality: 80, mozjpeg: true }).toBuffer();
    writeFileSync(p + ".tmp", buf);
    renameSync(p + ".tmp", p);
    after += buf.length;
    console.log(f + " done");
  } catch (e) {
    console.log(f + " SKIP: " + String(e).slice(0, 120));
  }
}
console.log("BEFORE: " + before + " AFTER: " + after);
