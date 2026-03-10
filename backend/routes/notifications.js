import { Router } from 'express';
import { getNotificationsByID, markAsRead } from '../controllers/notificationsController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();

// Todas las rutas requieren estar logueado
router.use(verifyToken);

// Ver mis notificaciones
router.get('/', getNotificationsByID);

// Marcar una como leída
router.patch('/:id/read', markAsRead);

export default router;