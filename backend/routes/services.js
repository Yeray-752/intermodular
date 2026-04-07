import { Router } from 'express';
import { getServices,createService,updateService,deleteService} from '../controllers/serviceController.js';
import { verifyToken, isAdmin } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';
import { processImage } from '../middlewares/processImage.js';

const router = Router();

router.post('/', [verifyToken, isAdmin], upload.single('image'),processImage('services'),createService);

router.get('/',getServices);

router.put('/:id/update',verifyToken,isAdmin,upload.single("imagen"),processImage("services"),updateService);

router.delete('/:id/delete',verifyToken,isAdmin,deleteService);

export default router;
