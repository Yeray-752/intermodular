import { z } from "zod";

const EstadoCita = z.enum(['pendiente','procesando','completada','cancelada']);

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
console.log(data)
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
  console.log(data)
  return schema.safeParse(data);
};

export const validateIdParam = (data) => {
  const schema = z.object({
    id: z.coerce.number().int().positive("ID de cita no válido")
  });
  return schema.safeParse(data);
};