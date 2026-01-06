import axios from "axios";
import testJSON from "./testPolicy.json";
import { verifyJson } from "../src/crypto/signature";
import { serverPublicKey } from "../src/crypto/serverKeys";

async function testSubmit() {
  const response: any = await axios.post(
    `${process.env.BASE_URL}/api/policies/submit`,
    testJSON
  );

  const { signature: serverSignature, ...rest } = response.data;

  if (!serverSignature) {
    throw new Error("No signature returned by server");
  }
  const isValid = verifyJson(serverSignature, serverPublicKey);

  return {
    verify: isValid,
    serverSignature,
    ...rest,
  };
}

async function handleSubmit() {
  try {
    const res = await testSubmit();
    console.log("Server response verified:", res);
  } catch (err: any) {
    console.error(err.response?.data || err.message);
  }
}

handleSubmit();
