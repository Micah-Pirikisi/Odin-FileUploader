import { Router } from "express";
import * as shareController from "../controllers/shareController.js";

const router = Router();

router.get("/share/:token", shareController.accessSharedFolder);
router.post("/share", shareController.createShareLink);

export { router as shareRoutes };
