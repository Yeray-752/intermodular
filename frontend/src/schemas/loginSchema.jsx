import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("El formato del correo no es válido"),
  password: z.string()
    .min(8, "Mínimo 8 caracteres")
    .regex(/[A-Z]/, "Debe tener al menos una mayúscula")
    .regex(/[a-z]/, "Debe tener al menos una minúscula")
    .regex(/[0-9]/, "Falta un número")
    .regex(/^[A-Za-z0-9]+$/, "No se permiten caracteres especiales") // Tu regla específica
});