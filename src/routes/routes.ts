import { Router } from "express";
import { submitPolicyAuditorRequest } from "controllers/sign.controller";
import {
  getAllPoicies,
  getPoliciesByCountry,
} from "controllers/policies.controller";
import { login, register } from "controllers/auth.controller";
import { authCheck } from "@middlewares/authCheck.middleware";

const router: Router = Router();

//auth
router.post("/auth/register", register);
router.post("/auth/login", login);

//sign
router.post("/policies/submit", submitPolicyAuditorRequest); // insert auth check

//policies
router.get("/policies/get", authCheck, getAllPoicies);
router.get("/policies/get-by-country", authCheck, getPoliciesByCountry);

export default router;
