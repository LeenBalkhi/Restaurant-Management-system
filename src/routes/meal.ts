import { Router } from "express";
import MealController from "../controllers/MealController";
 import { checkJwt } from "../middlewares/checkJwt";
 import { checkRole } from "../middlewares/checkRole";
 import multer = require('multer');
 import { Multer } from 'multer';
 import assert = require('assert');
 import { Request, Response } from "express";
import console = require("console");

import * as moment from 'moment';

 
 const router =  Router();

  //Get all meals
  router.get("/", [checkJwt, checkRole(["admin","chef"])], MealController.listAll);

  
  // Get one meal
  router.get("/:id([0-9]+)",[checkJwt, checkRole(["admin","chef"])],MealController.getOneById);

  //Create a new meal
  router.post("/", [checkJwt, checkRole(["admin","chef"])], MealController.newMeal);

  //Edit one meal
  router.patch("/:id([0-9]+)",[checkJwt, checkRole(["admin","chef"])],MealController.editMeal);

  //Delete one meal
  router.delete("/:id([0-9]+)",[checkJwt, checkRole(["admin","chef"])],MealController.deleteMeal);
  //getManyBySectionId
  router.get("/getManyBySectionId/:id([0-9]+)",[checkJwt, checkRole(["admin",,"waiter","customer","cashier"])],MealController.getManyBySectionId);

  const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './src/images')
  },
  
  filename: function (req: any, file: any, cb: any) {
      cb(null, (moment(new Date())).format('DD-MMM-YYYY-HH-mm-ss-msms') + '-'+file.originalname)
  }
});
const fileFilter = (req: any,file: any,cb: any) => {
  if(file.mimetype === "image/jpg"  || 
     file.mimetype ==="image/jpeg"  || 
     file.mimetype ===  "image/png"){
   
  cb(null, true);
 }else{
    cb(new Error("Image uploaded is not of type jpg/jpeg or png"),false);
}
}
const upload = multer({storage: storage, fileFilter : fileFilter});


upload; // $ExpectType Multer
assert.strictEqual(upload.constructor.name, 'Multer');
router.post('/uploadImage/:id([0-9]+)',[checkJwt, checkRole(["admin","chef"])], upload.single('avatar'),  MealController.uploadImage);
router.post("/uploadImage/:id([0-9]+)", [checkJwt, checkRole(["admin","chef"])], MealController.uploadImage);

 export default router;