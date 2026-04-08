import { Router } from "express";
import { createProduct, getProducts, getProductsById, updateProduct, deleteProduct,purchaseProduct,getProductTranslations } from "../controllers/productController.js";
import { verifyToken, isAdmin } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';
import { processImage } from '../middlewares/processImage.js';

const router = Router();

router.post("/",verifyToken, isAdmin, upload.single('image'), processImage('products'), createProduct);
router.get("/", getProducts);
router.get("/:id", getProductsById);
router.get("/:id/translations", verifyToken, isAdmin, getProductTranslations);

router.put('/:id/update', verifyToken, isAdmin, upload.single('image'), processImage('products'), updateProduct);

router.delete("/:id/delete", deleteProduct);

router.post('/:id/order', purchaseProduct);

export default router;