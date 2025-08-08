import { Router } from "express";
import SectionController from "../controllers/SectionContoller";
 import { checkJwt } from "../middlewares/checkJwt";
 import { checkRole } from "../middlewares/checkRole";

 const router =  Router();
//Get all Sections
router.get("/", [checkJwt, checkRole(["admin"])], SectionController.listAll);

// Get one Section
router.get("/:id([0-9]+)",[checkJwt, checkRole(["admin"])],SectionController.getOneById);

//Create a new Section
router.post("/", [checkJwt, checkRole(["admin"])], SectionController.newSection);

//Edit one Section
router.patch("/:id([0-9]+)",[checkJwt, checkRole(["admin"])],SectionController.editSection);

//Delete one Section
router.delete("/:id([0-9]+)",[checkJwt, checkRole(["admin"])],SectionController.deleteSection);

 export default router;