import { z } from "zod";

const EstadoCompra = z.enum(['pendiente', 'pagado', 'en_proceso', 'enviado', 'entregado', 'cancelado']);

import { z } from "zod";

export const validateCompra = (data) => {
  const schema = z.object({
    id_producto: z.number().int().positive("ID de producto no válido"),
    fecha: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Fecha inválida",
    }),
    estado: z.enum(['pendiente', 'pagado', 'en_proceso', 'enviado', 'entregado', 'cancelado']).optional()
  });

  return schema.safeParse(data);
};

export const validateUpdateEstado = (data) => {
  const schema = z.object({
    id: z.number().int().positive("ID de compra inválido"),
    estado: EstadoCompra
  });

  return schema.safeParse(data);
};