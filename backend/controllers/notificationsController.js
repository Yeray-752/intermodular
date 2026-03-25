import db from "../db.js";

export const getNotificationsByID = async (req, res) => {
    try {
        const lang = req.headers['accept-language']?.split(',')[0] || 'es';

        const [rows] = await db.execute(`
            SELECT 
                n.*,
                pt.name AS producto_nombre
            FROM Notificaciones n
            LEFT JOIN product_translations pt 
                ON pt.product_id = JSON_UNQUOTE(JSON_EXTRACT(n.parametros, '$.producto_id'))
                AND pt.language_code = ?
            WHERE n.id_usuario = ?
            ORDER BY n.creado_en DESC
        `, [lang, req.user.id]);

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener notificaciones" });
    }
};

export const getNotificationsAdmin = async (req, res) => {
    try {
        const lang = req.headers['accept-language']?.split(',')[0] || 'es';

        const [rows] = await db.execute(`
            SELECT 
                n.*,
                pt.name AS producto_nombre
            FROM Notificaciones n
            LEFT JOIN product_translations pt 
                ON pt.product_id = JSON_UNQUOTE(JSON_EXTRACT(n.parametros, '$.producto_id'))
                AND pt.language_code = ?
            WHERE n.rol = 'admin'
            ORDER BY n.creado_en DESC
        `, [lang]);

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener notificaciones de admin" });
    }
};

export const markAsRead = async (req, res) => {
    const id = parseInt(req.params.id); // Forzamos a número
    const userId = req.user.id;         // Asegúrate de que esto sea el ID numérico

    try {
        const [result] = await db.execute(
            'UPDATE Notificaciones SET leido = TRUE WHERE id = ? AND id_usuario = ?',
            [id, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "No se encontró la notificación o no te pertenece" });
        }

        res.json({ message: "Notificación leída" });
    } catch (error) {
        console.error("Error SQL:", error);
        res.status(500).json({ error: "Error al actualizar" });
    }
};

export const createNotification = async (id_usuario, tipo, rol, data = {}) => {
    try {
        await db.execute(
            'INSERT INTO Notificaciones (id_usuario, tipo, rol, parametros, leido) VALUES (?, ?, ?, ?, 0)',
            [id_usuario, tipo, rol, JSON.stringify(data)]
        );
    } catch (error) {
        console.error("Error al crear notificación:", error);
        // Ojo: Si lanzas 'throw error' aquí, se cancelará la transacción del checkout.
        // Si prefieres que el pedido se cree aunque falle el aviso, quita el throw.
        throw error; 
    }
};

export const getUnreadCount = async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT COUNT(*) as count FROM Notificaciones WHERE id_usuario = ? AND leido = 0',
            [req.user.id]
        );
        
        res.json({ count: rows[0].count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al contar notificaciones" });
    }
};

export const markReadAll = async (req, res) => {
    const userId = req.user.id;

    try {
        await db.execute(
            'UPDATE Notificaciones SET leido = 1 WHERE id_usuario = ? AND leido = 0',
            [userId]
        );
        res.json({ message: "Todas las notificaciones marcadas como leídas" });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar todas" });
    }
};