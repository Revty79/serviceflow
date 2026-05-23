import { env } from "@/lib/config/env";

export const ADMIN_SESSION_COOKIE = "serviceflow_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12;

export type AdminSessionPayload = {
  adminId: string;
  businessId: string;
  email: string;
  exp: number;
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function toBase64(bytes: Uint8Array) {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(bytes).toString("base64");
  }

  return btoa(String.fromCharCode(...bytes));
}

function fromBase64(base64: string) {
  if (typeof Buffer !== "undefined") {
    return new Uint8Array(Buffer.from(base64, "base64"));
  }

  const binary = atob(base64);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function toBase64Url(bytes: Uint8Array) {
  return toBase64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(base64url: string) {
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  return fromBase64(padded);
}

function getSessionSecret() {
  return env.ADMIN_SESSION_SECRET;
}

async function getHmacKey() {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(getSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

async function sign(value: string) {
  const key = await getHmacKey();
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(value),
  );
  return toBase64Url(new Uint8Array(signatureBuffer));
}

export async function createAdminSessionToken(input: {
  adminId: string;
  businessId: string;
  email: string;
}) {
  const payload: AdminSessionPayload = {
    adminId: input.adminId,
    businessId: input.businessId,
    email: input.email,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };

  const payloadString = JSON.stringify(payload);
  const payloadBase64 = toBase64Url(encoder.encode(payloadString));
  const signature = await sign(payloadBase64);
  return `${payloadBase64}.${signature}`;
}

export async function verifyAdminSessionToken(token: string) {
  const [payloadBase64, signature] = token.split(".");

  if (!payloadBase64 || !signature) {
    return null;
  }

  const expectedSignature = await sign(payloadBase64);

  if (signature !== expectedSignature) {
    return null;
  }

  try {
    const payloadBytes = fromBase64Url(payloadBase64);
    const payload = JSON.parse(decoder.decode(payloadBytes)) as AdminSessionPayload;

    if (!payload.adminId || !payload.businessId || !payload.email || !payload.exp) {
      return null;
    }

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp <= now) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
