import { Router } from "express";
import IngredientsController from "../controllers/IngredientsController";
import stockIngredientController from "../controllers/StockIngredientController"
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";
const router = Router();

//Get all ingredients
router.get("/", [checkJwt, checkRole(["admin"])], IngredientsController.listAll);

// Get one ingredient
router.get("/:id([0-9]+)",[checkJwt, checkRole(["admin"])],IngredientsController.getOneById);

//Create a new ingredient
router.post("/", [checkJwt, checkRole(["admin"])], IngredientsController.newIngredient);

//create new items of this ingredient in stock
router.post("/:id([0-9]+)/stock",[checkJwt, checkRole(["admin"])],stockIngredientController.newStockIngredient )

//Edit one ingredient
router.patch("/:id([0-9]+)",[checkJwt, checkRole(["admin"])],IngredientsController.editIngredient);

//Delete one ingredient
router.delete("/:id([0-9]+)",[checkJwt, checkRole(["admin"])],IngredientsController.deleteIngredient);

export default router;