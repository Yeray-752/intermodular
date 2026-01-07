import { Router } from "express";
import db from "../db.js";

const router = Router()

router.get("/", async (req, res) => {
    try{
        const [rows] = await db.querry("SELECT * FROM servicios");
        res.json(rows)
    } catch (error){
        res.status(500).json({ error: "Error en el servidor" });
    }
});

export default router;