import { Router } from "express";
import db from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM service_categories");

    // como mariadb no tiene json, hay que transformar el texto a json usable
    const categories = rows.map(row => ({
      ...row,
      name: typeof row.name === 'string' ? JSON.parse(row.name) : row.name
    }));

    res.json(categories);
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

export default router;