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

export const saveRating = async (req, res) => {
    const { id_producto, rating, comment } = req.body;
    const id_usuario = req.user.id; 
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Guardar o actualizar valoración
        await connection.query(`
            INSERT INTO valoraciones (id_usuario, id_producto, rating, comment)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                rating = VALUES(rating), 
                comment = VALUES(comment),
                created_at = CURRENT_TIMESTAMP
        `, [id_usuario, id_producto, rating, comment]);

        // 2. Obtener nombre del producto para la notificación
        const [prodInfo] = await connection.query("SELECT name FROM products WHERE id = ?", [id_producto]);
        const nombreProducto = prodInfo[0]?.name || "el producto";

        // 3. Notificar al CLIENTE
        await createNotification(id_usuario, 'valoración', 'cliente', { 
            producto: nombreProducto 
        });

        // 4. Actualizar promedio (tu lógica actual...)
        const [rows] = await connection.query(
            "SELECT AVG(rating) as promedio FROM valoraciones WHERE id_producto = ?",
            [id_producto]
        );
        const nuevoPromedio = rows[0].promedio || 0;

        await connection.query(
            "UPDATE products SET rating = ? WHERE id = ?",
            [nuevoPromedio, id_producto]
        );

        await connection.commit();
        res.json({ message: "Valoración guardada y notificación enviada", nuevoPromedio });

    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: "Error al procesar la valoración" });
    } finally {
        connection.release();
    }
};

export const updateService = async (req, res) => {
    const { id } = req.params;
    const { base_price, duration, name, lang, category_id, image_url, difficulty, description } = req.body;

    const connection = await db.getConnection();
    try {
        const [oldData] = await connection.query(
            `SELECT s.base_price, s.duration, st.name 
             FROM services s
             JOIN service_translations st ON s.id = st.service_id
             WHERE s.id = ? AND st.language_code = ?`, 
            [id, lang || 'es']
        );

        if (oldData.length === 0) return res.status(404).json({ message: "Servicio no encontrado" });
        const serviceBefore = oldData[0];

        await connection.beginTransaction();

        // Actualizaciones en DB...
        await connection.query(
            "UPDATE services SET category_id = ?, image_url = ?, base_price = ?, duration = ?, difficulty = ? WHERE id = ?",
            [category_id, image_url, base_price, duration, difficulty, id]
        );
        await connection.query(
            `INSERT INTO service_translations (service_id, language_code, name, description) 
             VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description)`,
            [id, lang || 'es', name, description]
        );

        // --- DETECCIÓN DE CAMBIOS ---
        const cambios = [];
        if (serviceBefore.name !== name) cambios.push(`nombre: ${name}`);
        if (parseFloat(serviceBefore.base_price) !== parseFloat(base_price)) cambios.push(`precio: ${base_price}€`);
        if (parseInt(serviceBefore.duration) !== parseInt(duration)) cambios.push(`duración: ${duration}min`);

        // Solo notificamos si hubo cambios en estos 3 campos clave
        if (cambios.length > 0) {
            await createNotification(req.user.id, 'servicio_actualizado', 'admin', { 
                servicio_original: serviceBefore.name,
                cambios: cambios 
            });
        }

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