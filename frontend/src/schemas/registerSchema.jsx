import { z } from "zod";

export const registerSchema = z.object({
  nombre: z.string().min(2, "El nombre es requerido").trim(),
  apellidos: z.string().trim().optional(), // Opcional
  email: z.string().email("Correo electrónico inválido"),
  password: z.string()
    .min(8, "Mínimo 8 caracteres")
    .regex(/[A-Z]/, "Falta una mayúscula")
    .regex(/[0-9]/, "Falta un número")
    .regex(/^[A-Za-z0-9]+$/, "No se permiten caracteres especiales") // Tu regla específica
});