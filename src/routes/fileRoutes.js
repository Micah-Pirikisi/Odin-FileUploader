import { Router } from "express";
import * as fileController from "../controllers/fileController.js";
import { isAuthenticated } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.post(
  "/upload",
  isAuthenticated,
  upload.single("file"),
  fileController.uploadFile
);

router.get("/:id", isAuthenticated, fileController.fileDetails);
router.get("/:id/download", isAuthenticated, fileController.downloadFile);

export { router as fileRoutes };
