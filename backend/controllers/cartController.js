import db from "../db.js";

export const addToCart = async (req, res) => {
    const { id_producto, cantidad } = req.body;
    const id_usuario = req.user.id;

    try {
        await db.query(`
            INSERT INTO carrito (id_usuario, id_producto, cantidad) VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE cantidad = cantidad + VALUES(cantidad)
        `, [id_usuario, id_producto, cantidad]);

        res.json({ message: "Producto añadido al carrito" });
    } catch (error) {
    console.error("ERROR REAL SQL:", error); // Esto aparecerá en tu terminal de VS Code / Node
    res.status(500).json({ error: "Error técnico: " + error.message });
}
};

export const getCart = async (req, res) => {
    const id_usuario = req.user.id;
    const lang = req.query.lang || 'es'; // Puedes pasar ?lang=en en la URL o usar 'es' por defecto

    try {
        const query = `
            SELECT 
                c.id_producto, 
                pt.name, 
                p.image_url, 
                p.price AS precio_unitario, 
                c.cantidad,
                (p.price * c.cantidad) AS subtotal
            FROM carrito c
            JOIN products p ON c.id_producto = p.id
            JOIN product_translations pt ON p.id = pt.product_id
            WHERE c.id_usuario = ? AND pt.language_code = ?
        `;

        const [items] = await db.query(query, [id_usuario, lang]);

        const totalCarrito = items.reduce((acc, item) => acc + parseFloat(item.subtotal), 0);

        res.json({
            items,
            totalCarrito: totalCarrito.toFixed(2)
        });
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).json({ error: "No se pudo cargar el carrito" });
    }
};
export const removeFromCart = async (req, res) => {
    try {
        await db.query("DELETE FROM carrito WHERE id_usuario = ? AND id_producto = ?", 
            [req.user.id, req.params.id]);
        res.json({ message: "Producto eliminado del carrito" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el producto" });
    }
};

export const clearCart = async (req, res) => {
    try {
        await db.query("DELETE FROM carrito WHERE id_usuario = ?", [req.user.id]);
        res.json({ message: "Carrito vaciado" });
    } catch (error) {
        res.status(500).json({ error: "Error al vaciar el carrito" });
    }
};

export const checkout = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Traer items usando los nombres reales: p.id y p.price
        const [items] = await connection.query(
            `SELECT c.id_producto, c.cantidad, p.price, p.stock 
             FROM carrito c 
             JOIN products p ON c.id_producto = p.id 
             WHERE c.id_usuario = ?`, 
            [req.user.id]
        );

        if (items.length === 0) throw new Error("El carrito está vacío");

        // 2. Calcular total usando item.price (ya no item.precio)
        const total = items.reduce((acc, item) => acc + (item.price * item.cantidad), 0);
        
        // 3. Crear cabecera del pedido
        const [pedido] = await connection.query(
            "INSERT INTO pedido (id_usuario, total, estado) VALUES (?, ?, 'pagado')",
            [req.user.id, total]
        );
        const id_pedido = pedido.insertId;

        // 4. Procesar cada producto
        for (const item of items) {
            if (item.stock < item.cantidad) {
                throw new Error(`Stock insuficiente para el producto ID: ${item.id_producto}`);
            }

            // Insertar detalle usando item.price
            await connection.query(
                "INSERT INTO pedido_detalle (id_pedido, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)",
                [id_pedido, item.id_producto, item.cantidad, item.price]
            );

            // Restar stock usando la columna 'id'
            await connection.query(
                "UPDATE products SET stock = stock - ? WHERE id = ?",
                [item.cantidad, item.id_producto]
            );
        }

        // 5. Limpiar carrito
        await connection.query("DELETE FROM carrito WHERE id_usuario = ?", [req.user.id]);

        await connection.commit();
        res.json({ message: "Compra realizada con éxito", id_pedido });

    } catch (error) {
        await connection.rollback();
        console.error("ERROR EN CHECKOUT:", error.message);
        res.status(400).json({ error: error.message });
    } finally {
        connection.release();
    }
};