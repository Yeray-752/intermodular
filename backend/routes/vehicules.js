import { Router } from 'express';
import { registrarVehiculo, eliminarVehiculo, actualizarVehiculo } from '../controllers/vehiculeController.js';

const router = Router();

router.post('/vehiculos', registrarVehiculo);
router.put('/vehiculos/:matricula', actualizarVehiculo);
router.delete('/vehiculos/:matricula', eliminarVehiculo);

export default router;