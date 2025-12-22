import { Router } from "express";
import {
  getAllPoicies,
  submitPolicyAuditorRequest,
} from "controllers/policies.controller";

const router: Router = Router();
router.post("/policies/submit", submitPolicyAuditorRequest);
router.get("/policies/get", getAllPoicies);

export default router;
