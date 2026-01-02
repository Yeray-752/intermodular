import { Router } from "express";
import db from "../db.js";

const router = Router();

// GET - Obtener todos los usuarios
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Usuario");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el sihghgvervidor" });
  }
});

// POST - Crear usuario
router.post("/", async (req, res) => {
  const { nombre, email } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO users (nombre, email) VALUES (?, ?)",
      [nombre, email]
    );
    res.json({ id: result.insertId, nombre, email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

export default router;
