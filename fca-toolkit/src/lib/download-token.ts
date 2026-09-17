import { createHmac, timingSafeEqual } from "crypto";

/**
 * Stateless, signed download tokens — no database needed. A token encodes the
 * document slug and an expiry time, signed with a server-only secret. Anyone
 * who has purchased a document gets a link containing one of these tokens;
 * /api/download/[token] verifies it and streams the .docx on demand.
 */

function getSecret(): string {
  const secret = process.env.DOWNLOAD_SECRET;
  if (!secret) {
    throw new Error(
      "DOWNLOAD_SECRET is not set. Add it to .env.local (and to Vercel's environment variables before deploying)."
    );
  }
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export interface DownloadTokenPayload {
  slug: string;
  /** Unix seconds when this link stops working. */
  expiresAt: number;
  /** Optional reference to the purchase that unlocked this download (e.g. a Stripe session id). */
  orderRef?: string;
}

export function createDownloadToken(
  slug: string,
  { expiresInSeconds = 60 * 60 * 24 * 3, orderRef }: { expiresInSeconds?: number; orderRef?: string } = {}
): string {
  const payload: DownloadTokenPayload = {
    slug,
    expiresAt: Math.floor(Date.now() / 1000) + expiresInSeconds,
    orderRef,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = sign(encoded);
  return `${encoded}.${signature}`;
}

export type VerifyResult =
  | { valid: true; payload: DownloadTokenPayload }
  | { valid: false; reason: "malformed" | "bad-signature" | "expired" };

export function verifyDownloadToken(token: string): VerifyResult {
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) {
    return { valid: false, reason: "malformed" };
  }

  const expectedSignature = sign(encoded);
  const a = Buffer.from(signature);
  const b = Buffer.from(expectedSignature);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { valid: false, reason: "bad-signature" };
  }

  let payload: DownloadTokenPayload;
  try {
    payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
  } catch {
    return { valid: false, reason: "malformed" };
  }

  if (typeof payload.slug !== "string" || typeof payload.expiresAt !== "number") {
    return { valid: false, reason: "malformed" };
  }

  if (payload.expiresAt < Math.floor(Date.now() / 1000)) {
    return { valid: false, reason: "expired" };
  }

  return { valid: true, payload };
}
