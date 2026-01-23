import db from "../db.js";

export const getCompras = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Compra');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener compras", error });
    }
};

export const createCompra = async (req, res) => {
    const { id_usuario, id_producto, fecha, estado } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO Compra (id_usuario, id_producto, fecha, estado) VALUES (?, ?, ?, ?)',
            [id_usuario, id_producto, fecha, estado || 'pendiente']
        );
        res.status(201).json({ id: result.insertId, message: "Compra creada con éxito" });
    } catch (error) {
        res.status(500).json({ message: "Error al crear compra", error });
    }
};

export const updateEstadoCompra = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    try {
        const [result] = await db.query(
            'UPDATE Compra SET estado = ? WHERE id = ?',
            [estado, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Compra no encontrada" });
        }

        res.json({ 
            message: `Estado de la compra ${id} actualizado a '${estado}' con éxito` 
        });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el estado", error });
    }
};