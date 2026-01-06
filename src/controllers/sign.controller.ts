import { Request, Response } from "express";
import { decodePayload } from "@crypto/signature";
import { prisma } from "../lib/prisma";
import { Prisma } from "generated/prisma/client";
import { PolicyRequestSchema } from "validators/validators";
import { handleErrorResponse } from "utils/errorHandler.utils";
import { signJson } from "@crypto/signature";
import z from "zod";
import { serverPrivateKey } from "@crypto/serverKeys";
import { verifyJwsWithJwks } from "@crypto/jwks";

export const submitPolicyAuditorRequest = async (
  req: Request,
  res: Response
) => {
  try {
    const { data, signature, signedAt } = req.body;

    if (!data || !signature || !signedAt) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    }

    // Verify JWS via JWKS
    const isValid = await verifyJwsWithJwks(signature);
    if (!isValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid signature" });
    }

    const payloadFromJws = decodePayload(signature);

    if (JSON.stringify(payloadFromJws.data) !== JSON.stringify(req.body.data)) {
      return res.status(401).json({
        success: false,
        message: "Payload does not match signature",
      });
    }

    // Validate schema
    const validation = PolicyRequestSchema.safeParse(data);
    if (!validation.success) {
      const prettyError = z.prettifyError(validation.error);
      return res.status(400).json({ success: false, message: prettyError });
    }

    // Persist record
    // const record = await prisma.policyAuditorRequest.create({
    //   data: {
    //     country: data.country,
    //     operator: data.operator,
    //     operatorTicketId: data.operatorTicketId,
    //     gameNameId: data.gameNameId,
    //     clientId: data.clientId,
    //     insurancePolicyId: data.insurancePolicyId,
    //     policyRequestedAt: new Date(data.policyRequestedAt),
    //     bets: data.bets,
    //   },
    // });

    // Prepare response
    const responseData = {
      // id: record.id,
      status: "success",
    };

    const responseSignedAt = new Date().toISOString();
    const responseSignature = signJson(responseData, serverPrivateKey);

    return res.status(200).json({
      data: responseData,
      signedAt: responseSignedAt,
      signature: responseSignature,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return handleErrorResponse(res, "Policy already exists");
    }
    console.log(error);
    return handleErrorResponse(res, "Internal Error");
  }
};
