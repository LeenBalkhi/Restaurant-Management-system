"use strict";
exports.__esModule = true;
exports.checkJwt = void 0;
var jwt = require("jsonwebtoken");
var config_1 = require("../config/config");
exports.checkJwt = function (req, res, next) {
    //Get the jwt token from the head
    // let token = <string>req.headers["authorization"];
    // console.log("koko req",res );
    //console.log("koko req",req.headers["Authorization"] );
    var authorizationHeader = ((req.headers["authorization"] || req.headers["Authorization"]));
    var token = authorizationHeader.split(" ")[1];
    // console.log(token);
    var jwtPayload;
    //  token = token.slice(7)
    // console.log(token);
    //Try to validate the token and get data
    try {
        //   console.log(jwt.verify(token, config.jwtSecret));
        jwtPayload = jwt.verify(token, config_1["default"].jwtSecret);
        //console.log("jwtPayload",jwtPayload)
        if (!res.locals)
            res.locals = {};
        res.locals.jwtPayload = jwtPayload;
    }
    catch (error) {
        console.log(error);
        //If token is not valid, respond with 401 (unauthorized)
        res.status(401).send({ error: error });
        return;
    }
    //The token is valid for 1 hour
    //We want to send a new token on every request
    var userId = jwtPayload.userId, username = jwtPayload.username;
    var newToken = jwt.sign({ userId: userId, username: username }, config_1["default"].jwtSecret, {
        expiresIn: "10d"
    });
    //res.setHeader("token", newToken);
    //Call the next middleware or controller
    next();
};
