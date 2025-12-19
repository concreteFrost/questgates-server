import e, { Request, Response } from "express";
import { signJson, verifyJson } from "@services/signature";
import { serverPrivateKey, serverPublicKey } from "@crypto/serverKeys";
import { v4 as uuidv4 } from "uuid";
import { handleErrorResponse } from "@middlewares/errorHandler";

/*response should contain:

id: string;
timestamp: string (DateTime);
keyId: cocoon-key-id;
signature: string;
status: success/fail;
*/

export const submitPolicyAuditorRequest = async (
  req: Request,
  res: Response
) => {
  const { signature, ...data } = req.body;

  try {
    if (!signature) {
      return res.status(400).json({ message: "Signature missing" });
    }

    if (!verifyJson(data, signature, serverPublicKey)) {
      return res.status(401).json({ message: "Invalid signature" });
    }

    const responseData = {
      id: uuidv4(), // ✔ абсолютно нормально
      status: "OK",
      timestamp: new Date().toISOString(), // ✔ ОБЯЗАТЕЛЬНО строка
      keyId: "cocoon-key-id",
    };
    const responseSignature = signJson(responseData, serverPrivateKey);

    res.status(200).json({
      ...responseData,
      signature: responseSignature,
    });
  } catch (error) {
    handleErrorResponse(res, error);
  }
};
