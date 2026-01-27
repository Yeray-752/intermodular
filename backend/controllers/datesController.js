import db from "../db.js";
import { validateCita, validateUpdateEstadoCita } from "../validators/dateValidator.js";

export const crearCita = async (req, res) => {
    // 1. Validamos con Zod (id_usuario ya no se pide en el body del validador)
    const result = validateCita(req.body);

    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten().fieldErrors });
    }

    // 2. Seguridad: El ID viene del TOKEN, no del body del formulario
    const id_usuario_real = req.user.id;
    const { matricula_vehiculo, fecha, motivo } = result.data;

    try {
        const query = `
            INSERT INTO citas (id_usuario, matricula_vehiculo, fecha, motivo) 
            VALUES (?, ?, ?, ?)
        `;

        const [dbResult] = await db.execute(query, [id_usuario_real, matricula_vehiculo, fecha, motivo]);

        res.status(201).json({
            message: "Cita creada con éxito",
            id_cita: dbResult.insertId,
            estado: 'pendiente'
        });
    } catch (error) {
        res.status(500).json({ error: "Error al crear la cita", detalles: error.message });
    }
};

export const obtenerCitas = async (req, res) => {
    try {
        let query = 'SELECT * FROM citas';
        let params = [];

        // Lógica de privacidad:
        // Si no es admin, filtramos para que solo vea SUS propias citas
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

export const actualizarEstadoCita = async (req, res) => {
    // La validación de Zod ya se hizo en el middleware de la ruta
    const { id } = req.params;
    const { estado } = req.body;

    try {
        const query = 'UPDATE citas SET estado = ? WHERE id_cita = ?';
        const [result] = await db.execute(query, [estado, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Cita no encontrada" });
        }

        res.json({ message: "Estado actualizado", id_cita: id, nuevoEstado: estado });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar", detalles: error.message });
    }
};

export const cancelarCita = async (req, res) => {
    const { id } = req.params;
    const id_usuario_token = req.user.id;

    try {
        // 1. Buscamos la cita y verificamos si le pertenece al usuario
        const [cita] = await db.execute(
            'SELECT id_usuario, estado FROM citas WHERE id_cita = ?', 
            [id]
        );

        if (cita.length === 0) {
            return res.status(404).json({ message: "Cita no encontrada" });
        }

        // 2. Verificamos que el id_usuario de la cita coincida con el del Token
        if (cita[0].id_usuario !== id_usuario_token) {
            return res.status(403).json({ message: "No tienes permiso para cancelar esta cita" });
        }

        // 3. (Opcional) Evitar cancelar citas que ya pasaron o ya están completadas
        if (cita[0].estado !== 'pendiente') {
            return res.status(400).json({ message: "Solo se pueden cancelar citas en estado pendiente" });
        }

        // 4. Procedemos a la cancelación
        await db.execute(
            'UPDATE citas SET estado = ? WHERE id_cita = ?', 
            ['cancelada', id]
        );

        res.json({ message: "Cita cancelada correctamente por el usuario" });
    } catch (error) {
        res.status(500).json({ error: "Error al cancelar la cita", detalles: error.message });
    }
};