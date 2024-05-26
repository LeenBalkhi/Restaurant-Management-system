import { Router } from "express";
import StockController  from "../controllers/StockController";
 import { checkJwt } from "../middlewares/checkJwt";
 import { checkRole } from "../middlewares/checkRole";

 const router =  Router();
//Get all Orderss
router.get("/", [checkJwt, checkRole(["admin"])], StockController.listAll);

// Get one StockController
router.get("/:id([0-9]+)",[checkJwt, checkRole(["admin"])],StockController.getOneById);


//Create a new StockController
router.post("/", [checkJwt, checkRole(["admin"])], StockController.newStock);


//Delete one StockController
router.delete("/:id([0-9]+)",[checkJwt, checkRole(["admin"])],StockController.deleteStock);

 export default router;