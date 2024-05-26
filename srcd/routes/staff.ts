import { Router } from "express";
import staffController from "../controllers/StaffController";
  import { checkJwt } from "../middlewares/checkJwt";
  import { checkRole } from "../middlewares/checkRole";

  const router = Router();

  //Get all users
  router.get("/", [checkJwt, checkRole(["admin"])], staffController.listAll);

  // Get one user
  router.get("/:id([0-9]+)",[checkJwt, checkRole(["admin"])],staffController.getOneById);

  //Create a new user
  router.post("/", [checkJwt, checkRole(["admin"])], staffController.newstaff);

  //Edit one user
  router.patch("/:id([0-9]+)",[checkJwt, checkRole(["admin"])],staffController.editstaff);

    //Edit one user
    router.patch("/editstaffRole/:id([0-9]+)",[checkJwt, checkRole(["admin"])],staffController.editstaffRole);

  

  //Delete one user
  router.delete("/:id([0-9]+)",[checkJwt, checkRole(["admin"])],staffController.deletestaff);

  export default router;