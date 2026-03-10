import { Router } from 'express';
import { createService } from '../controllers/serviceController.js';
import { verifyToken, isAdmin } from '../middlewares/auth.js';
import { getSafePath } from '../middlewares/path.js';
import multer from 'multer';

const router = Router();

// Configuración de Multer usando tu middleware de ruta segura
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Usamos tu middleware para obtener la ruta física real
        cb(null, getSafePath('public/uploads/services')); 
    },
    filename: (req, file, cb) => {
        // Guardamos: timestamp-nombreoriginal.jpg
        const uniqueSuffix = Date.now() + '-' + file.originalname;
        cb(null, uniqueSuffix);
    }
});

const upload = multer({ storage });

// Aplicar Multer a la creación (campo 'image')
router.post('/', [verifyToken, isAdmin, upload.single('image')], createService);

export default router;