export const addToCart = async (req, res) => {
    const { id_producto, cantidad } = req.body;
    const id_usuario = req.user.id;

    try {
        // Usamos ON DUPLICATE KEY para que si ya existe el producto, sume la cantidad
        await db.query(`
            INSERT INTO carrito (id_usuario, id_producto, cantidad) VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE cantidad = cantidad + VALUES(cantidad)
        `, [id_usuario, id_producto, cantidad]);

        res.json({ message: "Producto añadido al carrito" });
    } catch (error) {
        res.status(500).json({ error: "Error al guardar en el carrito" });
    }
};