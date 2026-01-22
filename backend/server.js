import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import usersRoutes from "./routes/users.js";
import productosRoutes from "./routes/products.js"
import serviceRoutes from "./routes/services.js"
import { languageMiddleware } from './middleware/language.js';
import product_categoryRoutes from './routes/categories_product.js';
import service_categoryRoutes from './routes/categories_services.js';
import datesRoutes from "./routes/dates.js";
import vehiculesRoutes from "./routes/vehicules.js";
import buyRoutes from "./routes/buy.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(languageMiddleware);

app.use("/api/users", usersRoutes);
app.use("/api/products", productosRoutes);
app.use("/api/services", serviceRoutes);
app.use('/api/product_categories', product_categoryRoutes);
app.use('/api/service_categories', service_categoryRoutes);
app.use('/api/dates', datesRoutes);
app.use('/api/vehicules', vehiculesRoutes);
app.use('/api/buys', buyRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
