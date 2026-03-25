import db from "../db.js";
import { createNotification } from "./notificationsController.js";

export const saveRating = async (req, res) => {
    const { id_producto, rating, comment } = req.body;
    const id_usuario = req.user?.id;

    if (!id_usuario) {
        return res.status(401).json({ error: "Usuario no autenticado" });
    }

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

        // 2. CORREGIDO: Obtener nombre desde product_translations
        // Buscamos la traducción en español o la primera que encuentre
        const lang = req.language || 'es';

        const [prodRows] = await connection.query(`
            SELECT name FROM product_translations 
            WHERE product_id = ? AND language_code = ?
            LIMIT 1
            `, [id_producto, lang]);

        const nombreProducto = prodRows[0]?.name || "el producto";

        await createNotification(
            id_usuario,
            'valoración',
            'cliente',
            { producto: nombreProducto }
        );

        // 4. Actualizar promedio en la tabla products
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
        res.json({ message: "Valoración guardada", nuevoPromedio });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error("ERROR EN SAVE_RATING:", error.message); // Ahora sí debería salir en consola
        res.status(500).json({ error: error.message });
    } finally {
        if (connection) connection.release();
    }
};

export const getProductRatings = async (req, res) => {
    const { id_producto } = req.params;
    try {
        const [rows] = await db.query(`
            SELECT 
                v.*, 
                c.nombre, 
                c.apellidos 
            FROM valoraciones v
            JOIN Cliente c ON v.id_usuario = c.id_usuario
            WHERE v.id_producto = ?
            ORDER BY v.created_at DESC
        `, [id_producto]);

        res.json(rows);
    } catch (error) {
        console.error("Error SQL Detallado:", error.message);
        res.status(500).json({ error: error.message });
    }
};

export const deleteRating = async (req, res) => {
    const { id } = req.params;
    const id_usuario = req.user.id;

    try {
        const [result] = await db.query(
            "DELETE FROM valoraciones WHERE id = ? AND id_usuario = ?",
            [id, id_usuario]
        );

        if (result.affectedRows === 0) {
            return res.status(403).json({ error: "No tienes permiso para borrar esto" });
        }

        // NOTIFICACIÓN AL CLIENTE
        await createNotification(id_usuario, 'valoracion_borrada', 'cliente', {});

        res.json({ message: "Valoración eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar la valoración" });
    }
};