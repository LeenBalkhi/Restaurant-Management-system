import { Request, Response } from "express";
import { getConnection, getRepository } from "typeorm";
import { validate } from "class-validator";
import { Booking } from "../entity/Booking";
import { Resttables } from "../entity/Table";
import { state } from "../entity/Table";
import { User } from "../entity/User";
import { UserBills } from "../entity/UserBills";


class BookingController {
  static listAll = async (req: Request, res: Response) => {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    //Get bookings from database

    const bookings = await queryRunner.manager
      .createQueryBuilder()
      .select("Booking")
      .from(Booking, "Booking")
      .getMany();
    //Send the bookings object
    res.send(bookings);
  };
  static getOneById = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id: string = req.params.id;
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    //Get the booking from database
    try {
      const booking = await queryRunner.manager
        .createQueryBuilder()
        .select("Booking")
        .from(Booking, "Booking")
        .where("Booking.id= :ids", { ids: id })
        .getMany();
      res.send(booking);
    } catch (error) {
      res.status(404).send("booking not found");
    }
  };

  static newBooking = async (req, res: Response) => {
    //Get parameters from the body
    let bookingReq = req.body;
    let booking = new Booking();
    booking.name = bookingReq.name;
    booking.time = bookingReq.time;
    booking.date = bookingReq.date;
    booking.Resttables = bookingReq.tableId;
   // console.log("new booking", booking);
   if(booking.name ==null||booking.time==null||booking.date==null||booking.Resttables==null){
    res.status(409);//.send({ error: err });
    
    return {error:"all fields are requierd"};
   }

    //Validade if the parameters are ok
    const errors = await validate(booking);
    if (errors.length > 0) {
     // console.log("table");

      res.status(400).send({ error: errors });
      return;
    }
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction("SERIALIZABLE");
    let table;

    try {
      table = await queryRunner.manager
        .createQueryBuilder()
        .select("Resttables")
        .from(Resttables, "Resttables")
        .where("Resttables.id= :ids", { ids: bookingReq.tableId })
        .getOne();
   //   console.log("table", table);
    } catch (errror) {
   //   console.log(errror);

     // console.log("koko");
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      res
        .status(409)
        .send({
          message: "booking creation was unsuccessful, it already exists",
          error: errror,
        });
      return;
    }

    try {
      if (table.state !== state.BOOKED && table.state != state.OCCUPIED) {
       
        
        const id = res.locals.jwtPayload.userId;
      //   console.log(id);
         let userRole;
         //Get user role from the database
         const userRepository = getRepository(User);
         const user = await userRepository.findOne(id);
         const userBill=new UserBills();
         userBill.User=user;
         const newUserBill=  await queryRunner.manager.save(userBill);
         booking.UserBills=newUserBill;

        await queryRunner.manager.save(booking);
        table.state = state.BOOKED;
        await queryRunner.manager.save(table);


        await queryRunner.commitTransaction();
        await queryRunner.release();
        res.status(201);
        return({ message: "booking created" });
      } else {
        const prevBooking = await queryRunner.manager
          .createQueryBuilder()
          .select("Booking")
          .from(Booking, "Booking")
          .where("Booking.Resttables= :ids and Booking.date>=:dates", {
            ids: booking.Resttables,
            dates: booking.date,
          })
          .getMany();
        if (prevBooking == null || prevBooking.length == 0) {
          const id = res.locals.jwtPayload.userId;
       //   console.log(id);
          let userRole;
          //Get user role from the database
          const userRepository = getRepository(User);
          const user = await userRepository.findOne(id);
          const userBill=new UserBills();
          userBill.User=user;
          const newUserBill=  await queryRunner.manager.save(userBill);
          booking.UserBills=newUserBill;
          await queryRunner.manager.save(booking);
          await queryRunner.commitTransaction();
          await queryRunner.release();
          res.status(201);
          return({ message: "booking created" });
        } else {
          for (const book of prevBooking) {
            if (
              book.date == booking.date &&
              (book.time <= booking.time + 1 || book.time <= booking.time + -1)
            ) {
              await queryRunner.rollbackTransaction();
              await queryRunner.release();
        
              //   await queryRunner.rollbackTransaction();
              res
                .status(409); return({
                  message:
                    "booking creation was unsuccessful, it is booked in this time",
                });
              ;
            }
          }
          await queryRunner.release();
          res.status(201);
          return({ message: "booking created" });
        }
      }
    } catch (errror) {
   //   console.log(errror);

   //   console.log("koko");
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      res
        .status(409)
        .send({
          message: "booking creation was unsuccessful, it already exists",
          error: errror,
        });
      return;
    } finally {
    
    }
  };
  
  static editBooking = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = req.params.id;
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    //Get values from the body
    const { name, time, date, table } = req.body;

    //Try to find booking on database
    let booking;
    try {
      booking = await queryRunner.manager
        .createQueryBuilder()
        .select("Booking")
        .from(Booking, "Booking")
        .where("Booking.id= :ids", { ids: id })
        .getMany();
    } catch (error) {
      //If not found, send a 404 response
      res.status(404).send("booking not found");
      return;
    }

    //Validate the new values on model
    booking.name = name;
    booking.time = time;
    booking.date = date;
    booking.table = table;

    const errors = await validate(booking);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");

    try {
      await queryRunner.manager.save(booking);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res.status(409).send("booking edit was unsuccessful");
    } finally {
      await queryRunner.release();
      res.status(201).send("booking created");
    }
  };
  static deleteBooking = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = req.params.id;

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    let booking;
    try {
      booking = await queryRunner.manager
        .createQueryBuilder()
        .select("Booking")
        .from(Booking, "Booking")
        .where("Booking.id= :ids", { ids: id })
        .getMany();
    } catch (error) {
      res.status(404).send("booking not found");
      return;
    }
    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");

    try {
      await queryRunner.manager.remove(booking);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res.status(409).send("booking deletion was unsuccessful");
    } finally {
      await queryRunner.release();
      res.status(201).send("booking deleted");
    }
  };
}

export default BookingController;
