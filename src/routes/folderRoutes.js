import { Router } from "express";
import * as folderController from "../controllers/folderController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = Router();

router.get("/", isAuthenticated, folderController.listFolders);
router.post("/", isAuthenticated, folderController.createFolder);
router.get("/:id", isAuthenticated, folderController.viewFolder);
router.post("/:id/edit", isAuthenticated, folderController.renameFolder);
router.post("/:id/delete", isAuthenticated, folderController.deleteFolder);

export { router as folderRoutes };
