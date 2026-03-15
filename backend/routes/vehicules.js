import { Router } from 'express';
import { registrarVehiculo, eliminarVehiculo, actualizarVehiculo, getVehiculos} from '../controllers/vehiculeController.js';
import { verifyToken } from '../middlewares/auth.js'; // Asumo que tienes este middleware

const router = Router();

// Todas las rutas de vehículos suelen requerir estar logueado
router.use(verifyToken); 

router.get('/', getVehiculos);
router.post('/', registrarVehiculo);
router.put('/:matricula', actualizarVehiculo);
router.delete('/:matricula', eliminarVehiculo);

export default router;