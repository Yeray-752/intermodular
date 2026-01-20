import { z } from "zod";

export const workshopSchema = z.object({
  nombreTaller: z
    .string()
    .min(1, "El nombre es obligatorio")
    .trim(),
  ubicacion: z
    .string()
    .min(1, "La ubicación es obligatoria")
    .trim(),
  password: z
    .string()
    .min(8, "Mínimo 8 caracteres")
    .regex(/[A-Z]/, "Falta una mayúscula")
    .regex(/[0-9]/, "Falta un número")
    .regex(/^[A-Za-z0-9]+$/, "No se permiten caracteres especiales")
});