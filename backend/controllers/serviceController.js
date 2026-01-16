import db from "../db.js";

export const getServices = async (req, res) => {
    const lang = req.lang || 'es'; // Extraído por tu middleware de idioma

    try {
        const query = `
            SELECT 
                s.id, 
                s.category_id, 
                s.image_url, 
                s.base_price as price, 
                s.duration, 
                s.difficulty,
                st.name, 
                st.description
            FROM services s
            JOIN service_translations st ON s.id = st.service_id
            WHERE st.language_code = ?
        `;
        const [rows] = await db.query(query, [lang]);
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener servicios:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
};