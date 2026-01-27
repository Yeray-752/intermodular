import db from "../db.js";

export const saveRating = async (req, res) => {
    const { id_producto, rating, comment } = req.body;
    const id_usuario = req.user.id; 
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Insertar o Actualizar la valoración
        await connection.query(`
            INSERT INTO valoraciones (id_usuario, id_producto, rating, comment)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                rating = VALUES(rating), 
                comment = VALUES(comment),
                created_at = CURRENT_TIMESTAMP
        `, [id_usuario, id_producto, rating, comment]);

        // 2. Calcular la media actual de este producto
        const [rows] = await connection.query(
            "SELECT AVG(rating) as promedio FROM valoraciones WHERE id_producto = ?",
            [id_producto]
        );
        const nuevoPromedio = rows[0].promedio || 0;

        // 3. Actualizar la tabla 'products' con el nuevo promedio
        await connection.query(
            "UPDATE products SET rating = ? WHERE id = ?",
            [nuevoPromedio, id_producto]
        );

        await connection.commit();
        res.json({ message: "Valoración guardada y promedio actualizado", nuevoPromedio });

    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ error: "Error al procesar la valoración" });
    } finally {
        connection.release();
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
    const { id } = req.params; // ID de la valoración
    const id_usuario = req.user.id; // Para seguridad

    try {
        // Solo permitimos borrar si la valoración pertenece al usuario
        const [result] = await db.query(
            "DELETE FROM valoraciones WHERE id = ? AND id_usuario = ?",
            [id, id_usuario]
        );

        if (result.affectedRows === 0) {
            return res.status(403).json({ error: "No tienes permiso para borrar esto" });
        }

        res.json({ message: "Valoración eliminada" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar la valoración" });
    }
};