import { Router } from 'express';
import { saveRating, getProductRatings, deleteRating } from '../controllers/ratingController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();

router.get('/:id_producto', getProductRatings); // Público
router.post('/', verifyToken, saveRating);      // Solo logueados
router.delete('/:id', verifyToken, deleteRating); // Solo dueño

export default router;