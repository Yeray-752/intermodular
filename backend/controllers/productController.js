import db from "../db.js";
import { createNotification } from "./notificationsController.js";

export const createProduct = async (req, res) => {
  const { category_id, price, stock, name_es, description_es, name_en, description_en } = req.body;
  const image_url = req.file ? `/uploads/products/${req.file.filename}` : null;

  if (!name_es) return res.status(400).json({ message: "El nombre en español es obligatorio" });

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [productResult] = await connection.execute(
      `INSERT INTO products (category_id, image_url, price, stock) VALUES (?, ?, ?, ?)`,
      [category_id, image_url, price, stock]
    );

    const newProductId = productResult.insertId;

    // Traducción ES (obligatoria)
    await connection.execute(
      `INSERT INTO product_translations (product_id, language_code, name, description) VALUES (?, 'es', ?, ?)`,
      [newProductId, name_es, description_es || null]
    );

    // Traducción EN (opcional)
    if (name_en) {
      await connection.execute(
        `INSERT INTO product_translations (product_id, language_code, name, description) VALUES (?, 'en', ?, ?)`,
        [newProductId, name_en, description_en || null]
      );
    }

    await createNotification(req.user.id, 'producto_creado', 'admin', {
      nombre: name_es,
      stock: stock
    });

    await connection.commit();
    res.status(201).json({ message: "Producto creado con éxito", productId: newProductId });

  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ message: "Error al crear el producto" });
  } finally {
    connection.release();
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
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
export const getProductTranslations = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT language_code, name, description FROM product_translations WHERE product_id = ?`,
      [id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo traducciones" });
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
  const { category_id, price, stock, name_es, description_es, name_en, description_en } = req.body;
  const image_url = req.file ? `/uploads/products/${req.file.filename}` : null;

  const connection = await db.getConnection();
  try {
    const [old] = await connection.query(
      `SELECT p.price, p.stock, t.name 
       FROM products p 
       JOIN product_translations t ON p.id = t.product_id 
       WHERE p.id = ? AND t.language_code = 'es'`,
      [id]
    );

    if (old.length === 0) return res.status(404).json({ message: "Producto no encontrado" });

    await connection.beginTransaction();

    await connection.execute(
      `UPDATE products SET 
        category_id = COALESCE(?, category_id),
        image_url = COALESCE(?, image_url),
        price = COALESCE(?, price),
        stock = COALESCE(?, stock)
       WHERE id = ?`,
      [category_id || null, image_url, price || null, stock || null, id]
    );

    // Upsert ES
    await connection.execute(
      `INSERT INTO product_translations (product_id, language_code, name, description)
       VALUES (?, 'es', ?, ?)
       ON DUPLICATE KEY UPDATE 
        name = COALESCE(VALUES(name), name),
        description = COALESCE(VALUES(description), description)`,
      [id, name_es || null, description_es || null]
    );

    // Upsert EN
    // En updateProduct — reemplaza el bloque Upsert EN
    if (name_en || description_en) {
      await connection.execute(
        `INSERT INTO product_translations (product_id, language_code, name, description)
         VALUES (?, 'en', ?, ?)
         ON DUPLICATE KEY UPDATE 
          name = COALESCE(VALUES(name), name),
          description = COALESCE(VALUES(description), description)`,
        [id, name_en || null, description_en || null]
      );
    }

    // Notificaciones
    const cambios = [];
    if (price && parseFloat(old[0].price) !== parseFloat(price)) cambios.push(`precio: ${price}€`);
    if (stock && parseInt(old[0].stock) !== parseInt(stock)) cambios.push(`stock: ${stock}`);
    if (name_es && old[0].name !== name_es) cambios.push(`nombre: ${name_es}`);
    if (image_url) cambios.push(`imagen actualizada`);

    if (cambios.length > 0) {
      await createNotification(req.user.id, 'producto_actualizado', 'admin', {
        nombre_original: old[0].name,
        cambios: cambios.join(', ')
      });
    }

    await connection.commit();
    res.json({ message: "Producto actualizado correctamente" });

  } catch (error) {
    await connection.rollback();
    console.error(error);
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
export const getVentas = async (req, res) => {
  const { filter } = req.query; // Puede ser 'semana' o 'año'

  try {
    let query = "";
    
    if (filter === 'año') {
      // Agrupamos por Mes
      query = `
        SELECT 
          CASE MONTH(fecha)
            WHEN 1 THEN 'Ene' WHEN 2 THEN 'Feb' WHEN 3 THEN 'Mar'
            WHEN 4 THEN 'Abr' WHEN 5 THEN 'May' WHEN 6 THEN 'Jun'
            WHEN 7 THEN 'Jul' WHEN 8 THEN 'Ago' WHEN 9 THEN 'Sep'
            WHEN 10 THEN 'Oct' WHEN 11 THEN 'Nov' WHEN 12 THEN 'Dic'
          END AS name,
          SUM(total) AS ventas
        FROM pedido
        WHERE YEAR(fecha) = YEAR(CURDATE())
        GROUP BY MONTH(fecha)
        ORDER BY MONTH(fecha)
      `;
    } else {
      // Por defecto: Últimos 7 días
      query = `
        SELECT 
          CASE DAYOFWEEK(fecha)
            WHEN 2 THEN 'Lun' WHEN 3 THEN 'Mar' WHEN 4 THEN 'Mié'
            WHEN 5 THEN 'Jue' WHEN 6 THEN 'Vie' WHEN 7 THEN 'Sáb'
            WHEN 1 THEN 'Dom'
          END AS name,
          SUM(total) AS ventas
        FROM pedido
        WHERE fecha >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        GROUP BY DAYOFWEEK(fecha)
        ORDER BY FIELD(name, 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom')
      `;
    }

    const [rows] = await db.query(query);
    
    // Aquí aplicas el "rellenado" de días o meses que vimos antes...
    // (Omitido por brevedad, pero es vital para que la gráfica no se rompa)
    
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener estadísticas" });
  }
};