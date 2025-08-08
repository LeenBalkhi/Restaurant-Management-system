import { Router, Request, Response } from "express";
import { Bills } from "../entity/Bills";
import auth from "./auth";
import ingredients from "./ingredient"
import staff from "./staff";
import bill from "./bill";
import booking from "./booking";
import category from "./category";
import meal from "./meal";
import menu from "./menu";
import offer from "./offer";
import mealOffer from "./mealOffer";

import order from "./order";
import section from "./section";
import suborder from "./suborder";
import table from "./table";
import stockIngredient from "./stockIngredient";
import stock  from "./stock";
import user  from "./user";

import mealIngredient  from "./mealIngredient";


const routes = Router();

routes.use("/auth", auth);
routes.use("/user", user);
routes.use("/ingredient", ingredients)
routes.use("/bill", bill)
routes.use("/booking", booking)
routes.use("/category", category)
routes.use("/meal", meal)
routes.use("/menu", menu)
routes.use("/mealOffer", mealOffer)
routes.use("/offer", offer)

routes.use("/order", order)
routes.use("/section", section)
routes.use("/staff", staff)
routes.use("/suborder", suborder)
routes.use("/table", table)
routes.use("/stockIngredient", stockIngredient)
routes.use("/stock", stock)
routes.use("/mealIngredient", mealIngredient)


export default routes;