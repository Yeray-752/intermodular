import { Router } from 'express';
import { actualizarEstadoCita, crearCita, obtenerCitas } from '../controllers/datesController.js';
import { validarEstadoCita } from '../middleware/state.js';

const router = Router();

router.get('/citas', obtenerCitas);

router.post('/citas', crearCita);

router.patch('/citas/:id/estado', validarEstadoCita, actualizarEstadoCita);

export default router;