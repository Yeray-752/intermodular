//Variables globales (no tocar)
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import hpp from 'hpp';
import helmet from "helmet";
import rateLimit  from "express-rate-limit";  

//Rutas
import usersRoutes from "./routes/users.js";
import productosRoutes from "./routes/products.js"
import serviceRoutes from "./routes/services.js"
import product_categoryRoutes from './routes/categories_product.js';
import service_categoryRoutes from './routes/categories_services.js';
import datesRoutes from "./routes/dates.js";
import vehiculesRoutes from "./routes/vehicules.js";
import orderRoutes from "./routes/order.js";
import cartRoutes from "./routes/carts.js"
import ratingRoutes from "./routes/rating.js"
import notificationRoutes from "./routes/notifications.js";

//Middlewares
import { languageMiddleware } from './middlewares/language.js';
import {autoSanitize} from "./middlewares/sanitizer.js"
import { getSafePath } from './middlewares/path.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(autoSanitize);
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('public/uploads'));

app.use(languageMiddleware);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: 'La página se encuentra saturada en estos momentos, por favor, inténtelo más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://trustedscripts.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  })
);

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

app.use(limiter);

app.use(hpp()); //si hay datos duplicados, esto evita que explote la página

app.use("/api/users", usersRoutes);
app.use("/api/products", productosRoutes);
app.use("/api/dates", datesRoutes);
app.use("/api/notifications", notificationRoutes);
app.use('/api/product_categories', product_categoryRoutes);
app.use('/api/service_categories', service_categoryRoutes);
app.use('/api/vehicules', vehiculesRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/rating', ratingRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
