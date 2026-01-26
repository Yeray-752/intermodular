import db from "../db.js";

export const createProduct = async (req, res) => {
  // lang viene de tu middleware (ej: 'es' o 'en')
  const lang = req.lang;

  // Extraemos datos del producto y datos de la traducción
  const { category_id, image_url, price, stock, duration, name, description } = req.body;

  // Validación básica: Si no es español y no envías nombre, podría ser un problema
  if (!name) {
    return res.status(400).json({ message: "El nombre del producto es obligatorio" });
  }

  try {
    // 1. Insertar en la tabla 'products' (Datos generales)
    const formattedDuration = duration ? duration.replace(/(\d+)([a-zA-Z]+)/, '$1 $2') : null;

    const productQuery = `
      INSERT INTO products (category_id, image_url, price, stock, duration) 
      VALUES (?, ?, ?, ?, ?)
    `;

    const [productResult] = await db.execute(productQuery, [
      category_id,
      image_url,
      price,
      stock,
      formattedDuration
    ]);

    // 2. Obtener el ID del producto recién creado
    const newProductId = productResult.insertId;

    // 3. Insertar en la tabla de traducciones
    // Usamos el 'lang' que detectó tu middleware y el 'newProductId'
    const translationQuery = `
      INSERT INTO product_translations (product_id, language_code, name, description) 
      VALUES (?, ?, ?, ?)
    `;

    await db.execute(translationQuery, [
      newProductId,
      lang,         // 'es' o 'en'
      name,
      description || null
    ]);

    // Si todo sale bien
    res.status(201).json({
      message: "Producto y traducción creados con éxito",
      productId: newProductId,
      language: lang
    });

  } catch (error) {
    console.error("Error en la transacción:", error);
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
      p.category_id,
      t.name, 
      t.description
      FROM products p
      LEFT JOIN product_translations t 
        ON p.id = t.product_id 
      WHERE t.language_code = ?
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

    // Como es un ID único, devolvemos el primer (y único) objeto
    res.json(rows[0]);

  } catch (error) {
    console.error("Error al obtener el producto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const lang = req.lang; // Idioma detectado (es/en)
  const { category_id, image_url, price, stock, duration, name, description } = req.body;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Formatear duración si viene en el body
    const formattedDuration = duration ? duration.replace(/(\d+)([a-zA-Z]+)/, '$1 $2') : null;

    // 2. Actualizar tabla principal 'products'
    const productQuery = `
      UPDATE products 
      SET category_id = ?, image_url = ?, price = ?, stock = ?, duration = ?
      WHERE id = ?
    `;
    await connection.execute(productQuery, [
      category_id, image_url, price, stock, formattedDuration, id
    ]);

    // 3. Actualizar tabla de traducciones 'product_translations'
    // Usamos INSERT ... ON DUPLICATE KEY UPDATE por si el producto no tenía ese idioma aún
    const translationQuery = `
      INSERT INTO product_translations (product_id, language_code, name, description)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description)
    `;
    await connection.execute(translationQuery, [id, lang, name, description]);

    await connection.commit();
    res.json({ message: "Producto actualizado correctamente" });

  } catch (error) {
    await connection.rollback();
    console.error("Error al actualizar:", error);
    res.status(500).json({ error: "Error al intentar actualizar el producto" });
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
    connection.release(); // Liberamos la conexión al pool
  }
};