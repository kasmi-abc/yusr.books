// One-time Neon verification: list tables, read test order, delete it.
// Run: $env:DATABASE_URL='...'; node scripts/verify-neon.mjs
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

const tables = await sql`select tablename from pg_tables where schemaname = 'public'`;
console.log("tables:", tables.map((t) => t.tablename).join(","));

const num = "YUSR-NEON1";
const rows = await sql`select number, name, phone, subtotal, status from orders where number = ${num}`;
console.log("row:", JSON.stringify(rows));
await sql`delete from orders where number = ${num}`;
console.log("test row deleted");
