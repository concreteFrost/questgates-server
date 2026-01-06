import { Response } from "express";

export function handleErrorResponse(res: Response, message: string) {
  res.status(500).json({
    success: false,
    message,
  });
}
