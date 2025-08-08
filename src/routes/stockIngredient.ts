import { Router } from "express";
import StockIngredientController from "../controllers/StockIngredientController"
 import { checkJwt } from "../middlewares/checkJwt";
 import { checkRole } from "../middlewares/checkRole";

 const router =  Router();
//Get all Orderss
router.get("/", [checkJwt, checkRole(["admin"])], StockIngredientController.listAll);

// Get one Orders
router.get("/:id([0-9]+)",[checkJwt, checkRole(["admin"])],StockIngredientController.getOneById);

router.get("/byIngredientId/:id([0-9]+)",[checkJwt, checkRole(["admin"])],StockIngredientController.getOneByIngredientId);

//Create a new Orders
router.post("/", [checkJwt, checkRole(["admin"])], StockIngredientController.newStockIngredient);

//Edit one Orders
router.patch("/:id([0-9]+)",[checkJwt, checkRole(["admin"])],StockIngredientController.editStockIngredient);

//Delete one Orders
router.delete("/:id([0-9]+)",[checkJwt, checkRole(["admin"])],StockIngredientController.deleteStockIngredient);

 export default router;