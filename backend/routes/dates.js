import { Router } from 'express';
import { obtenerCitasID,actualizarEstadoCita, actualizarCita, crearCita, obtenerCitasAdmin, obtenerCitasTerminadas, obtenerCitasEnProceso, cancelarCita } from '../controllers/datesController.js';
import { verifyToken, isAdmin } from '../middlewares/auth.js';
import { validateServicio, validateUpdateEstadoCita, validateIdParam } from '../validators/dateValidator.js';

const router = Router();

router.get('/', verifyToken, obtenerCitasID);
router.get('/terminada', verifyToken, obtenerCitasTerminadas);
router.get('/admin/pendientes', verifyToken, isAdmin, obtenerCitasAdmin);
router.get('/admin/procesando', verifyToken, isAdmin, obtenerCitasEnProceso);

import { validateServicio } from "../validators/serviceValidator.js";

router.post("/",verifyToken,isAdmin,upload.single("imagen"),processImage("servicios"),
  (req, res, next) => {
    const result = validateServicio(req.body);
    if (!result.success) {
      return res.status(400).json({
        errors: result.error.flatten().fieldErrors
      });
    }
    req.body = result.data; // 👈 limpio y tipado
    next();
  },
  crearServicio
);

router.patch('/:id/update', verifyToken, (req, res, next) => {
    const result = validateIdParam({ id: req.params.id });
    if (!result.success) return res.status(400).json({ errors: result.error.flatten().fieldErrors });
    console.log('segunda base')
    next();
}, actualizarCita);

// 3. Actualizar estado
// Solo el admin puede cambiar estados, y validamos que el nuevo estado sea correcto.


// Ruta para que el usuario cancele su propia cita
router.patch('/:id/cancelar', verifyToken, (req, res, next) => {
    const result = validateIdParam({ id: req.params.id });
    if (!result.success) return res.status(400).json({ errors: result.error.flatten().fieldErrors });
    next();
}, cancelarCita);

router.patch('/actualizar/:id/:estado', [verifyToken, isAdmin], (req, res, next) => {
    const result = validateUpdateEstadoCita({
        id: req.params.id,
        estado: req.params.estado
    });


    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten().fieldErrors });
    }
    next();
}, actualizarEstadoCita);




export default router;