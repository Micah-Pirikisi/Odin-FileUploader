import { Router } from "express";
import passport from "passport";
import * as authController from "../controllers/authController.js";

const router = Router();

router.get("/login", authController.loginPage);
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/folders",
    failureRedirect: "/login",
  })
);

router.get("/register", authController.registerPage);
router.post("/register", authController.register);

router.post("/logout", authController.logout);

export { router as authRoutes };
