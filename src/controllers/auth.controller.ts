import { Response, Request } from "express";
import { prisma } from "lib/prisma";
import bcrypt from "bcrypt";
import { PasswordValidator } from "password-validator-pro";
import { handleErrorResponse } from "utils/errorHandler";
import { AuthSchema, LoginSchema } from "validators/validators";
import z from "zod";
import { passwordErrorHandler } from "utils/passwordErrorHandler";
import { signToken } from "utils/signToken.utils";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    //validating request body
    const validation = AuthSchema.safeParse({
      name,
      email,
      password,
    });

    //return validation errors if schema is invalid
    if (!validation.success) {
      const prettyErrors = z.prettifyError(validation.error);

      return res.status(403).json({
        success: false,
        message: prettyErrors,
      });
    }

    //check if the user is already registered
    const isRegistered = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (isRegistered) {
      return res.status(401).json({
        success: false,
        message: "user with this email is already registered",
      });
    }

    //assigning password criteria
    const passValidator = new PasswordValidator({
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireSpecialChars: true,
    });

    //checking password strength
    const passCheckResult = passValidator.validate(password);

    if (!passCheckResult.valid) {
      return res.status(403).json({
        success: false,
        message: passwordErrorHandler(passCheckResult.errors),
      });
    }

    //creating salt for token
    const salt = await bcrypt.genSalt();
    const hash: string = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        passHash: hash,
      },
    });

    //signing token with user id and secret key for
    const token = signToken(newUser);

    res.status(200).json({
      success: true,
      message: "User created successfully",
      token,
    });
  } catch (error) {
    return handleErrorResponse(res, "Failed to register user");
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const validation = LoginSchema.safeParse({
      email,
      password,
    });

    if (!validation.success) {
      const prettyError = z.prettifyError(validation.error);

      return res.status(403).json({
        success: false,
        message: prettyError,
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isValidPass = await bcrypt.compare(password, existingUser.passHash);

    if (!isValidPass) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = signToken(existingUser);

    res.status(200).json({
      success: true,
      message: "",
      token,
    });
  } catch (error) {
    return handleErrorResponse(res, "Failed to login user");
  }
};
