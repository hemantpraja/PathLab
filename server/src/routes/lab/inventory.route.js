import Router from "express";
import { addItem ,addSupplier } from "../../controllers/lab/inventory.controller.js"

const router = Router();
router.post('/addItem', addItem);
router.post('/addSupplier', addSupplier);

export default router;