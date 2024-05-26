// import { Request, Response } from "express";
// import { getConnection, getRepository } from "typeorm";
// import { validate } from "class-validator";
// import { delivery } from "../entity/Delivery";

// class DeliveryController{
//     static listAll = async (req: Request, res: Response) => {
//         const connection = getConnection();
//         const queryRunner = connection.createQueryRunner();
//         //Get deliverys from database
        
//         const deliveries =  await queryRunner.manager.createQueryBuilder().
//               select("delivery").from(delivery, "delivery").getMany();
//         //Send the deliverys object
//         res.send(deliveries);
//     };
//     static getOneById = async (req: Request, res: Response) => {
//           //Get the ID from the url
//         const id: string = req.params.id;
//         const connection = getConnection();
//         const queryRunner = connection.createQueryRunner();
//         //Get the delivery from database
//         try {
//           const deliver = await queryRunner.manager.createQueryBuilder().
//           select("delivery").from(delivery, "delivery").where("delivery.id= :ids", {ids : id}).getMany(); 
//           res.send(deliver);
//          } catch (error) {
//           res.status(404).send("delivery not found");
//         }
//     };
//     static newDelivery = async (req: Request, res: Response) => {
//          //Get parameters from the body
//         let { address, telephone } = req.body;
//         let deliver = new delivery();
//         deliver.address = address;
//         deliver.telephone = telephone;

//         //Validade if the parameters are ok
//         const errors = await validate(deliver);
//         if (errors.length > 0) {
//           res.status(400).send(errors);
//           return;
//         }

//               const connection = getConnection();
//               const queryRunner = connection.createQueryRunner();
//               await queryRunner.connect();
//               await queryRunner.startTransaction("SERIALIZABLE");
    
//               try {
//                   await queryRunner.manager.save(deliver);
//                   await queryRunner.commitTransaction();

//               } catch (err) {
//                   await queryRunner.rollbackTransaction();
//                   res.status(409).send("delivery creation was unsuccessful, it already exists");

//               } finally {
//                   await queryRunner.release();
//                   res.status(201).send("delivery created");
//               }
//     };
//     static editDelivery = async (req: Request, res: Response) => {
//          //Get the ID from the url
//         const id = req.params.id;
//         const connection = getConnection();
//         const queryRunner = connection.createQueryRunner();
//         //Get values from the body
//         const { address, telephone } = req.body;

//         //Try to find delivery on database
//         let deliver;
//         try {
//           deliver = await queryRunner.manager.createQueryBuilder().
//           select("delivery").from(delivery, "delivery").where("delivery.id= :ids", {ids : id}).getMany(); 
//           } catch (error) {
//           //If not found, send a 404 response
//           res.status(404).send("delivery not found");
//           return;
//         }

//         //Validate the new values on model
//         deliver.address = address;
//         deliver.telephone = telephone;
//         const errors = await validate(deliver);
//         if (errors.length > 0) {
//           res.status(400).send(errors);
//           return;
//         }

//         await queryRunner.connect();
//         await queryRunner.startTransaction("SERIALIZABLE");

//         try {
//             await queryRunner.manager.save(deliver);
//             await queryRunner.commitTransaction();
        
//         } catch (err) {
//             await queryRunner.rollbackTransaction();
//             res.status(409).send("delivery edit was unsuccessful");
        
//         } finally {
//             await queryRunner.release();
//             res.status(201).send("delivery created");
//         } 
//     };
//     static deleteDelivery = async (req: Request, res: Response) => {
//          //Get the ID from the url
//         const id = req.params.id;

//         const connection = getConnection();
//         const queryRunner = connection.createQueryRunner();
//         let deliver;
//         try {
//           deliver = await queryRunner.manager.createQueryBuilder().
//           select("delivery").from(delivery, "delivery").where("delivery.id= :ids", {ids : id}).getMany(); 
//            } catch (error) {
//           res.status(404).send("delivery not found");
//           return;
//         }
//         await queryRunner.connect();
//               await queryRunner.startTransaction("SERIALIZABLE");
    
//               try {
//                   await queryRunner.manager.remove(deliver);
//                   await queryRunner.commitTransaction();

//               } catch (err) {
//                   await queryRunner.rollbackTransaction();
//                   res.status(409).send("delivery deletion was unsuccessful");

//               } finally {
//                   await queryRunner.release();
//                   res.status(201).send("delivery deleted");
//               } 
//     };

// };

// export default DeliveryController;    
