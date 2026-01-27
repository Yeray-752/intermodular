import { z } from "zod";

const EstadoCompra = z.enum(['pendiente', 'pagado', 'en_proceso', 'enviado', 'entregado', 'cancelado']);

export const validateCompra = (data) => {
  const schema = z.object({
    // Esperamos un array de productos
    productos: z.array(
      z.object({
        id_producto: z.number().int().positive(),
        cantidad: z.number().int().positive()
      })
    ).min(1, "El carrito no puede estar vacío"),
    fecha: z.string().optional(), // La fecha la puede poner el servidor por defecto
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