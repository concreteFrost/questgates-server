import axios from "axios";
import { testPolicyAuditorRequest } from "../src/shared/mockData/testPolicyAuditorRequest";
import { signJson, verifyJson } from "../src/services/signature";
import { PolicyAuditorRequest } from "../src/shared/interfaces";
import { clientPrivateKey, clientPublicKey } from "../src/crypto/clientKeys";

//test payload
const payload: PolicyAuditorRequest = testPolicyAuditorRequest;

//signature to send (signed with client private key)
const signature = signJson(payload, clientPrivateKey);

//tampered payload to immitate false request
const tamperedPayload: PolicyAuditorRequest = { ...payload, country: "RU" };

async function testSubmit() {
  const response = await axios.post(`${process.env.BASE_URL}/api/submit`, {
    ...payload,
    signature,
  });

  //response data to verify
  const { signature: serverSignature, ...rest }: any = response.data;

  //returns true/false based on verification success
  const verify = verifyJson({ ...rest }, serverSignature, clientPublicKey);

  return {
    verify,
    serverSignature,
    data: { ...rest },
    message: "success",
  };
}

async function handleSubmit() {
  try {
    const res = await testSubmit();
    console.log(res);
  } catch (err: any) {
    console.log("error:");
  }
}

handleSubmit();
