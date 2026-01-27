import db from "../db.js";
import { validateCompra } from "../validators/orderValidator.js";

export const getCompras = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM pedido');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener compras", error });
    }
};

export const createCompra = async (req, res) => {
    const id_user = req.user.id;
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();
        const fecha = new Date().toISOString().split('T')[0];

        // 1. OBTENER TODO LO QUE EL USUARIO TIENE EN EL CARRITO
        const [itemsCarrito] = await connection.query(
            "SELECT c.id_producto, c.cantidad, p.price, p.stock " +
            "FROM carrito c JOIN products p ON c.id_producto = p.id " +
            "WHERE c.id_usuario = ?", [id_user]
        );

        if (itemsCarrito.length === 0) {
            throw new Error("El carrito está vacío");
        }

        // 2. CREAR LA CABECERA DEL PEDIDO
        const [pedidoResult] = await connection.query(
            "INSERT INTO pedido (id_usuario, total, fecha, estado) VALUES (?, ?, ?, ?)",
            [id_user, total, fecha, 'pagado']
        );
        const id_pedido = pedidoResult.insertId;

        // 3. MOVER PRODUCTOS DEL CARRITO AL DETALLE Y RESTAR STOCK
        for (const item of itemsCarrito) {
            if (item.stock < item.cantidad) {
                throw new Error(`No hay stock de ${item.nombre}`);
            }

            // Insertar en detalle de pedido
            await connection.query(
                'INSERT INTO pedido_detalle (id_pedido, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
                [id_pedido, item.id_producto, item.cantidad, item.precio]
            );

            // Restar stock
            await connection.query(
                'UPDATE products SET stock = stock - ? WHERE id = ?',
                [item.cantidad, item.id_producto]
            );
        }

        // 4. VACIAR EL CARRITO DEL USUARIO
        await connection.query("DELETE FROM carrito WHERE id_usuario = ?", [id_user]);

        await connection.commit();
        res.status(201).json({ message: "Compra realizada y carrito vaciado", id_pedido });

    } catch (error) {
        await connection.rollback();
        res.status(400).json({ error: error.message });
    } finally {
        connection.release();
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

export const getOrderDetails = async (req, res) => {
    const { id } = req.params; // El ID del pedido que viene en la URL /api/orders/5
    const lang = req.query.lang || 'es'; // Idioma para los nombres de productos

    try {
        const query = `
            SELECT 
                pd.id_producto,
                pt.name AS producto_nombre,
                pd.cantidad,
                pd.precio_unitario,
                (pd.cantidad * pd.precio_unitario) AS subtotal,
                p.image_url
            FROM pedido_detalle pd
            JOIN products p ON pd.id_producto = p.id
            JOIN product_translations pt ON p.id = pt.product_id
            WHERE pd.id_pedido = ? AND pt.language_code = ?
        `;

        const [details] = await db.query(query, [id, lang]);

        if (details.length === 0) {
            return res.status(404).json({ error: "No se encontraron detalles para este pedido" });
        }

        res.json(details);
    } catch (error) {
        console.error("Error al obtener detalles del pedido:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
};