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

export const createService = async (req, res) => {
    const { category_id, base_price, duration, difficulty, name, description } = req.body;
    
    // Si se subió imagen, guardamos la ruta relativa para la base de datos
    // Ejemplo: /uploads/services/170612345-aceite.jpg
    const image_url = req.file ? `/uploads/services/${req.file.filename}` : null;

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const [servResult] = await connection.query(
            "INSERT INTO services (category_id, image_url, base_price, duration, difficulty) VALUES (?, ?, ?, ?, ?)",
            [category_id, image_url, base_price, duration, difficulty]
        );

        await connection.query(
            "INSERT INTO service_translations (service_id, language_code, name, description) VALUES (?, ?, ?, ?)",
            [servResult.insertId, 'es', name, description]
        );

        await connection.commit();
        res.status(201).json({ message: "Servicio creado con imagen", id: servResult.insertId });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: "Error al crear servicio con imagen" });
    } finally {
        connection.release();
    }
};

export const updateService = async (req, res) => {
    const { id } = req.params;
    const { category_id, image_url, base_price, duration, difficulty, name, description, lang } = req.body;

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Actualizar datos técnicos
        await connection.query(
            "UPDATE services SET category_id = ?, image_url = ?, base_price = ?, duration = ?, difficulty = ? WHERE id = ?",
            [category_id, image_url, base_price, duration, difficulty, id]
        );

        // 2. Actualizar o Insertar traducción (Upsert)
        // Esto permite actualizar el nombre/descripción en el idioma que se esté editando
        await connection.query(
            `INSERT INTO service_translations (service_id, language_code, name, description) 
             VALUES (?, ?, ?, ?) 
             ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description)`,
            [id, lang || 'es', name, description]
        );

        await connection.commit();
        res.json({ message: "Servicio actualizado correctamente" });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: "Error al actualizar" });
    } finally {
        connection.release();
    }
};

export const deleteService = async (req, res) => {
    const { id } = req.params;
    try {
        // Si tienes ON DELETE CASCADE en la BD, se borrarán las traducciones solas.
        // Si no, borra primero las traducciones:
        await db.query("DELETE FROM service_translations WHERE service_id = ?", [id]);
        await db.query("DELETE FROM services WHERE id = ?", [id]);
        
        res.json({ message: "Servicio eliminado" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar" });
    }
};