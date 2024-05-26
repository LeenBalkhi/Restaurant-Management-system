import { Router } from "express";
import SubOrderController from "../controllers/SubOrderController";
 import { checkJwt } from "../middlewares/checkJwt";
 import { checkRole } from "../middlewares/checkRole";

 const router =  Router();
//Get all SubOrders
router.get("/", [checkJwt, checkRole(["admin"])], SubOrderController.listAll);

// Get one SubOrder
router.get("/:id([0-9]+)",[checkJwt, checkRole(["admin"])],SubOrderController.getOneById);

//Create a new SubOrder
router.post("/", [checkJwt, checkRole(["admin"])], SubOrderController.newSubOrder);

//Edit one SubOrder
router.patch("/:id([0-9]+)",[checkJwt, checkRole(["admin"])],SubOrderController.editSubOrder);

//Delete one SubOrder
router.delete("/:id([0-9]+)",[checkJwt, checkRole(["admin"])],SubOrderController.deleteSubOrder);

 export default router;