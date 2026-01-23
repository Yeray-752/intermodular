import { Router } from "express";
import { registerClient, login, getClientProfile, updateClientProfile, changePassword } from "../controllers/userController.js";
import { verifyToken } from "../middleware/auth.js";
import { validateSchema } from "../middleware/validatorMiddleware.js";
import { registerSchema, loginSchema, updateProfileSchema, changePasswordSchema } from "../validators/userValidator.js";

const router = Router();

// --- Rutas Públicas ---
router.post("/register", validateSchema(registerSchema), registerClient);
router.post("/login", validateSchema(loginSchema), login);

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

export default router;