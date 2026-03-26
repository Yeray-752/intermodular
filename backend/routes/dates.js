import { Router } from 'express';
import { obtenerCitasID,actualizarEstadoCita, actualizarCita, crearCita, obtenerCitasAdmin, obtenerCitasTerminadas, obtenerCitasEnProceso, cancelarCita } from '../controllers/datesController.js';
import { verifyToken, isAdmin } from '../middlewares/auth.js';
import { validateCita, validateUpdateEstadoCita, validateIdParam } from '../validators/dateValidator.js';

const router = Router();

router.get('/', verifyToken, obtenerCitasID);
router.get('/terminada', verifyToken, obtenerCitasTerminadas);
router.get('/admin/pendientes', verifyToken, isAdmin, obtenerCitasAdmin);
router.get('/admin/procesando', verifyToken, isAdmin, obtenerCitasEnProceso);

router.post('/', verifyToken, (req, res, next) => {
    const result = validateCita(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten().fieldErrors });
    }

    req.body = result.data;
    next();
}, crearCita);

router.patch('/:id/update', verifyToken, (req, res, next) => {
    const result = validateIdParam({ id: req.params.id });
    if (!result.success) return res.status(400).json({ errors: result.error.flatten().fieldErrors });
    console.log('segunda base')
    next();
}, actualizarCita);

router.patch('/:id/:estado', [verifyToken, isAdmin], (req, res, next) => {
    const result = validateUpdateEstadoCita({
        id: req.params.id,
        estado: req.params.estado
    });


    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten().fieldErrors });
    }
    next();
}, actualizarEstadoCita);

router.patch('/:id/cancelar', verifyToken, (req, res, next) => {
    const result = validateIdParam({ id: req.params.id });
    if (!result.success) return res.status(400).json({ errors: result.error.flatten().fieldErrors });
    next();
}, cancelarCita);





export default router;