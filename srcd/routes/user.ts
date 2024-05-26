import { Router } from "express";
import UserController from "../controllers/UserController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";

const router = Router();
router.get("/getRoles", [checkJwt, checkRole(["admin"])], UserController.getRoles);

router.get("/", [checkJwt, checkRole(["admin"])], UserController.listAll);

export default router;
