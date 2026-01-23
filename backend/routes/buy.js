import { Router } from 'express';
import { getCompras, createCompra, updateEstadoCompra } from '../controllers/buyController.js';
import { validateCompra, validateUpdateEstado } from '../validators/buyValidator.js';
const router = Router();

router.get('/', getCompras);
router.post('/', validateCompra, createCompra);
router.patch('/:id', validateUpdateEstado, updateEstadoCompra);

export default router;