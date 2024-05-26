import { Router } from "express";
 import { checkJwt } from "../middlewares/checkJwt";
 import { checkRole } from "../middlewares/checkRole";
 import TablesController  from "../controllers/TablesController";


 const router =  Router();
 //Get all tables
 router.get("/", [checkJwt, checkRole(["admin","chef"])], TablesController.listAll);

  
 // Get one table
 router.get("/:id([0-9]+)",[checkJwt, checkRole(["admin","chef"])],TablesController.getOneById);

 //Create a new tables
 router.post("/", [checkJwt, checkRole(["admin","chef"])], TablesController.newtable);

 

 export default router;