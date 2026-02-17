import db from "../db.js";
import { validateCita, validateUpdateEstadoCita } from "../validators/dateValidator.js";

export const crearCita = async (req, res) => {
    // 1. Validamos con Zod los datos que vienen del body
    const result = validateCita(req.body);

    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten().fieldErrors });
    }
    const id_usuario_real = req.user.id;
    console.log(req.user.id)
    // 2. Extraemos los datos validados
    const { 
        servicio, 
        vehiculoSeleccionado, 
        comentarios, 
        fechaCita 
    } = result.data;

    // 3. Seguridad: Datos que NO vienen del formulario, sino del TOKEN
    // Ajusta 'req.user.nombre' según cómo guardes el nombre en tu JWT
    const nombre_usuario_real = req.user.nombre || req.user.name || "Usuario";
    console.log(req.user)
    const estado_inicial = 'pendiente';

    try {
      

        const query = `
            INSERT INTO cita (
                id_usuario, 
                servicio, 
                comentarios, 
                vehiculo_seleccionado, 
                fecha_cita, 
                estado
            ) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const [dbResult] = await db.execute(query, [
            id_usuario_real, 
            servicio, 
            comentarios, 
            vehiculoSeleccionado, 
            fechaCita, 
            estado_inicial
        ]);

        res.status(201).json({
            message: "Cita creada con éxito",
            id_cita: dbResult.insertId,
            datos: {
                usuario: nombre_usuario_real,
                servicio,
                estado: estado_inicial
            }
        });
    } catch (error) {
        console.error("Error en DB:", error);
        res.status(500).json({ 
            error: "Error al crear la cita en la base de datos", 
            detalles: error.message 
        });
    }
};

export const obtenerCitasTerminadas = async (req, res) => {
    try {
        let query = 'SELECT * FROM cita';
        let params = [];

        // Lógica de privacidad:
        // Si no es admin, filtramos para que solo vea SUS propias citas
        if (req.user.rol !== 'admin') {
            query += ' WHERE id_usuario = ? AND estado = "completada" OR estado = "cancelada"';
            params.push(req.user.id);
        }

        const [rows] = await db.execute(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener citas" });
    }
};

export const obtenerCitasActivas = async (req, res) => {
    try {
        let query = 'SELECT * FROM cita';
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
            'SELECT id_usuario, estado FROM cita WHERE id = ?', 
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
            'UPDATE cita SET estado = ? WHERE id = ?', 
            ['cancelada', id]
        );

        res.json({ message: "Cita cancelada correctamente por el usuario" });
    } catch (error) {
        res.status(500).json({ error: "Error al cancelar la cita", detalles: error.message });
    }
};