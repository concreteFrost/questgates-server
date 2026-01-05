import { Router } from "express";
import {
  getAllPoicies,
  getPoliciesByCountry,
  submitPolicyAuditorRequest,
} from "controllers/policies.controller";
import { login, register } from "controllers/auth.controller";
import { authCheck } from "@middlewares/authCheck.middleware";

const router: Router = Router();

//auth
router.post("/auth/register", register);
router.post("/auth/login", login);

//policies route
router.post("/policies/submit", submitPolicyAuditorRequest); // insert auth check
router.get("/policies/get", authCheck, getAllPoicies);
router.get("/policies/get-by-country", authCheck, getPoliciesByCountry);

export default router;
