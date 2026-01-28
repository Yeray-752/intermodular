import { Router } from 'express';
import { getNotifications, markAsRead } from '../controllers/notificationsController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();

// Todas las rutas requieren estar logueado
router.use(verifyToken);

// Ver mis notificaciones
router.get('/', getNotifications);

// Marcar una como leída
router.patch('/:id/read', markAsRead);

export default router;