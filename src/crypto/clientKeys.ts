import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const clientPrivateKeyPath = path.resolve(
  process.cwd(),
  process.env.CLIENT_PRIVATE_KEY_PATH!
);
const cleintPublicKeyPath = path.resolve(
  process.cwd(),
  process.env.CLIENT_PUBLIC_KEY_PATH!
);

export const clientPrivateKey = fs.readFileSync(clientPrivateKeyPath, "utf-8");
export const clientPublicKey = fs.readFileSync(cleintPublicKeyPath, "utf-8");
