import { Router } from 'express';
import { registrarVehiculo, eliminarVehiculo, actualizarVehiculo } from '../controllers/vehiculeController.js';

const router = Router();

router.post('/', registrarVehiculo);
router.put('/:matricula', actualizarVehiculo);
router.delete('/:matricula', eliminarVehiculo);

export default router;