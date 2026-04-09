import { Router } from 'express';
import { getNotificationsByID,getUnreadCount, markAsRead,markReadAll,getNotificationsAdmin } from '../controllers/notificationsController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();

router.use(verifyToken);

router.get('/', getNotificationsByID);

router.get('/admin', getNotificationsByID);

router.patch('/:id/read', markAsRead);

router.get('/unread-count', getUnreadCount);

router.patch('/read-all', markReadAll);

router.patch('/:id/read', markAsRead);

export default router;