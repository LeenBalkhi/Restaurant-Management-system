import { Router } from "express";
import OrdersController from "../controllers/OrdersController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";

const router = Router();
//Get all Orderss
router.get("/", [checkJwt, checkRole(["admin"])], OrdersController.listAll);

// Get one Orders
router.get(
  "/:id([0-9]+)",
  [checkJwt, checkRole(["admin"])],
  OrdersController.getOneById
);
//getMyOrder
router.get(
  "/getMyOrder/",
  [checkJwt, checkRole(["admin", "waiter", "customer", "cashier"])],
  OrdersController.getMyOrder
);

//getMyOrderByStatus
router.get(
  "/getMyOrderByStatus/:status",
  [checkJwt, checkRole(["admin", "waiter", "customer", "cashier"])],
  OrdersController.getMyOrderByStatus
); 

//getOrderByStatus
router.get(
  "/:status",
  [checkJwt, checkRole(["admin", "waiter", "cashier"])],
  OrdersController.getOrderByStatus
); 

//getUnverifiedOrder
router.get(
  "/getUnverifiedOrder/",
  [checkJwt, checkRole(["admin", "waiter", "cashier"])],
  OrdersController.getUnverifiedOrder
);
//verifyOrder
router.post(
  "/verifyOrder/:id([0-9]+)",
  [checkJwt, checkRole(["admin", "waiter", "cashier"])],
  OrdersController.verifyOrder
);
/*
//putOnQueueOrder
router.get(
  "/putOnQueueOrder/:id([0-9]+)",
  [checkJwt, checkRole(["admin", "chef", "cashier", "waiter"])],
  OrdersController.putOnQueueOrder
);*/

//prepareOrder
router.get(
  "/prepareOrder/:id([0-9]+)",
  [checkJwt, checkRole(["admin", "chef"])],
  OrdersController.prepareOrder
);

router.get(
  "/fishingOrder/:id([0-9]+)",
  [checkJwt, checkRole(["admin", "chef"])],
  OrdersController.fishingOrder
);

//Create a new Orders
router.post("/", [checkJwt], OrdersController.newOrders);

//Edit one Orders
router.patch(
  "/:id([0-9]+)",
  [checkJwt, checkRole(["admin"])],
  OrdersController.editOrders
);

//Delete one Orders
router.delete(
  "/:id([0-9]+)",
  [checkJwt, checkRole(["admin"])],
  OrdersController.deleteOrders
);

export default router;
