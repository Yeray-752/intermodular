import { Router } from 'express';
import { getServiceCategories } from '../controllers/categories_serviceController.js';
const router = Router();
router.get('/', getServiceCategories);
export default router;