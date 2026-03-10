import { Router } from "express";
import { registerClient, login, getClientProfile, updateClientProfile, changePassword, googleLogin } from "../controllers/userController.js";
import { verifyToken } from "../middlewares/auth.js";
import { validateSchema } from "../middlewares/validatorMiddleware.js";
import { registerSchema, loginSchema, updateProfileSchema, changePasswordSchema } from "../validators/userValidator.js";
import { loginLimiter } from "../middlewares/rateLimiters.js";

const router = Router();

// --- Rutas Públicas ---
router.post("/register", validateSchema(registerSchema), registerClient);
router.post("/login", loginLimiter, validateSchema(loginSchema), login);

// --- Rutas Privadas (Requieren Token) ---
router.get("/profile/me", verifyToken, getClientProfile);

// Actualizar datos básicos
router.patch("/profile/me",
    verifyToken,
    validateSchema(updateProfileSchema),
    updateClientProfile
);

// Cambiar contraseña
router.patch("/profile/password",
    verifyToken,
    validateSchema(changePasswordSchema),
    changePassword
);

router.post("/google-login", googleLogin);

export default router;