import db from "../db.js";
import { createNotification } from "./notificationsController.js";

export const getServices = async (req, res) => {
  const lang = req.lang || 'es'; // Extraído por tu middleware de idioma

  try {
    const query = `
            SELECT 
                s.id, 
                s.category_id, 
                s.image_url, 
                s.base_price,
                s.duration, 
                s.difficulty,
                st.name, 
                st.description
            FROM services s
            JOIN service_translations st ON s.id = st.service_id
            WHERE st.language_code = ?
        `;
    const [rows] = await db.query(query, [lang]);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener servicios:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const createService = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { category_id, base_price, duration, difficulty, name_es, description_es, name_en, description_en } = req.body;

    if (!name_es) return res.status(400).json({ error: "El nombre en español es obligatorio" });
    if (!req.file) return res.status(400).json({ error: "La imagen es obligatoria" });

    const image_url = `/uploads/services/${req.file.filename}`;

    await connection.beginTransaction();

    const [servResult] = await connection.query(
      `INSERT INTO services (category_id, image_url, base_price, duration, difficulty) VALUES (?, ?, ?, ?, ?)`,
      [category_id, image_url, base_price, duration, difficulty]
    );

    const newServiceId = servResult.insertId;

    // Traducción ES (obligatoria)
    await connection.query(
      `INSERT INTO service_translations (service_id, language_code, name, description) VALUES (?, 'es', ?, ?)`,
      [newServiceId, name_es, description_es || null]
    );

    // Traducción EN (opcional)
    if (name_en) {
      await connection.query(
        `INSERT INTO service_translations (service_id, language_code, name, description) VALUES (?, 'en', ?, ?)`,
        [newServiceId, name_en, description_en || null]
      );
    }

    await createNotification(req.user.id, 'servicio_nuevo', 'admin', { servicio: name_es });

    await connection.commit();
    res.status(201).json({ message: "Servicio creado con éxito", id: newServiceId });

  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ error: "Error al crear servicio" });
  } finally {
    connection.release();
  }
};

// En serviceController.js
export const getServiceTranslations = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT language_code, name, description FROM service_translations WHERE service_id = ?`,
      [id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo traducciones" });
  }
};

export const updateService = async (req, res) => {
  const { id } = req.params;
  const { category_id, base_price, duration, difficulty, name_es, description_es, name_en, description_en } = req.body;
  const image_url = req.file ? `/uploads/services/${req.file.filename}` : null;

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    await connection.query(
      `UPDATE services SET 
        category_id = COALESCE(?, category_id),
        image_url = COALESCE(?, image_url),
        base_price = COALESCE(?, base_price),
        duration = COALESCE(?, duration),
        difficulty = COALESCE(?, difficulty)
       WHERE id = ?`,
      [category_id || null, image_url, base_price || null, duration || null, difficulty || null, id]
    );

    // Upsert ES
    await connection.query(
      `INSERT INTO service_translations (service_id, language_code, name, description)
       VALUES (?, 'es', ?, ?)
       ON DUPLICATE KEY UPDATE
        name = COALESCE(VALUES(name), name),
        description = COALESCE(VALUES(description), description)`,
      [id, name_es || null, description_es || null]
    );

    // Upsert EN
    // En updateService — reemplaza el bloque Upsert EN
    if (name_en || description_en) {
      await connection.query(
        `INSERT INTO service_translations (service_id, language_code, name, description)
         VALUES (?, 'en', ?, ?)
         ON DUPLICATE KEY UPDATE
          name = COALESCE(VALUES(name), name),
          description = COALESCE(VALUES(description), description)`,
        [id, name_en || null, description_en || null]
      );
    }

    await connection.commit();
    res.json({ message: "Servicio actualizado correctamente" });

  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ error: "Error al actualizar" });
  } finally {
    connection.release();
  }
};

export const deleteService = async (req, res) => {
  const { id } = req.params;
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [serviceData] = await connection.query(`
            SELECT s.base_price, s.duration, st.name 
            FROM services s
            JOIN service_translations st ON s.id = st.service_id
            WHERE s.id = ? AND st.language_code = 'es'`,
      [id]
    );

    if (serviceData.length === 0) {
      return res.status(404).json({ message: "Servicio no encontrado" });
    }

    const { name, base_price, duration } = serviceData[0];

    await connection.query("DELETE FROM service_translations WHERE service_id = ?", [id]);
    await connection.query("DELETE FROM services WHERE id = ?", [id]);


    await createNotification(req.user.id, 'servicio_eliminado', 'admin', {
      nombre: name,
      precio: base_price,
      duracion: duration
    });

    await connection.commit();
    res.json({ message: "Servicio eliminado correctamente y registro guardado" });

  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el servicio" });
  } finally {
    connection.release();
  }
};