// import { Router } from "express";
// import DeliveryController from "../controllers/DeliveryController";
//  import { checkJwt } from "../middlewares/checkJwt";
//  import { checkRole } from "../middlewares/checkRole";

//  const router = new Router();
// //Get all Deliveries
// router.get("/", [checkJwt, checkRole(["admin"])], DeliveryController.listAll);

// // Get one Delivery
// router.get("/:id([0-9]+)",[checkJwt, checkRole(["admin"])],DeliveryController.getOneById);

// //Create a new Delivery
// router.post("/", [checkJwt, checkRole(["admin"])], DeliveryController.newDelivery);

// //Edit one Delivery
// router.patch("/:id([0-9]+)",[checkJwt, checkRole(["admin"])],DeliveryController.editDelivery);

// //Delete one Delivery
// router.delete("/:id([0-9]+)",[checkJwt, checkRole(["admin"])],DeliveryController.deleteDelivery);

//  export default router;