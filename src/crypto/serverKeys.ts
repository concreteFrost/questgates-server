import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const serverPrivateKeyPath = path.resolve(
  process.cwd(),
  process.env.SERVER_PRIVATE_KEY_PATH!
);
const serverPublicKeyPath = path.resolve(
  process.cwd(),
  process.env.SERVER_PUBLIC_KEY_PATH!
);

export const serverPrivateKey = fs.readFileSync(serverPrivateKeyPath, "utf-8");
export const serverPublicKey = fs.readFileSync(serverPublicKeyPath, "utf-8");
