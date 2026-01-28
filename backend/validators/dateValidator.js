import { z } from "zod";

// Coincidiendo con los ENUM de tu base de datos MariaDB
const EstadoCita = z.enum(['pendiente', 'aceptada', 'cancelada', 'finalizada']);

export const validateCita = (data) => {
  const schema = z.object({
    // La matrícula es clave según tu tabla
    matricula_vehiculo: z.string().min(1, "La matrícula es obligatoria").max(15),
    
    // Validamos que sea una fecha válida y no sea en el pasado
    fecha: z.string().refine((val) => {
        const date = new Date(val);
        return !isNaN(date.getTime()) && date > new Date();
    }, {
      message: "La fecha debe ser válida y posterior a hoy",
    }),
    
    // 'motivo' en la BD es varchar(255)
    motivo: z.string().max(255, "El motivo es demasiado largo").optional().default("Sin motivo especificado")
  });

  return schema.safeParse(data);
};

export const validateUpdateEstadoCita = (data) => {
  const schema = z.object({
    id: z.coerce.number().int().positive(),
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