import db from '../config/db.js';

export const verificarPropiedadVehiculo = async (req, res, next) => {
    const { id_usuario, matricula_vehiculo } = req.body;

    try {
        const [rows] = await db.execute(
            'SELECT * FROM Vehiculo WHERE matricula = ? AND id_usuario = ?',
            [matricula_vehiculo, id_usuario]
        );

        if (rows.length === 0) {
            return res.status(403).json({ 
                message: "El vehículo no existe o no pertenece a este usuario." 
            });
        }
        next();
    } catch (error) {
        res.status(500).json({ error: "Error al verificar vehículo" });
    }
};