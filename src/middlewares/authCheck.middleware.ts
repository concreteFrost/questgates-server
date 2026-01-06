import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authCheck = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer")) {
    return res.status(401).json({
      success: false,
      message: "Either token has expired or the signature is incorrect",
    });
  }

  const token = header.split(" ")[1];

  jwt.verify(token, process.env.SECRET_KEY!, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ success: false, message: err.name });
      } else {
        return res
          .status(403)
          .json({ success: false, message: "Invalid Token" });
      }
    }

    req.body = { ...req.body, user: decoded };
    next();
  });
};
