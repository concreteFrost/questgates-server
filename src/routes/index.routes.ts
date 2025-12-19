import { Router } from "express";
import { submitPolicyAuditorRequest } from "controllers/submit.controller";

const router: Router = Router();
router.post("/submit", submitPolicyAuditorRequest);

export default router;
