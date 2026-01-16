import db from "../db.js";

export const getServiceCategories = async (req, res) => {
    const lang = req.lang || 'es';

    try {
        const [rows] = await db.query("SELECT id, slug, names FROM service_categories");

        const categoriasFormateadas = rows.map(row => {
            const translations = typeof row.names === 'string' ? JSON.parse(row.names) : row.names;
            return {
                id: row.id,
                slug: row.slug,
                name: translations[lang] || translations['es']
            };
        });

        res.json(categoriasFormateadas);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener categorías de servicios" });
    }
};