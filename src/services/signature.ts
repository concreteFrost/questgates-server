import crypto from "crypto";
import { ALGORITHM, OUTPUT_FORMAT } from "../shared/consts/crypto";

export function signJson(data: object, privateKey: string): string {
  const payload = JSON.stringify(data);

  const sign = crypto.createSign(ALGORITHM);
  sign.update(payload);
  sign.end();

  return sign.sign(privateKey, OUTPUT_FORMAT);
}

export function verifyJson(
  data: object,
  signature: string,
  publicKey: string
): boolean {
  const payload = JSON.stringify(data);

  const verify = crypto.createVerify(ALGORITHM);
  verify.update(payload);
  verify.end();

  return verify.verify(publicKey, signature, OUTPUT_FORMAT);
}
