import db from "../db.js";

export const getProducts = async (req, res) => {
  // req.lang viene de tu languageMiddleware ('es' o 'en')
  const lang = req.lang; 

  try {
    const query = `
      SELECT 
        p.*,
        t.name, 
        t.description
      FROM products p
      LEFT JOIN product_translations t 
        ON p.id = t.product_id 
      WHERE t.language_code = ?
    `;

    const [rows] = await db.query(query, [lang]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "No se encontraron productos para este idioma." });
    }

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};