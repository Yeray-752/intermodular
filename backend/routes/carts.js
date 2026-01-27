import express from 'express';
import { getCart, addToCart, removeFromCart, clearCart, checkout } from '../controllers/cartController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.use(verifyToken); // Todas las rutas del carrito requieren login
router.get('/', getCart);             // Ver productos en el carrito
router.post('/add', addToCart);       // Añadir/Actualizar cantidad
router.delete('/item/:id', removeFromCart); // Quitar un producto específico
router.delete('/clear', clearCart);   // Vaciar todo el carrito
router.post('/checkout', verifyToken, checkout);   // Convertir carrito en Pedido (La compra)

export default router;