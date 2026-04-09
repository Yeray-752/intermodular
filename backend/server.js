//Variables globales (no tocar)
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import hpp from 'hpp';
import helmet from "helmet";
import rateLimit  from "express-rate-limit";  
import path from 'path';
import { fileURLToPath } from 'url';

/* import { chromium } from ('playwright'); */

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

import { languageMiddleware } from './middlewares/language.js';
import {autoSanitize} from "./middlewares/sanitizer.js"

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

app.use(cors());
app.use(express.json());
app.use(autoSanitize);
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
}, express.static(path.join(__dirname, 'public', 'uploads')));

app.use(languageMiddleware);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5000,
  message: 'La página se encuentra saturada en estos momentos, por favor, inténtelo más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

// ✅ Sirve estáticos CON los headers correctos, ANTES de Helmet


// ✅ Helmet sin bloquear imágenes
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                imgSrc: ["'self'", "data:", "blob:", "https://yeray.informaticamajada.es", "http://localhost:3000"],
                scriptSrc: ["'self'"],
                objectSrc: ["'none'"],
                upgradeInsecureRequests: [],
            },
        },
        crossOriginResourcePolicy: { policy: "cross-origin" }
    })
);

// ✅ Solo si realmente necesitas COEP (probablemente no lo necesitas)
// Si no usas SharedArrayBuffer ni Atomics, elimina estas dos líneas
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  // res.setHeader("Cross-Origin-Embedder-Policy", "require-corp"); // ← ELIMINA ESTA LÍNEA
  next();
});

app.use(limiter);

app.use(hpp());

app.use("/api/users", usersRoutes);
app.use("/api/products", productosRoutes);
app.use("/api/services", serviceRoutes);
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

