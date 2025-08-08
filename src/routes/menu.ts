import { Router } from "express";
import MenuController from "../controllers/MenuController";
 import { checkJwt } from "../middlewares/checkJwt";
 import { checkRole } from "../middlewares/checkRole";

 const router =  Router();
//Get all Menus
router.get("/", [checkJwt, checkRole(["admin","waiter","customer","cashier"])], MenuController.listAll);

// Get one Menu
router.get("/:id([0-9]+)",[checkJwt, checkRole(["admin","waiter","customer","cashier"])],MenuController.getOneById);

//Create a new Menu
router.post("/", [checkJwt, checkRole(["admin"])], MenuController.newMenu);

//Edit one Menu
router.patch("/:id([0-9]+)",[checkJwt, checkRole(["admin"])],MenuController.editMenu);

//get Meal And Section By MenuId
router.get("/getMealAndSectionByMenuId/:id([0-9]+)",[checkJwt, checkRole(["admin","waiter","customer","cashier"])],MenuController.getMealAndSectionByMenuId);

//Delete one Menu
router.delete("/:id([0-9]+)",[checkJwt, checkRole(["admin"])],MenuController.deleteMenu);

 export default router;