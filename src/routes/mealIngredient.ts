
import { Router } from "express";
import MealIngredientsController from "../controllers/MealIngredientController"
 import { checkJwt } from "../middlewares/checkJwt";
 import { checkRole } from "../middlewares/checkRole";

 const router =  Router();
//Get all Orderss
router.get("/", [checkJwt, checkRole(["admin"])], MealIngredientsController.listAll);

// Get one Orders
router.get("/:id([0-9]+)",[checkJwt, checkRole(["admin"])],MealIngredientsController.getOneById);

router.get("/getManyByMealId/:id([0-9]+)",[checkJwt, checkRole(["admin","waiter","customer","cashier"])],MealIngredientsController.getManyByMealId);

//Create a new Orders
router.post("/", [checkJwt, checkRole(["admin"])], MealIngredientsController.newMealIngredients);

//Edit one Orders
router.patch("/:id([0-9]+)",[checkJwt, checkRole(["admin"])],MealIngredientsController.editMealIngredients);

//Delete one Orders
router.delete("/:id([0-9]+)",[checkJwt, checkRole(["admin"])],MealIngredientsController.deleteMealIngredients);

 export default router;