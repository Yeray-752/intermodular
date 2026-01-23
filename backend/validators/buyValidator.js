import { z } from "zod";

// Definimos los estados permitidos como un Enum de Zod
const EstadoCompra = z.enum(['pendiente', 'pagado', 'en_proceso', 'enviado', 'entregado', 'cancelado']);

// Esquema para creación de compra
export const validateCompra = (data) => {
  const schema = z.object({
    id_usuario: z.number().int().positive("El ID de usuario debe ser un número positivo"),
    id_producto: z.number().int().positive("El ID de producto debe ser un número positivo"),
    fecha: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Debe ser una fecha válida (YYYY-MM-DD)",
    }),
    estado: EstadoCompra.optional().default('pendiente')
  });

  return schema.safeParse(data);
};

// Esquema para actualizar el estado (PATCH)
export const validateUpdateEstado = (data) => {
  const schema = z.object({
    id: z.number().int().positive("ID de compra inválido"), // Este vendrá de req.params
    estado: EstadoCompra // El estado es obligatorio en este schema
  });

  return schema.safeParse(data);
};