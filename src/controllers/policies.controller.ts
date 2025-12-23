import { Request, Response } from "express";
import { signJson, verifyJson } from "@services/signature";
import { serverPrivateKey, serverPublicKey } from "@crypto/serverKeys";
import { handleErrorResponse } from "@middlewares/errorHandler";
import { prisma } from "../lib/prisma";
import { Prisma } from "generated/prisma/client";
import { PolicyRequestSchema } from "validators/validators";
import z, { uuid } from "zod";

export const submitPolicyAuditorRequest = async (
  req: Request,
  res: Response
) => {
  const { signature, ...data } = req.body;

  try {
    if (!signature) {
      return res.status(400).json({
        success: false,
        message: "Signature missing",
      });
    }

    if (!verifyJson(data, signature, serverPublicKey)) {
      return res.status(401).json({
        success: false,
        message: "Invalid signature",
      });
    }

    const validation = PolicyRequestSchema.safeParse(data);

    if (!validation.success) {
      const prettyError = z.prettifyError(validation.error);
      return res.status(401).json({
        success: false,
        message: prettyError,
      });
    }

    const record = await prisma.policyAuditorRequest.create({
      data: {
        country: data.country,
        operator: data.operator,
        operatorTicketId: data.operatorTicketId,
        gameNameId: data.gameNameId,
        clientId: data.clientId,
        insurancePolicyId: data.insurancePolicyId,
        policyRequestedAt: new Date(data.policyRequestedAt),
        bets: data.bets,
      },
    });

    const responseData = {
      id: record.id,
      status: "success",
      timestamp: new Date().toISOString(),
      keyId: "cocoon-key-id",
    };

    const responseSignature = signJson(responseData, serverPrivateKey);

    res.status(200).json({
      ...responseData,
      signature: responseSignature,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(error.code);
      if (error.code === "P2002") {
        return handleErrorResponse(res, "policy already exists");
      }
    }

    return handleErrorResponse(res, "internal error");
  }
};

export const getAllPoicies = async (req: Request, res: Response) => {
  try {
    const policies = await prisma.policyAuditorRequest.findMany();

    res.status(200).json({
      success: true,
      policies: policies,
    });
  } catch (error) {}
};
