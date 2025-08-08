import { Router } from "express";
 import { checkJwt } from "../middlewares/checkJwt";
 import { checkRole } from "../middlewares/checkRole";
import CategoriesController from "../controllers/CategoriesController";
 const router =  Router();
//Get all Categories
router.get("/", [checkJwt, checkRole(["admin"])], CategoriesController.listAll);

// Get one Category
router.get("/:id([0-9]+)",[checkJwt, checkRole(["admin"])],CategoriesController.getOneById);

//Create a new Category
router.post("/", [checkJwt, checkRole(["admin"])], CategoriesController.newcategory);

//Edit one Category
// router.patch("/:id([0-9]+)",[checkJwt, checkRole(["admin"])],CategoriesController);

//Delete one Category
// router.delete("/:id([0-9]+)",[checkJwt, checkRole(["admin"])],CategoriesController);

 export default router;