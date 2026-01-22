import { Router } from "express";
import { registerClient, login, getClientProfile } from "../controllers/userController.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();

router.post("/register", registerClient);
router.post("/login", login);

router.get("/profile/me", verifyToken, getClientProfile);

export default router;