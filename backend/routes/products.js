import { Router } from "express";
import { createProduct, getProducts, getProductsById, updateProduct, deleteProduct,purchaseProduct, getVentas } from "../controllers/productController.js";

const router = Router();

router.post("/", createProduct);
router.get("/", getProducts);
router.get("/ventas", getVentas)
router.get("/:id", getProductsById);
router.put("/:id/update", updateProduct);
router.delete("/:id/delete", deleteProduct);

router.post('/:id/order', purchaseProduct);

export default router;