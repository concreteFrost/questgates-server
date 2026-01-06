import crypto from "crypto";

/* ===================== sign ===================== */
export function signJson(payload: object, privateKey: string): string {
  const header = {
    alg: "RS256",
    kid: "default-key",
    typ: "JWT",
  };

  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(payload));

  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const signature = crypto
    .createSign("RSA-SHA256")
    .update(signingInput)
    .end()
    .sign(privateKey);

  const encodedSignature = base64url(signature);

  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

/* ===================== verify ===================== */
export function verifyJson(jws: string, publicKey: string): boolean {
  const parts = jws.split(".");

  if (parts.length !== 3) return false;

  const [encodedHeader, encodedPayload, encodedSignature] = parts;

  let header;
  try {
    header = JSON.parse(base64urlDecode(encodedHeader).toString("utf-8"));
  } catch {
    return false;
  }

  // STRICT header validation
  if (header.alg !== "RS256") return false;
  if (header.kid !== "default-key") return false;

  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const signature = base64urlDecode(encodedSignature);

  return crypto
    .createVerify("RSA-SHA256")
    .update(signingInput)
    .end()
    .verify(publicKey, signature);
}

/* ===================== decode payload ===================== */
export function decodePayload(jws: string): any {
  const parts = jws.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid JWS format");
  }

  const payload = parts[1];

  return JSON.parse(base64urlDecode(payload).toString("utf-8"));
}

/* ===================== utils ===================== */

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64urlDecode(input: string): Buffer {
  return Buffer.from(input.replace(/-/g, "+").replace(/_/g, "/"), "base64");
}
