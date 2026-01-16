import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import usersRoutes from "./routes/users.js";
import productosRoutes from "./routes/products.js"
import serviceRoutes from "./routes/services.js"
import { languageMiddleware } from './middleware/language.js';
import product_categoryRoutes from './routes/categories_product.js';
import service_categoryRoutes from './routes/categories_services.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

//Middlewares
app.use(languageMiddleware);

// Rutas API
app.use("/api/users", usersRoutes);
app.use("/api/products", productosRoutes);
app.use("/api/services", serviceRoutes);
app.use('/api/product_categories', product_categoryRoutes);
app.use('/api/service_categories', service_categoryRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("API funcionando correctamente 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
