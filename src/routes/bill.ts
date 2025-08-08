import { Router } from "express";
import BillsController from "../controllers/BillsController";
 import { checkJwt } from "../middlewares/checkJwt";
 import { checkRole } from "../middlewares/checkRole";

 const router =  Router();
//Get all bills
router.get("/", [checkJwt, checkRole(["admin"])], BillsController.listAll);

// Get one bill
router.get("/:id([0-9]+)",[checkJwt, checkRole(["admin"])],BillsController.getOneById);

//Create a new bill
router.post("/", [checkJwt, checkRole(["admin"])], BillsController.newBill);

//Edit one bill
router.patch("/:id([0-9]+)",[checkJwt, checkRole(["admin"])],BillsController.editBill);

//Delete one bill
router.delete("/:id([0-9]+)",[checkJwt, checkRole(["admin"])],BillsController.deleteBill);

 export default router;