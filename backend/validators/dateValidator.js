import { z } from "zod";

const EstadoCita = z.enum(['pendiente','procesando','completada','cancelada']);

import { z } from "zod";

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