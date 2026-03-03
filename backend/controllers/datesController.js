import db from "../db.js";
import { validateCita } from "../validators/dateValidator.js";

export const obtenerCitas = async (req, res) => {
    try {
        let query = 'SELECT * FROM Cita';
        let params = [];

        if (req.user.rol !== 'admin') {
            query += ' WHERE id_usuario = ?';
            params.push(req.user.id);
        }

        const [rows] = await db.execute(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener citas" });
    }
};
const enviarNotificacion = async (id_usuario, titulo, mensaje, categoria) => {
    try { 
        await db.execute(
            `INSERT INTO Notificaciones (id_usuario, titulo, mensaje, categoria) VALUES (?, ?, ?, ?)`,
            [id_usuario, titulo, mensaje, categoria]
        );
    } catch (error) {
        console.error("Error silencioso al crear notificación:", error);
    }
};

export const crearCita = async (req, res) => {
    const result = validateCita(req.body);
    if (!result.success) return res.status(400).json({ errors: result.error.flatten().fieldErrors });

    const id_user = req.user.id;
    const { matricula_vehiculo, fecha, motivo } = req.body;

    try {
        const query = `INSERT INTO Cita (id_usuario, matricula_vehiculo, fecha, motivo, estado) VALUES (?, ?, ?, ?, 'pendiente')`;
        const [dbResult] = await db.execute(query, [id_user, matricula_vehiculo, fecha, motivo]);


        await createNotification(id_user, 'cita', 'cliente', { fecha: fecha });

        res.status(201).json({ message: "Cita creada", id_cita: dbResult.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const actualizarEstadoCita = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    try {
        // Necesitamos la fecha para la plantilla del cliente
        const [cita] = await db.execute(
            'SELECT id_usuario, fecha FROM Cita WHERE id_cita = ?', 
            [id]
        );
        
        if (cita.length === 0) return res.status(404).json({ message: "Cita no encontrada" });

        await db.execute('UPDATE Cita SET estado = ? WHERE id_cita = ?', [estado, id]);

        // NOTIFICACIÓN AL CLIENTE
        // Usamos la clave 'cita_estado' que definiste en tus plantillas
        await createNotification(
            cita[0].id_usuario, 
            'cita_estado', 
            'cliente', 
            { 
                fecha: cita[0].fecha, 
                estado: estado 
            }
        );

        res.json({ message: "Estado actualizado y cliente notificado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const cancelarCita = async (req, res) => {
    const { id } = req.params;
    const id_usuario_token = req.user.id;
    const esAdmin = req.user.rol === 'admin';

    try {
        const [cita] = await db.execute(
            'SELECT id_usuario, fecha FROM Cita WHERE id_cita = ?', 
            [id]
        );
        
        if (cita.length === 0) return res.status(404).json({ message: "Cita no encontrada" });

        if (!esAdmin && cita[0].id_usuario !== id_usuario_token) {
            return res.status(403).json({ message: "No autorizado" });
        }

        await db.execute('UPDATE Cita SET estado = ? WHERE id_cita = ?', ['cancelada', id]);

        // LÓGICA DE NOTIFICACIONES REFINADA
        if (esAdmin) {
            // El admin cancela -> Notificamos al cliente
            await createNotification(
                cita[0].id_usuario, 
                'cita_cancelada', 
                'cliente', 
                { fecha: cita[0].fecha }
            );
        } else {
            // El cliente cancela -> Notificamos al admin (ID 1 por ahora)
            await createNotification(
                1, 
                'cita_cancelada_admin', 
                'admin', 
                { 
                    fecha: cita[0].fecha, 
                    usuario: id_usuario_token 
                }
            );
        }

        res.json({ message: "Cita cancelada correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};