import db from "../db.js";

export const actualizarEstadoCita = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    try {
        const query = 'UPDATE citas SET estado = ? WHERE id_cita = ?';
        const [result] = await db.execute(query, [estado, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Cita no encontrada" });
        }

        res.json({ message: "Estado de la cita actualizado correctamente", id_cita: id, nuevoEstado: estado });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar la cita", detalles: error.message });
    }
};

export const obtenerCitas = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM citas');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener citas" });
    }
};

export const crearCita = async (req, res) => {
    delete req.body.estado; //por si acaso alguien intenta meter un estado erroneo de manera forzosa

    const { id_usuario, matricula_vehiculo, fecha, motivo } = req.body;

    if (!id_usuario || !matricula_vehiculo || !fecha) {
        return res.status(400).json({ message: "Faltan campos obligatorios (usuario, matrícula o fecha)" });
    }

    try {
        const query = `
            INSERT INTO citas (id_usuario, matricula_vehiculo, fecha, motivo) 
            VALUES (?, ?, ?, ?)
        `;

        const [result] = await db.execute(query, [id_usuario, matricula_vehiculo, fecha, motivo]);

        res.status(201).json({
            message: "Cita creada con éxito",
            id_cita: result.insertId,
            estado: 'pendiente'
        });
    } catch (error) {
        res.status(500).json({ error: "Error al crear la cita", detalles: error.message });
    }
};