import db from "../db.js";

export const getNotifications = async (req, res) => {
    try {
        // Obtenemos notificaciones del usuario logueado, las más recientes primero
        const [rows] = await db.execute(
            'SELECT * FROM Notificaciones WHERE id_usuario = ? ORDER BY creado_en DESC',
            [req.user.id]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener notificaciones" });
    }
};

export const markAsRead = async (req, res) => {
    const { id } = req.params;
    try {
        // Solo el dueño de la notificación puede marcarla como leída
        const [result] = await db.execute(
            'UPDATE Notificaciones SET leido = TRUE WHERE id = ? AND id_usuario = ?',
            [id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Notificación no encontrada" });
        }

        res.json({ message: "Notificación leída" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar notificación" });
    }
};