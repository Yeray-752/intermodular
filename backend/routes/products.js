import { Router } from "express";
import db from "../db.js";

const router = Router();


router.get("/", async (req, res) => {
    try{
        const [rows] = await db.query("SELECT * FROM Producto");
        res.json(rows)
    }catch (error) {
    res.status(500).json({ error: "Error en el servidor" });
  }
});

router.get("/id", async (req, res) => {
    try{
        const [rows] = await db.query("SELECT * FROM Producto where id = {id}");
        res.json(rows)
    }catch (error) {
    res.status(500).json({ error: "Error en el servidor" });
  }
});

export default router;