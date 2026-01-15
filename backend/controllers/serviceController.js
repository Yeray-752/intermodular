import db from "../db.js";

export const getServices = async (req, res) => {
  const lang = req.lang; // Viene del middleware

  try {
    const query = `
      SELECT 
        s.*,
        st.name, 
        st.description
      FROM services s
      INNER JOIN service_translations st ON s.id = st.service_id
      WHERE st.language_code = ?
    `;

    const [rows] = await db.query(query, [lang]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "No services found for this language" });
    }

    res.json(rows);
  } catch (error) {
    console.error("Error en getServices:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};