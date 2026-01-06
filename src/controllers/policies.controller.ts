import { Request, Response } from "express";
import { handleErrorResponse } from "utils/errorHandler.utils";
import { prisma } from "../lib/prisma";

export const getAllPoicies = async (req: Request, res: Response) => {
  try {
    const policies = await prisma.policyAuditorRequest.findMany();

    res.status(200).json({
      success: true,
      policies: policies,
    });
  } catch (error) {
    return handleErrorResponse(res, "Failed to get policies");
  }
};

export const getPoliciesByCountry = async (req: Request, res: Response) => {
  try {
    const { country } = req.body;

    const policies = await prisma.policyAuditorRequest.findMany({
      where: {
        country: country === undefined ? "" : country,
      },
    });

    res.status(200).json({
      success: true,
      policies: policies,
    });
  } catch (error) {
    return handleErrorResponse(res, "Failed to get policies");
  }
};
