import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/folders");
  } else {
    return res.redirect("/login");
  }
});

export { router as indexRoutes };
