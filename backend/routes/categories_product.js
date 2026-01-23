import { Router } from 'express';
import { getCategories, createCategory,deleteCategory } from '../controllers/categories_productController.js';

const router = Router();

router.get('/', getCategories);
router.post('/', createCategory);
router.delete('/:id', deleteCategory);

export default router;