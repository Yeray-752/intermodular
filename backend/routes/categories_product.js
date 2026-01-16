import { Router } from 'express';
import { getCategories, createCategory,deleteCategory } from '../controllers/categories_productController.js';

const router = Router();

router.get('/', getCategories);    // GET /api/categories
router.post('/', createCategory);  // POST /api/categories
router.delete('/:id', deleteCategory);

export default router;