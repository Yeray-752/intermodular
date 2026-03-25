import { Router } from 'express';
import { getServices,createService,updateService,deleteService} from '../controllers/serviceController.js';
import { verifyToken, isAdmin } from '../middlewares/auth.js';

const router = Router();

router.post('/', [verifyToken, isAdmin], createService);

router.get('/',getServices);

router.put('/:id/update',verifyToken,isAdmin,updateService);

router.delete('/:id/delete',verifyToken,isAdmin,deleteService);

export default router;
