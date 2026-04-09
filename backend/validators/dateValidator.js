import { z } from "zod";

const EstadoCita = z.enum(['pendiente', 'procesando', 'completada', 'cancelada']);


export const validateService = (data) => {
  const schema = z.object({
    category_id: z.coerce.number().int().positive(),
    base_price: z.coerce.number().positive(),
    duration: z.string().min(1),
    difficulty: z.enum(["baja", "media", "alta"]),
    name: z.string().min(1),
    description: z.string().optional()
  });

  return schema.safeParse(data);
};

export const validateCita = (data) => {
  const schema = z.object({
    servicio: z.string().min(1),
    comentarios: z.string().max(255).optional(),
    vehiculoSeleccionado: z.string().min(1),
    fechaCita: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Fecha inválida",
    }),

    // Estado con valor por defecto si no se envía
    estado: EstadoCita.default('pendiente'),
    base_price: z.preprocess((val) => {
      // Si llega un número, lo convierte a string con .00
      if (typeof val === 'number') return val.toFixed(2);
      // Si llega un string, intenta asegurar que tenga formato decimal
      if (typeof val === 'string') return parseFloat(val).toFixed(2);
      return val;
    }, z.string().min(1))
  });

  return schema.safeParse(data);
};

export const validaUpdate = (data) => {
  const schema = z.object({

    vehiculoSeleccionado: z.string().min(1, "Debes seleccionar un vehículo"),

    fechaCita: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Fecha inválida",
    }),


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