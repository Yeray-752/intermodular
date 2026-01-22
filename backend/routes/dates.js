import { Router } from 'express';
import { actualizarEstadoCita, crearCita, obtenerCitas } from '../controllers/datesController.js';
import { validarEstadoCita } from '../middleware/state.js';

const router = Router();

router.get('/', obtenerCitas);

router.post('/', crearCita);

router.patch('/:id/estado', validarEstadoCita, actualizarEstadoCita);

export default router;