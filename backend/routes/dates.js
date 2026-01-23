import { Router } from 'express';
import { actualizarEstadoCita, crearCita, obtenerCitas, cancelarCita } from '../controllers/datesController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import { validateCita, validateUpdateEstadoCita } from '../validators/dateValidator.js';

const router = Router();

// 1. Ver citas
// Ahora protegido: el controlador decidirá si mostrar todas (admin) o solo las del usuario.
router.get('/', verifyToken, obtenerCitas);

// 2. Crear cita
// Validamos el token y luego el esquema de Zod antes de entrar al controlador.
router.post('/', verifyToken, (req, res, next) => {
    const result = validateCita(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten().fieldErrors });
    }
    // Pasamos los datos limpios al siguiente paso
    req.body = result.data;
    next();
}, crearCita);

// 3. Actualizar estado
// Solo el admin puede cambiar estados, y validamos que el nuevo estado sea correcto.
router.patch('/:id/estado', [verifyToken, isAdmin], (req, res, next) => {
    const result = validateUpdateEstadoCita({
        id: req.params.id,
        estado: req.body.estado
    });

    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten().fieldErrors });
    }
    next();
}, actualizarEstadoCita);

// Ruta para que el usuario cancele su propia cita
router.patch('/:id/cancelar', verifyToken, (req, res, next) => {
    const result = validateIdParam({ id: req.params.id });
    if (!result.success) return res.status(400).json({ errors: result.error.flatten().fieldErrors });
    next();
}, cancelarCita);

export default router;