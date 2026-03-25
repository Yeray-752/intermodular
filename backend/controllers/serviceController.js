import db from "../db.js";
import {createNotification} from "./notificationsController.js";

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

        await createNotification(req.user.id, 'servicio_nuevo', 'admin', { 
            servicio: name 
        });

        await connection.commit();
        res.status(201).json({ message: "Servicio creado con imagen", id: servResult.insertId });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: "Error al crear servicio" });
    } finally {
        connection.release();
    }
};



export const updateService = async (req, res) => {
    const { id } = req.params;
    const { base_price, duration, name, lang, category_id, image_url, difficulty, description } = req.body;

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // UPDATE con COALESCE (solo actualiza si viene valor, si no mantiene el actual)
        await connection.query(
            `UPDATE services 
             SET 
                category_id = COALESCE(?, category_id),
                image_url = COALESCE(?, image_url),
                base_price = COALESCE(?, base_price),
                duration = COALESCE(?, duration),
                difficulty = COALESCE(?, difficulty)
             WHERE id = ?`,
            [category_id, image_url, base_price, duration, difficulty, id]
        );

        // Traducción (también con COALESCE en el UPDATE implícito)
        await connection.query(
            `INSERT INTO service_translations (service_id, language_code, name, description) 
             VALUES (?, ?, ?, ?) 
             ON DUPLICATE KEY UPDATE 
                name = COALESCE(VALUES(name), name),
                description = COALESCE(VALUES(description), description)`,
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
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const [serviceData] = await connection.query(`
            SELECT s.base_price, s.duration, st.name 
            FROM services s
            JOIN service_translations st ON s.id = st.service_id
            WHERE s.id = ? AND st.language_code = 'es'`, 
            [id]
        );

        if (serviceData.length === 0) {
            return res.status(404).json({ message: "Servicio no encontrado" });
        }

        const { name, base_price, duration } = serviceData[0];

        await connection.query("DELETE FROM service_translations WHERE service_id = ?", [id]);
        await connection.query("DELETE FROM services WHERE id = ?", [id]);


        await createNotification(req.user.id, 'servicio_eliminado', 'admin', { 
            nombre: name,
            precio: base_price,
            duracion: duration
        });

        await connection.commit();
        res.json({ message: "Servicio eliminado correctamente y registro guardado" });

    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ error: "Error al eliminar el servicio" });
    } finally {
        connection.release();
    }
};