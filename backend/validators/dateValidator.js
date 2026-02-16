import { z } from "zod";

const EstadoCita = z.enum(['pendiente', 'confirmada', 'completada', 'cancelada']);

export const validateCita = (data) => {
  const schema = z.object({
    // Nuevo campo para el nombre del usuario
    
    servicio: z.string().min(1, "El nombre del servicio es obligatorio"),
    
    comentarios: z.string().max(255, "El comentario es demasiado largo").optional(),
    
    vehiculoSeleccionado: z.string().min(1, "Debes seleccionar un vehículo"),
    
    fechaCita: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Fecha inválida",
    }),

    // Estado con valor por defecto si no se envía
    estado: EstadoCita.default('pendiente'),
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