import jwkToPem from "jwk-to-pem";
import crypto from "crypto";
import axios from "axios";

async function getPemForKid(kid: string): Promise<string> {
  const res = await axios.get("https://api.enterito.com/.well-known/jwks.json");
  const data: any = res.data;
  const keys = data.keys;
  const jwk = keys.find((k: any) => k.kid === kid);
  if (!jwk) throw new Error(`Key with kid=${kid} not found in JWKS`);
  return jwkToPem(jwk);
}

export async function verifyJwsWithJwks(jws: string): Promise<boolean> {
  const parts = jws.split(".");
  if (parts.length !== 3) return false;

  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  let header;
  try {
    header = JSON.parse(Buffer.from(encodedHeader, "base64url").toString());
  } catch {
    return false;
  }

  if (!header.kid || header.alg !== "RS256") return false;

  const pem = await getPemForKid(header.kid);

  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const signature = Buffer.from(
    encodedSignature.replace(/-/g, "+").replace(/_/g, "/"),
    "base64"
  );

  return crypto
    .createVerify("RSA-SHA256")
    .update(signingInput)
    .end()
    .verify(pem, signature);
}
