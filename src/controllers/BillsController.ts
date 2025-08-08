import { Request, Response } from "express";
import { getConnection, getRepository } from "typeorm";
import { validate } from "class-validator";
import { Bills } from "../entity/Bills";
import { Orders } from "../entity/Orders";

class BillsController {
  static listAll = async (req: Request, res: Response) => {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    //Get bills from database

    const bills = await queryRunner.manager
      .createQueryBuilder()
      .select("bills")
      .from(Bills, "Bills")
      .getMany();
    //Send the bills object
    res.send(bills);
  };
  static getOneById = async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    //Get the bill from database
    try {
      const bills = await queryRunner.manager
        .createQueryBuilder()
        .select("Bills")
        .from(Bills, "Bills")
        .where("Bills.id= :ids", { ids: id })
        .getMany();
      res.send(bills);
    } catch (error) {
      res.status(404).send("bill not found");
    }
  };
  static newBill = async (req: Request, res: Response) => {
    let { total, discount, fee, totalWithFee, type, bookingId, orderId } =
      req.body;
    let bill = new Bills();
    bill.total = total;
    bill.discount = discount;
    bill.fee = fee;
    bill.totalWithFee = totalWithFee;
    bill.type = type;
    //    bill.Booking = bookingId;
    bill.Order = orderId;
    //Validade if the parameters are ok
    const errors = await validate(bill);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");

    try {
      await queryRunner.manager.save(bill);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res.status(409).send("bill creation was unsuccessful, it already exists");
    } finally {
      await queryRunner.release();
      res.status(201).send("bill created");
    }
  };
  static newOrderBill = async (Order: Orders, meals, offers) => {
    const connection = getConnection();

    const queryRunner = connection.createQueryRunner();
    await queryRunner.startTransaction("SERIALIZABLE");

    await queryRunner.commitTransaction();
    await queryRunner.release();
  };
  static editBill = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = req.params.id;
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    //Get values from the body
    const { total, discount, fee, totalWithFee, type, order } = req.body;

    //Try to find bill on database
    let bill;
    try {
      bill = await queryRunner.manager
        .createQueryBuilder()
        .select("Bills")
        .from(Bills, "Bills")
        .where("Bills.id= :ids", { ids: id })
        .getMany();
    } catch (error) {
      //If not found, send a 404 response
      res.status(404).send("bill not found");
      return;
    }

    //Validate the new values on model
    bill.total = total;
    bill.discount = discount;
    bill.fee = fee;
    bill.totalWithFee = totalWithFee;
    bill.type = type;
    bill.Order = order;
    const errors = await validate(bill);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");

    try {
      await queryRunner.manager.save(bill);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res.status(409).send("bill edit was unsuccessful");
    } finally {
      await queryRunner.release();
      res.status(201).send("bill created");
    }
  };
  static deleteBill = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = req.params.id;

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    let bill;
    try {
      bill = await queryRunner.manager
        .createQueryBuilder()
        .select("Bills")
        .from(Bills, "Bills")
        .where("Bills.id= :ids", { ids: id })
        .getMany();
    } catch (error) {
      res.status(404).send("Bill not found");
      return;
    }
    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");

    try {
      await queryRunner.manager.remove(bill);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res.status(409).send("Bill deletion was unsuccessful");
    } finally {
      await queryRunner.release();
      res.status(201).send("Bill deleted");
    }
  };
}

export default BillsController;
