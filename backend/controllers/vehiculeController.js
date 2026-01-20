import db from '../db.js';

export const registrarVehiculo = async (req, res) => {
    const { matricula, id_usuario, marca, modelo, año } = req.body;

    if (!matricula || !id_usuario) {
        return res.status(400).json({ message: "Matrícula e ID de usuario son obligatorios" });
    }

    try {
        const query = 'INSERT INTO Vehiculo (matricula, id_usuario, marca, modelo, año) VALUES (?, ?, ?, ?, ?)';
        await db.execute(query, [matricula, id_usuario, marca, modelo, año]);
        
        res.status(201).json({ message: "Vehículo registrado con éxito", matricula });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: "La matrícula ya está registrada" });
        }
        res.status(500).json({ error: error.message });
    }
};
export const eliminarVehiculo = async (req, res) => {
    const { matricula } = req.params;

    try {
        // OJO: Si hay citas asociadas a esta matrícula, fallará por integridad referencial
        // a menos que uses ON DELETE CASCADE en tu base de datos.
        const [result] = await db.execute('DELETE FROM Vehiculo WHERE matricula = ?', [matricula]);

        if (result.affectedRows === 0) return res.status(404).json({ message: "Vehículo no encontrado" });
        
        res.json({ message: "Vehículo eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "No se puede eliminar: tiene citas asociadas" });
    }
};
export const actualizarVehiculo = async (req, res) => {
    const { matricula } = req.params; // La matrícula original para identificarlo
    const { marca, modelo, año } = req.body;

    try {
        const query = 'UPDATE Vehiculo SET marca = ?, modelo = ?, año = ? WHERE matricula = ?';
        const [result] = await db.execute(query, [marca, modelo, año, matricula]);

        if (result.affectedRows === 0) return res.status(404).json({ message: "Vehículo no encontrado" });

        res.json({ message: "Datos del vehículo actualizados" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};