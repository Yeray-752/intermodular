import db from "../db.js";
import { validateCompra } from "../validators/buyValidator.js";

export const getCompras = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM pedido');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener compras", error });
    }
};

export const createCompra = async (req, res) => {
    const validation = validateCompra(req.body);

    if (!validation.success) {
        return res.status(400).json({ errors: validation.error.flatten().fieldErrors });
    }

    const id_user = req.user.id; 
    
    const { id_producto, fecha, estado } = validation.data;

    try {
        const [result] = await db.query(
            'INSERT INTO pedido (id_usuario, id_producto, fecha, estado) VALUES (?, ?, ?, ?)',
            [id_user, id_producto, fecha, estado || 'pendiente']
        );
        
        res.status(201).json({ 
            message: "Compra realizada con éxito", 
            id_compra: result.insertId 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al procesar la compra" });
    }
};

export const updateEstadoCompra = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    try {
        const [result] = await db.query(
            'UPDATE pedido SET estado = ? WHERE id = ?',
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