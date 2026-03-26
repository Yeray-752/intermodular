import db from "../db.js";
import { validateCita } from "../validators/dateValidator.js";
import { createNotification } from "./notificationsController.js";

export const obtenerCitasID = async (req, res) => {
    try {
        // Ajustamos el JOIN para usar la tabla 'Cliente'
        const query = await db.execute(`
            SELECT 
                c.*, 
                CONCAT(cl.nombre, ' ', cl.apellidos) AS nombre_cliente 
            FROM cita c
            INNER JOIN Cliente cl ON c.id_usuario = ?
        `, [req.user.id]);

        const [rows] = await db.execute(query, params);
        res.json(rows);
    } catch (error) {
        console.error("Error en la consulta SQL:", error);
        res.status(500).json({ error: "Error al obtener citas de la tabla Cliente" });
    }
};

export const actualizarCita = async (req, res) => {
    const { id } = req.params;
    const { fechaCita } = req.body; // Solo extraemos lo que cambia
    const fechaSQL = fechaCita.replace('T', ' ').substring(0, 19);
    console.log(fechaSQL)
    if (!fechaCita) {
        return res.status(400).json({ error: "La nueva fecha es obligatoria" });
    }

    try {
        const query = `
            UPDATE cita 
            SET fecha_cita = ?
            WHERE id = ?
        `;
        console.log("Ejecutando:", query, "con valores:", [fechaSQL, id]);
        const [dbResult] = await db.execute(query, [fechaSQL, id]);

        if (dbResult.affectedRows === 0) {
            return res.status(404).json({ error: "Cita no encontrada" });
        }

        res.status(200).json({ message: "Hora confirmada con éxito" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar la hora" });
    }
};

export const obtenerCitasTerminadas = async (req, res) => {
    try {
        // Ajustamos el JOIN para usar la tabla 'Cliente'
        let query = `
            SELECT 
                c.*, 
                CONCAT(cl.nombre, ' ', cl.apellidos) AS nombre_cliente 
            FROM cita c
            INNER JOIN Cliente cl ON c.id_usuario = cl.id_usuario
        `;
        let params = [];

        // Lógica de filtrado por rol
        if (req.user.rol !== 'admin') {
            // Usuario normal: Solo sus citas completadas o canceladas
            query += ' WHERE c.id_usuario = ? AND (c.estado = "completada" OR c.estado = "cancelada")';
            params.push(req.user.id);
        } else {
            // Admin: Todas las citas completadas o canceladas de todos los clientes
            query += ' WHERE c.estado = "completada" OR c.estado = "cancelada"';
        }

        const [rows] = await db.execute(query, params);
        res.json(rows);
    } catch (error) {
        console.error("Error en la consulta SQL:", error);
        res.status(500).json({ error: "Error al obtener citas de la tabla Cliente" });
    }
};
export const obtenerCitasAdmin = async (req, res) => {
    try {
        const query = `
            SELECT c.*, CONCAT(cl.nombre, ' ', cl.apellidos) AS nombre_cliente 
            FROM cita c
            INNER JOIN Cliente cl ON c.id_usuario = cl.id_usuario
            WHERE c.estado = "pendiente"
            ORDER BY c.fecha_cita ASC
        `;

        const [rows] = await db.execute(query);
        res.json(rows);
    } catch (error) {
        console.error("Error SQL Admin:", error);
        res.status(500).json({ error: "Error al cargar panel de administración" });
    }
};

export const obtenerCitasActivas = async (req, res) => {
    try {
        let query = 'SELECT * FROM cita';
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

export const crearCita = async (req, res) => {
    const result = validateCita(req.body);
    if (!result.success) return res.status(400).json({ errors: result.error.flatten().fieldErrors });
    const estado_inicial = 'pendiente';
    console.log('parte 2')

    const id_user = req.user.id;
    const { servicio,
        vehiculoSeleccionado,
        comentarios,
        fechaCita } = req.body;

    try {
        const query = `INSERT INTO cita (id_usuario, servicio, comentarios, vehiculo_seleccionado, fecha_cita, estado) VALUES (?, ?, ?, ?, ?, ?)`;
        const [dbResult] = await db.execute(query, [id_user, servicio, comentarios, vehiculoSeleccionado, fechaCita, estado_inicial]);

        console.log('Cita insertada, creando notificación...');

        // OJO AQUÍ: Asegúrate que la propiedad se llame 'fecha' (como espera tu plantilla)
        // y usa la variable 'fechaCita' que desestructuraste arriba
        await createNotification(id_user, 'cita', 'cliente', { fecha: fechaCita });

        res.status(201).json({ message: "Cita creada", id_cita: dbResult.insertId });
    } catch (error) {
        console.error("Error en el proceso de cita:", error); // Esto te dirá el error real en la consola
        res.status(500).json({ error: error.message });
    }
};

export const actualizarEstadoCita = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.params;
    console.log(id, estado)
    try {
        const query = 'UPDATE cita SET estado = ? WHERE id = ?';
        const [result] = await db.execute(query, [estado, id]);


        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Cita no encontrada" });
        }

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
            'SELECT id_usuario, estado FROM cita WHERE id = ?',
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
        res.status(500).json({ error: error.message });
    }
};

export const obtenerCitasEnProceso = async (req, res) => {
    try {
        const query = `
            SELECT c.*, CONCAT(cl.nombre, ' ', cl.apellidos) AS nombre_cliente 
            FROM cita c
            INNER JOIN Cliente cl ON c.id_usuario = cl.id_usuario
            WHERE c.estado = "procesando"
        `;

        const [rows] = await db.execute(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener citas en proceso" });
    }
};