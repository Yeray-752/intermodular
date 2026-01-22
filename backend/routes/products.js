import { Router } from "express";
import { createProduct, getProducts, getProductsById, updateProduct, deleteProduct,purchaseProduct } from "../controllers/productController.js";

const router = Router();

router.post("/", createProduct);
router.get("/", getProducts);
router.get("/:id", getProductsById);
router.put("/:id/update", updateProduct);
router.delete("/:id/delete", deleteProduct);

router.post('/:id/buy', purchaseProduct);

export default router;