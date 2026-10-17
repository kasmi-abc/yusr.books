// Copies real book photos from Desktop "كتب" folder to public/books with clean names.
// Run: node scripts/copy-books.mjs  (from project root)
import { readdirSync, copyFileSync, mkdirSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = "C:\\Users\\Error -403-\\Desktop\\كتب";
const DEST = join(root, "public", "books");
mkdirSync(DEST, { recursive: true });

function norm(s) {
  return s
    .replace(/[ً-ٰٟـ]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/[^ء-غف-ي0-9a-zA-Z]+/g, "");
}

// {keys, exclude, dest[]}
const MAP = [
  { keys: ["الداء", "القيم"], dest: ["dawa-qayyim.jpg"] },
  { keys: ["الداء", "الهيثم"], dest: ["dawa-haytham.jpg"] },
  { keys: ["الداء", "صوره"], dest: ["dawa-alt2.jpg"] },
  { keys: ["الداء"], exclude: ["القيم", "الهيثم", "صوره"], dest: ["dawa-alt1.jpg"] },
  { keys: ["رياض", "الصالحين"], exclude: ["نزهه"], dest: ["riyad1.jpg"] },
  { keys: ["زاد", "هدي", "العباد"], dest: ["zad1.jpg"] },
  { keys: ["البدايه", "والنهايه"], dest: ["bidaya1.jpg"] },
  { keys: ["كتاب", "التوحيد"], exclude: ["القول"], dest: ["tawhid1.jpg"] },
  { keys: ["القول", "المفيد"], dest: ["qawl1.jpg"] },
  { keys: ["الواسطيه"], dest: ["wasitiya1.png"] },
  { keys: ["مدارج", "السالكين"], dest: ["madarij1.jpeg"] },
  { keys: ["جامع", "البيان"], dest: ["tabari1.jpeg", "tabari2.jpeg"] },
  { keys: ["روضه", "العقلاء"], dest: ["rawda1.jpeg", "rawda2.jpeg"] },
  { keys: ["صفه", "الصفوه"], dest: ["safwa1.jpeg", "safwa2.jpeg", "safwa3.jpeg"] },
  { keys: ["قيام", "الليل"], dest: ["qiyam1.jpeg", "qiyam2.jpeg"] },
  { keys: ["صفه", "صلاه", "النبي"], dest: ["salat1.jpg"] },
  { keys: ["قصص", "الانبياء"], dest: ["qasas1.jpg"] },
  { keys: ["الارشاد", "الشرك"], dest: ["irshad1.jpg", "irshad2.jpg"] },
  { keys: ["شرح", "الاربعين"], dest: ["arbaeen-sharh1.jpg"] },
  { keys: ["سيره", "هشام"], dest: ["sira-hisham1.jpeg", "sira-hisham2.jpeg"] },
  { keys: ["اصول", "التفسير"], dest: ["usul-tafsir1.jpg"] },
  { keys: ["ادب", "الدنيا"], dest: ["adab1.jpg"] },
  { keys: ["زينه", "المراه"], dest: ["zina1.jpg"] },
  { keys: ["الطحاويه"], dest: ["tahawiya1.png"] },
  { keys: ["متون", "طالب"], dest: ["mutun1.jpg"] },
  { keys: ["العزله"], dest: ["uzla1.jpg"] },
  { keys: ["القبول"], dest: ["miraj1.png"] },
  { keys: ["نزهه", "المتقين"], dest: ["nuzha1.jpeg", "nuzha2.jpeg"] },
];

const files = readdirSync(SRC);
const used = new Set();
let total = 0;
for (const m of MAP) {
  const hits = files
    .filter((f) => !used.has(f))
    .filter((f) => {
      const n = norm(f);
      return m.keys.every((k) => n.includes(norm(k))) && !(m.exclude || []).some((k) => n.includes(norm(k)));
    })
    .sort((a, b) => a.length - b.length);
  m.dest.forEach((d, i) => {
    const src = hits[i] || hits[hits.length - 1];
    if (!src) {
      console.log("MISS " + d);
      return;
    }
    used.add(src);
    copyFileSync(join(SRC, src), join(DEST, d));
    total += statSync(join(DEST, d)).size;
    console.log("OK " + d + "  <=  " + src);
  });
}
console.log("TOTAL bytes: " + total);
console.log("UNUSED: " + files.filter((f) => !used.has(f)).join(" | "));
