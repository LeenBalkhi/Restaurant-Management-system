import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import * as cors from "cors";
import routes from "./routes/index";

createConnection().then(async connection => {

    const app = express();
    app.use('/images', express.static('src/images'));

    app.use((req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
        res.setHeader("Access-Control-Allow-Methods", "PATCH,POST,GET,OPTIONS,DELETE");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Headers", "content-type, authorization, X-Requested-With ,Access-Control-Max-Age");

        next();
      });
    app.use(helmet());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    
    app.use("/", routes);
    app.listen(3307,()=>
    {
        console.log("lisstening on port 3307")
    });


}).catch(error => console.log(error));
