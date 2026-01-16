import db from "../db.js";

export const getCategories = async (req, res) => {
  const lang = req.lang || 'es'; // 'es' o 'en' que viene del middleware

  try {
    // 1. Traemos todas las filas de la tabla nueva
    const [rows] = await db.query("SELECT id, slug, names FROM product_categories");

    // 2. Mapeamos los resultados para extraer solo el nombre en el idioma actual
    const categoriasFormateadas = rows.map(row => {
      // Parseamos el string JSON de la columna 'names'
      const translations = typeof row.names === 'string' ? JSON.parse(row.names) : row.names;
      
      return {
        id: row.id,
        slug: row.slug,
        // Si no existe el idioma pedido, ponemos el español por defecto
        name: translations[lang] || translations['es'] 
      };
    });

    res.json(categoriasFormateadas);
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    res.status(500).json({ error: "Error al procesar las categorías" });
  }
};

export const createCategory = async (req, res) => {
  const { slug, name_es, name_en } = req.body;
  
  const namesJson = JSON.stringify({
    es: name_es,
    en: name_en
  });

  try {
    await db.query(
      "INSERT INTO product_categories (slug, names) VALUES (?, ?)",
      [slug, namesJson]
    );
    res.status(201).json({ message: "Categoría creada con éxito" });
  } catch (error) {
    res.status(500).json({ error: "Error al crear" });
  }
};

export const deleteCategory = async (req, res) => {
    const { id } = req.params;
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Verificamos si hay productos usando esta categoría
        const [products] = await connection.execute(
            "SELECT id FROM products WHERE category_id = ? LIMIT 1",
            [id]
        );

        if (products.length > 0) {
            await connection.rollback();
            return res.status(400).json({
                message: "No puedes borrar una categoría que tiene productos asociados. Mueve o borra los productos primero."
            });
        }

        // 2. Borrar las traducciones (si no tienes ON DELETE CASCADE)
        await connection.execute("DELETE FROM category_translations WHERE category_id = ?", [id]);

        // 3. Borrar la categoría principal
        const [result] = await connection.execute("DELETE FROM product_categories WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ message: "Categoría no encontrada." });
        }

        await connection.commit();
        res.json({ message: "Categoría eliminada correctamente." });

    } catch (error) {
        await connection.rollback();
        console.error("Error al borrar categoría:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    } finally {
        connection.release();
    }
};