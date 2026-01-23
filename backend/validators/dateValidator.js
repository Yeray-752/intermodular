import { z } from "zod";

const EstadoCita = z.enum(['pendiente', 'confirmada', 'completada', 'cancelada']);

export const validateCita = (data) => {
  const schema = z.object({
    id_servicio: z.number().int().positive("Servicio no válido"),
    fecha: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Fecha inválida (YYYY-MM-DD)",
    }),
    hora: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato de hora inválido (HH:mm)"),
    notas: z.string().max(255).optional()
  });

  return schema.safeParse(data);
};

export const validateUpdateEstadoCita = (data) => {
  const schema = z.object({
    id: z.coerce.number().int().positive(), // Coerce convierte string de params a número
    estado: EstadoCita
  });
  return schema.safeParse(data);
};

export const validateIdParam = (data) => {
  const schema = z.object({
    id: z.coerce.number().int().positive("ID de cita no válido")
  });
  return schema.safeParse(data);
};