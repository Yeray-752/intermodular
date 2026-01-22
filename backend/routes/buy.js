import { Router } from 'express';
import { getCompras, createCompra } from '../controllers/buyController.js';
import { validateCompra } from '../validators/buyValidator.js';
const router = Router();

router.get('/', getCompras);
router.post('/', validateCompra, createCompra);
router.patch('/:id', validateUpdateEstado, updateEstadoCompra);

export default router;