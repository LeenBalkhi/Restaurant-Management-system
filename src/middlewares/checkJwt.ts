import { Console } from "console";
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/config";

export const checkJwt = (req, res:Response, next: NextFunction) => {

  //Get the jwt token from the head
 
  // let token = <string>req.headers["authorization"];
 // console.log("koko req",res );

  //console.log("koko req",req.headers["Authorization"] );
 
  const authorizationHeader: string = <string>(
    (req.headers["authorization"] || req.headers["Authorization"])
  );
  const token = authorizationHeader.split(" ")[1];
 // console.log(token);
  
  let jwtPayload;
//  token = token.slice(7)
 // console.log(token);
  


  //Try to validate the token and get data
  try {
 //   console.log(jwt.verify(token, config.jwtSecret));
    jwtPayload = <any>jwt.verify(token, config.jwtSecret);
   //console.log("jwtPayload",jwtPayload)
   if(!res.locals)
   res.locals={};
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    console.log(error);
    
    //If token is not valid, respond with 401 (unauthorized)
    res.status(401).send( {error :error});
    return;
  }

  //The token is valid for 1 hour
  //We want to send a new token on every request
  const { userId, username } = jwtPayload;
  const newToken = jwt.sign({ userId, username }, config.jwtSecret, {
    expiresIn: "10d"
  });
  //res.setHeader("token", newToken);

  //Call the next middleware or controller
  next();
};