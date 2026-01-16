import { z } from "zod";

const translationSchema = z.object({
  es: z.string().min(1, "El nombre en español es obligatorio"),
  en: z.string().optional()
});

export const validateProduct = (data) => {
  const schema = z.object({
    price: z.number().positive(),
    stock: z.number().int().nonnegative(),
    category_id: z.number().int(),
    name: translationSchema,
    description: translationSchema
  });

  return schema.safeParse(data);
};