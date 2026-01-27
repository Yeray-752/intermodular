import { z } from "zod";

// Regla base para contraseñas (para no repetirla)
const passwordRules = z.string()
    .min(8, "Mínimo 8 caracteres")
    .regex(/[A-Z]/, "Debe tener al menos una mayúscula")
    .regex(/[a-z]/, "Debe tener al menos una minúscula")
    .regex(/[0-9]/, "Falta un número")
    .regex(/^[A-Za-z0-9]+$/, "No se permiten caracteres especiales");

export const loginSchema = z.object({
    email: z.string().email("El formato del correo no es válido"),
    password: z.string(),
    captchaToken: z.string({ required_error: "La verificación de seguridad es obligatoria" })
});

export const registerSchema = z.object({
    nombre: z.string().min(2, "El nombre es requerido").trim(),
    apellidos: z.string().trim().optional(),
    email: z.string().email("Correo electrónico inválido"),
    password: passwordRules
});

export const workshopSchema = z.object({
    nombreTaller: z.string().min(1, "El nombre es obligatorio").trim(),
    ubicacion: z.string().min(1, "La ubicación es obligatoria").trim(),
    password: passwordRules
});

export const updateProfileSchema = z.object({
    nombre: z.string().min(2).trim().optional(),
    apellidos: z.string().trim().optional(),
    direccion: z.string().min(5).trim().optional(),
});

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "La contraseña actual es requerida"),
    newPassword: z.string()
        .min(8, "Mínimo 8 caracteres")
        .regex(/[A-Z]/, "Debe tener al menos una mayúscula")
        .regex(/[0-9]/, "Falta un número")
        .regex(/^[A-Za-z0-9]+$/, "No se permiten caracteres especiales")
});