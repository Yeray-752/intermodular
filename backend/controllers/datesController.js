import db from "../db.js";
import { validateCita } from "../validators/dateValidator.js";

export const obtenerCitas = async (req, res) => {
    try {
        let query = 'SELECT * FROM Cita'; // O 'citas', según tu tabla
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

    const id_usuario_real = req.user.id;
    const { matricula_vehiculo, fecha, motivo } = req.body;

    try {
        // IMPORTANTE: He cambiado "citas" por "Cita" para que coincida con tu DESC
        const query = `INSERT INTO Cita (id_usuario, matricula_vehiculo, fecha, motivo, estado) VALUES (?, ?, ?, ?, 'pendiente')`;
        const [dbResult] = await db.execute(query, [id_usuario_real, matricula_vehiculo, fecha, motivo]);

        // Notificar al ADMIN (Asumimos ID 1 o rol admin)
        await enviarNotificacion(
            1, 
            "Nueva Cita", 
            `El usuario ${id_usuario_real} ha solicitado una cita para el vehículo ${matricula_vehiculo}`, 
            'cita'
        );

        res.status(201).json({ message: "Cita creada", id_cita: dbResult.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const actualizarEstadoCita = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    try {
        const [cita] = await db.execute('SELECT id_usuario, matricula_vehiculo FROM Cita WHERE id_cita = ?', [id]);
        if (cita.length === 0) return res.status(404).json({ message: "Cita no encontrada" });

        await db.execute('UPDATE Cita SET estado = ? WHERE id_cita = ?', [estado, id]);

        // Notificar al CLIENTE sobre el cambio (Aceptada, Finalizada, etc.)
        let titulo = estado === 'aceptada' ? "Cita Confirmada" : "Actualización de Cita";
        await enviarNotificacion(
            cita[0].id_usuario, 
            titulo, 
            `Tu cita para el vehículo ${cita[0].matricula_vehiculo} ahora está: ${estado}`, 
            'cita'
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
        const [cita] = await db.execute('SELECT id_usuario, estado FROM Cita WHERE id_cita = ?', [id]);
        if (cita.length === 0) return res.status(404).json({ message: "Cita no encontrada" });

        // Seguridad: El usuario solo cancela la suya, el Admin cancela cualquiera
        if (!esAdmin && cita[0].id_usuario !== id_usuario_token) {
            return res.status(403).json({ message: "No autorizado" });
        }

        await db.execute('UPDATE Cita SET estado = ? WHERE id_cita = ?', ['cancelada', id]);

        // Si el Admin cancela -> Notifica al Cliente. Si el Cliente cancela -> Notifica al Admin.
        if (esAdmin) {
            await enviarNotificacion(cita[0].id_usuario, "Cita Cancelada", "El taller ha cancelado tu cita.", 'cita');
        } else {
            await enviarNotificacion(1, "Cita Cancelada por Cliente", `El cliente ha cancelado la cita #${id}`, 'cita');
        }

        res.json({ message: "Cita cancelada correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};