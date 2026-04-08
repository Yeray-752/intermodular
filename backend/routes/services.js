import { Router } from 'express';
import { getServices,createService,updateService,deleteService,getServiceTranslations} from '../controllers/serviceController.js';
import { verifyToken, isAdmin } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';
import { processImage } from '../middlewares/processImage.js';

const router = Router();

router.post('/', [verifyToken, isAdmin], upload.single('image'),processImage('services'),createService);

router.get('/',getServices);

// En routes/services.js
router.get("/:id/translations", verifyToken, isAdmin, getServiceTranslations);

router.put('/:id/update',verifyToken,isAdmin,upload.single("imagen"),processImage("services"),updateService);

router.delete('/:id/delete',verifyToken,isAdmin,deleteService);

export default router;
