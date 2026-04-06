import db from "../db.js";
import {createNotification} from "./notificationsController.js";

export const createProduct = async (req, res) => {
  const lang = req.lang;
  const { category_id, image_url, price, stock, name, description } = req.body;

  if (!name) return res.status(400).json({ message: "El nombre del producto es obligatorio" });

  try {
    // 1. Insertar datos técnicos (Quitamos duration)
    const productQuery = `
      INSERT INTO products (category_id, image_url, price, stock) 
      VALUES (?, ?, ?, ?)
    `;

    const [productResult] = await db.execute(productQuery, [
      category_id,
      image_url,
      price,
      stock
    ]);

    const newProductId = productResult.insertId;

    // 2. Insertar traducción
    await db.execute(
      "INSERT INTO product_translations (product_id, language_code, name, description) VALUES (?, ?, ?, ?)",
      [newProductId, lang, name, description || null]
    );

    // 3. Notificación al Admin
    await createNotification(req.user.id, 'producto_nuevo', 'admin', { 
        producto: name 
    });

    res.status(201).json({ message: "Producto creado con éxito", productId: newProductId });

  } catch (error) {
    res.status(500).json({ message: "Error al crear el producto" });
  }
};
export const getProducts = async (req, res) => {
  // req.lang viene de tu languageMiddleware ('es' o 'en')
  const lang = req.lang;

  try {
    const query = `
      SELECT 
      p.id, 
      p.price, 
      p.stock, 
      p.image_url, 
      p.rating AS rating,
      p.category_id,
      t.name, 
      t.description
      FROM products p
      LEFT JOIN product_translations t 
        ON p.id = t.product_id 
      AND t.language_code = ?
    `;

    const [rows] = await db.query(query, [lang]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "No se encontraron productos para este idioma." });
    }
    console.log("Datos que salen del backend:", rows[0]);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
export const getProductsById = async (req, res) => {
  const lang = req.lang;
  const { id } = req.params; // Obtenemos el ID de la URL (ej: /productos/5)

  try {
    const query = `
      SELECT 
        p.id,
        p.category_id,
        p.image_url,
        p.price,
        p.stock,
        p.rating,
        t.name, 
        t.description
      FROM products p
      LEFT JOIN product_translations t 
        ON p.id = t.product_id AND t.language_code = ?
      WHERE p.id = ?
    `;

    // Pasamos lang e id como variables seguras
    const [rows] = await db.query(query, [lang, id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }

    res.json(rows[0]);

  } catch (error) {
    console.error("Error al obtener el producto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const lang = req.lang;
  const { category_id, image_url, price, stock, name, description } = req.body;

  const connection = await db.getConnection();

  try {
    // Obtener datos actuales para comparar cambios
    const [old] = await connection.query(
      "SELECT p.price, p.stock, t.name FROM products p JOIN product_translations t ON p.id = t.product_id WHERE p.id = ? AND t.language_code = ?",
      [id, lang]
    );

    await connection.beginTransaction();

    // 1. Actualizar tabla principal
    await connection.execute(
      "UPDATE products SET category_id = ?, image_url = ?, price = ?, stock = ? WHERE id = ?",
      [category_id, image_url, price, stock, id]
    );

    // 2. Actualizar traducción
    await connection.execute(
      `INSERT INTO product_translations (product_id, language_code, name, description)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description)`,
      [id, lang, name, description]
    );

    // 3. Notificación consolidada
    if (old.length > 0) {
        const cambios = [];
        if (parseFloat(old[0].price) !== parseFloat(price)) cambios.push(`precio: ${price}€`);
        if (parseInt(old[0].stock) !== parseInt(stock)) cambios.push(`stock: ${stock}`);
        if (old[0].name !== name) cambios.push(`nombre: ${name}`);

        if (cambios.length > 0) {
            await createNotification(req.user.id, 'producto_actualizado', 'admin', {
                nombre_original: old[0].name,
                cambios: cambios
            });
        }
    }

    await connection.commit();
    res.json({ message: "Producto actualizado correctamente" });

  } catch (error) {
    await connection.rollback();
    res.status(500).json({ error: "Error al actualizar el producto" });
  } finally {
    connection.release();
  }
};
export const deleteProduct = async (req, res) => {
  const { id } = req.params; // El ID del producto a borrar

  try {
    const query = `DELETE FROM products WHERE id = ?`;
    const [result] = await db.execute(query, [id]);

    // Verificamos si realmente se borró algo
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "El producto no existe." });
    }

    res.json({ message: "Producto eliminado correctamente." });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ error: "No se pudo eliminar el producto." });
  }
};
export const purchaseProduct = async (req, res) => {
  const { productId, quantity } = req.body; // El usuario envía ID y cantidad
  const connection = await db.getConnection(); // Necesitamos una conexión fija para la transacción

  try {
    await connection.beginTransaction();

    // 1. Verificar stock actual (SELECT ... FOR UPDATE bloquea la fila para que nadie más la toque)
    const [rows] = await connection.execute(
      "SELECT stock FROM products WHERE id = ? FOR UPDATE",
      [productId]
    );

    if (rows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const currentStock = rows[0].stock;

    // 2. Validar si hay suficiente cantidad
    if (currentStock < quantity) {
      await connection.rollback();
      return res.status(400).json({
        message: `Stock insuficiente. Disponible: ${currentStock}`
      });
    }

    // 3. Descontar el stock
    const newStock = currentStock - quantity;
    await connection.execute(
      "UPDATE products SET stock = ? WHERE id = ?",
      [newStock, productId]
    );


    await connection.commit(); // Confirmamos todos los cambios
    res.json({ message: "Compra realizada con éxito", stock_restante: newStock });

  } catch (error) {
    await connection.rollback(); // Si algo falla, el stock vuelve a su estado original
    console.error("Error en la compra:", error);
    res.status(500).json({ error: "Error procesando la compra" });
  } finally {
    connection.release();
  }
};