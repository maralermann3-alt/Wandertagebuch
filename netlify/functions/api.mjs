import { getStore } from "@netlify/blobs";
import { timingSafeEqual } from "node:crypto";

export const config = { path: "/api" };

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

const KEY_RE = /^[A-Za-z0-9:_-]{1,80}$/;
const MAX_BODY = 6 * 1024 * 1024;

export default async (req) => {
  const secret = process.env.SYNC_PASSWORD;
  if (!secret) return json({ error: "not configured" }, 503);

  const given = Buffer.from(req.headers.get("x-sync-password") || "");
  const expected = Buffer.from(secret);
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
    return json({ error: "unauthorized" }, 401);
  }

  const store = getStore("wandertagebuch");
  const url = new URL(req.url);

  if (url.searchParams.has("list")) {
    const { blobs } = await store.list({ prefix: "img/" });
    return json(blobs.map((b) => b.key.slice(4)));
  }

  const key = url.searchParams.get("key");
  if (!key || (key !== "data" && !KEY_RE.test(key))) return json({ error: "bad key" }, 400);
  const blobKey = key === "data" ? "data" : "img/" + key;

  if (req.method === "GET") {
    const value = await store.get(blobKey, { type: "text" });
    if (value === null) return json({ error: "not found" }, 404);
    return new Response(value, { headers: { "content-type": "text/plain; charset=utf-8" } });
  }
  if (req.method === "PUT") {
    const text = await req.text();
    if (text.length > MAX_BODY) return json({ error: "too large" }, 413);
    await store.set(blobKey, text);
    return json({ ok: true });
  }
  if (req.method === "DELETE") {
    await store.delete(blobKey);
    return json({ ok: true });
  }
  return json({ error: "method not allowed" }, 405);
};
