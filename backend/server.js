import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import usersRoutes from "./routes/users.js";
import productosRoutes from "./routes/products.js"

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas API
app.use("/api/usuarios", usersRoutes);
app.use("/api/productos", productosRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("API funcionando correctamente 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
