import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import usersRoutes from "./routes/users.js";
import productosRoutes from "./routes/products.js"
import serviceRoute from "./routes/services.js"
import { languageMiddleware } from './middleware/language.js';


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

//Middlewares
app.use(languageMiddleware);

// Rutas API
app.use("/api/users", usersRoutes);
app.use("/api/products", productosRoutes);
app.use("/api/services", serviceRoute);

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("API funcionando correctamente 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
