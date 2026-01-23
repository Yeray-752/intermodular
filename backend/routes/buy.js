import { Router } from 'express';
import { getCompras, createCompra, updateEstadoCompra } from '../controllers/buyController.js';
import { validateCompra, validateUpdateEstado } from '../validators/buyValidator.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = Router();

/**
 * Aplicamos verifyToken a todas las rutas de este archivo 
 * porque mencionaste que el login es obligatorio para comprar.
 */

// 1. Obtener compras: 
// Si eres admin ves todas, si eres usuario podrías filtrar en el controlador para ver solo las tuyas.
router.get('/', verifyToken, getCompras);

// 2. Crear compra:
// Pasamos el body por el validador de Zod antes de llegar al controlador.
router.post('/', verifyToken, (req, res, next) => {
    const result = validateCompra(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten().fieldErrors });
    }
    // Si todo está bien, guardamos los datos limpios y seguimos
    req.body = result.data;
    next();
}, createCompra);

// 3. Modificar estado:
// Solo los administradores deberían poder cambiar el estado de una compra.
router.patch('/:id', [verifyToken, isAdmin], (req, res, next) => {
    const result = validateUpdateEstado({ 
        id: Number(req.params.id), 
        estado: req.body.estado 
    });
    
    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten().fieldErrors });
    }
    next();
}, updateEstadoCompra);

export default router;