import { Router } from "express";
import BookingController from "../controllers/BookingController";
 import { checkJwt } from "../middlewares/checkJwt";
 import { checkRole } from "../middlewares/checkRole";

 const router =  Router();
//Get all Bookings
router.get("/", [checkJwt, checkRole(["admin"])], BookingController.listAll);

// Get one Booking
router.get("/:id([0-9]+)",[checkJwt, checkRole(["admin"])],BookingController.getOneById);

//Create a new Booking
router.post("/", [checkJwt, ], BookingController.newBooking);

//Edit one Booking
router.patch("/:id([0-9]+)",[checkJwt, checkRole(["admin"])],BookingController.editBooking);

//Delete one Booking
router.delete("/:id([0-9]+)",[checkJwt, checkRole(["admin"])],BookingController.deleteBooking);

 export default router;