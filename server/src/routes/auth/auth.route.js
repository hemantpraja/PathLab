import { Router } from "express";
import { adminSignup, adminSignin, verifyEmail, resendOTP, getAdminDetails, updateAdminProfile } from "../../controllers/auth/auth.controller.js";
import { authorize, authenticate } from "../../middlewares/auth.middleware.js";
const router = Router();


router.post("/adminSignup", adminSignup);
router.post("/adminSignin", adminSignin);
router.post("/verifyEmail", verifyEmail);
router.post("/resendOTP", resendOTP);
router.post("/getAdminDetails", getAdminDetails);
router.post("/updateAdminProfile", updateAdminProfile);
router.get("/", authenticate, authorize);

export default router;