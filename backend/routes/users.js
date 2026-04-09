import { Router } from "express";
import {registerClient,login,getClientProfile,updateClientProfile,changePassword,googleLogin} from "../controllers/userController.js";
import { verifyToken } from "../middlewares/auth.js";
import { validateSchema } from "../middlewares/validatorMiddleware.js";
import {registerSchema,loginSchema,updateProfileSchema,changePasswordSchema} from "../validators/userValidator.js";
import { loginLimiter, registerLimiter } from "../middlewares/rateLimiters.js";

const router = Router();

// --- Rutas Públicas ---
router.post("/register", registerLimiter, validateSchema(registerSchema), registerClient);
router.post("/login", loginLimiter, validateSchema(loginSchema), login);
router.post("/google-login", googleLogin);

// --- Rutas Privadas ---
router.get("/profile/me", verifyToken, getClientProfile);
router.put("/profile/me", verifyToken, validateSchema(updateProfileSchema), updateClientProfile);
router.patch("/profile/password", verifyToken, validateSchema(changePasswordSchema), changePassword);

export default router;