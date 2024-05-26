import { Request, Response } from "express";
import { createQueryBuilder, getConnection, getRepository } from "typeorm";
import { validate } from "class-validator";
import { Orders, Status } from "../entity/Orders";
import { Customer } from "../entity/Customer";
import { Staff } from "../entity/Staff";
import { OrderMeals } from "../entity/OrderMeals";
import { OrderOffers } from "../entity/OrderOffers";
import BillsController from "./BillsController";
import { Bills } from "../entity/Bills";
import { Offers } from "../entity/Offers";
import { Meals } from "../entity/Meal";
import IngredientsController from "./IngredientsController";

class OrdersController {
  static listAll = async (req: Request, res: Response) => {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    const orders = await queryRunner.manager
      .createQueryBuilder()
      .select("Orders")
      .from(Orders, "Orders")
      .getMany();

    res.send(orders);
  };
  static getOneById = async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    try {
      const order = await queryRunner.manager
        .createQueryBuilder()
        .select("Orders")
        .from(Orders, "Orders")
        .where("Orders.id= :ids", { ids: id })
        .getMany();
      res.send(order);
    } catch (error) {
      res.status(404).send("order not found");
    }
  };
  static newOrders = async (req, res: Response) => {
   // console.log("koko");
    const userId = res.locals.jwtPayload.userId;
    let reqOrder = req.body;
    const order = new Orders();
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");
    let totalOffer = 0,
      totalMeal = 0,
      user = await queryRunner.manager
        .createQueryBuilder()
        .select("Customer")
        .from(Customer, "Customer")
        .where("Customer.id= :ids", { ids: userId })
        .getOne();
        if((reqOrder.meals==null&&reqOrder.offers==null)||(reqOrder.meals.length==0&&reqOrder.offers.length==0)){
          res.status(409);//.send({ error: err });
    
          return {error:"all fields are requierd"};
        }

    if (user != null) order.status = Status.UNVERIFIED;
    

    else {
      order.status = Status.VERIFIED;
      let user = await queryRunner.manager
        .createQueryBuilder()
        .select("Staff")
        .from(Staff, "Staff")
        .where("Staff.id= :ids", { ids: userId })
        .getOneOrFail();
    }
    //   console.log(userId)
    order.user = userId;

    const errors = await validate(order);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }

    let savedOrder;
    try {
      savedOrder = await queryRunner.manager.save(order);
      // console.log(savedOrder);
      if (reqOrder.offers != null) {
        for (var reqOffer of reqOrder.offers) {
          const orderOffer = new OrderOffers();
          orderOffer.quantity = reqOffer.quantity;
          orderOffer.offers = reqOffer.offerId;
          orderOffer.Orders = savedOrder;
          let offer = await queryRunner.manager
            .createQueryBuilder()
            .select("Offers")
            .from(Offers, "Offers")
            .where("Offers.id= :ids", { ids: reqOffer.offerId })
            .getOneOrFail();
          orderOffer.offerPrice = offer.price;
          totalOffer = totalOffer + offer.price * reqOffer.quantity;

          //     console.log(orderOffer);
          const errors = await validate(orderOffer);
          if (errors.length > 0) {
            await queryRunner.rollbackTransaction();

            res.status(400).send({
              message: "mealoffer newoffer was unsuccessful",
              error: errors,
            });
            return;
          }
          await queryRunner.manager.save(orderOffer);
        }
      }
      if (reqOrder.meals != null) {
        for (var reqMeal of reqOrder.meals) {
          const orderMeal = new OrderMeals();
          orderMeal.quantity = reqMeal.quantity;
          orderMeal.Meals = reqMeal.mealId;
          orderMeal.Orders = savedOrder;
          let meal = await queryRunner.manager
            .createQueryBuilder()
            .select("Meals")
            .from(Meals, "Meals")
            .where("Meals.id= :ids", { ids: reqMeal.mealId })
            .getOneOrFail();
          orderMeal.mealPrice = meal.price;
          totalMeal = totalMeal + meal.price * reqMeal.quantity;
          const errors = await validate(orderMeal);
          if (errors.length > 0) {
            await queryRunner.rollbackTransaction();

            res.status(400).send({
              message: "mealoffer newoffer was unsuccessful",
              error: errors,
            });
            return;
          }
          await queryRunner.manager.save(orderMeal);
        }
      }

      if (savedOrder.status != Status.UNVERIFIED) {
        let bill: Bills = new Bills();
        bill.total = totalOffer + totalMeal;
        bill.fee = 0.25;
        bill.totalWithFee = bill.total + (bill.fee*bill.total);
        bill.type = "unpaied";
        bill.discount = 0;
        bill.Order = savedOrder.id;
     //   console.log(bill);
        await queryRunner.manager.save(bill);
      }

      await queryRunner.commitTransaction();

      const orderOffers = await createQueryBuilder("Offers")
        .select(
          "OrderOffers.offersId , OrderOffers.id as  orderOfferId, OrderOffers.quantity,  Offers.name, Offers.price "
        )
        .leftJoin("Offers.OrderOffers", "OrderOffers")
        .where("OrderOffers.ordersId= :ids", { ids: savedOrder.id })
        .getRawMany();

      const orderMeals = await createQueryBuilder("Meals")
        .select(
          "OrderMeals.mealsId , OrderMeals.id as  orderMealId, OrderMeals.quantity,  Meals.name, Meals.price "
        )
        .leftJoin("Meals.OrderMeals", "OrderMeals")
        .where("OrderMeals.ordersId= :ids", { ids: savedOrder.id })
        .getRawMany();

      savedOrder.OrderMeals = orderMeals;
      savedOrder.OrderOffers = orderOffers;
      let x=await IngredientsController.hasEnough(savedOrder);
     // console.log(x);
     await queryRunner.release();
     res.status(201)
     return { message: "order created", order: savedOrder };
    } catch (err) {
      //console.log("koko al kokyat")
      await queryRunner.rollbackTransaction();
      res.status(404);
      return{
        message: "order creation was unsuccessful, it already exists",
        error: err,
      };
      ;
    } finally {
   //   console.log("koko finle")
      
      //.send({ message: "order created", order: savedOrder });
    }
  };      

  static getMyOrder = async (req: Request, res: Response) => {
    const userId = res.locals.jwtPayload.userId;
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    let orders,prepareOrders=[];let finishedOrders=[];
    
    try {
      
    
    await queryRunner.startTransaction("READ UNCOMMITTED");
      console.log("koko");

      orders = await queryRunner.manager
        .createQueryBuilder()
        .select("Orders")
        .from(Orders, "Orders")
        .where("Orders.user= :ids", { ids: userId })
        .getMany();
      console.log("koko");
      console.log(orders);
      for (var i = 0; i < orders.length; i++) {
        let total=0;
        const orderOffers = await createQueryBuilder("Offers")
          .select(
            "OrderOffers.offersId , OrderOffers.id as  orderOfferId, OrderOffers.quantity,  Offers.name, Offers.price "
          )
          .leftJoin("Offers.OrderOffers", "OrderOffers")
          .where("OrderOffers.ordersId= :ids", { ids: orders[i].id })
          .getRawMany();

        const orderMeals = await createQueryBuilder("Meals")
          .select(
            "OrderMeals.mealsId , OrderMeals.id as  orderMealId, OrderMeals.quantity,  Meals.name, Meals.price "
          )
          .leftJoin("Meals.OrderMeals", "OrderMeals")
          .where("OrderMeals.ordersId= :ids", { ids: orders[i].id })
          .getRawMany();
          for(var orderMeal of orderMeals){
            total +=orderMeal.price;
          }
          for(var orderOffer of orderOffers){
            total+=orderOffer.price;
          }
          console.log(total);

        orders[i].OrderMeals = orderMeals;
        orders[i].OrderOffers = orderOffers;
        orders[i].totalPrice=total;
        if(orders[i].status===Status.PREPARE){
          prepareOrders.push(orders[i]);

        }
        if(orders[i].status===Status.FINISHED){
          finishedOrders.push(orders[i]);
        }
        await queryRunner.commitTransaction();

  
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      res.status(404).send({ message: "meal not found", error: error });
    } finally {
      await queryRunner.release();
      res.status(201).send({ message: "order created", order: orders ,prepareOrders:prepareOrders, finishedOrders:finishedOrders });
    }
  };

  static getMyOrderByStatus = async (req: Request, res: Response) => {
    const userId = res.locals.jwtPayload.userId;
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.startTransaction("READ UNCOMMITTED");
    const orderStatus: string = req.params.status;
    if (orderStatus!=Status.CANCELD &&
        orderStatus!=Status.UNVERIFIED &&
        orderStatus!=Status.VERIFIED &&
        orderStatus!=Status.PREPARE &&
        orderStatus!=Status.FINISHED )
        {
          await queryRunner.commitTransaction();
          await queryRunner.release();

          res.status(404).send({ message: "order not found", error: " status is not valid" });
          return;
        }


    let orders;
    try {
      console.log("koko");

      orders = await queryRunner.manager
        .createQueryBuilder()
        .select("Orders")
        .from(Orders, "Orders")
        .where("Orders.user= :ids and Orders.status= :status", { ids: userId ,status: orderStatus})
        .getMany();
      console.log("koko");

      console.log(orders);
      for (var i = 0; i < orders.length; i++) {
        let total=0;
        const orderOffers = await createQueryBuilder("Offers")
          .select(
            "OrderOffers.offersId , OrderOffers.id as  orderOfferId, OrderOffers.quantity,  Offers.name, Offers.price "
          )
          .leftJoin("Offers.OrderOffers", "OrderOffers")
          .where("OrderOffers.ordersId= :ids ", { ids: orders[i].id  })
          .getRawMany();

        const orderMeals = await createQueryBuilder("Meals")
          .select(
            "OrderMeals.mealsId , OrderMeals.id as  orderMealId, OrderMeals.quantity,  Meals.name, Meals.price "
          )
          .leftJoin("Meals.OrderMeals", "OrderMeals")
          .where("OrderMeals.ordersId= :ids", { ids: orders[i].id })
          .getRawMany();
          for(var orderMeal of orderMeals){
            total +=orderMeal.price;
          }
          for(var orderOffer of orderOffers){
            total+=orderOffer.price;
          }
          console.log(total);

        orders[i].OrderMeals = orderMeals;
        orders[i].OrderOffers = orderOffers;
        orders[i].totalPrice=total;
        await queryRunner.commitTransaction();
        await queryRunner.release();


  
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      res.status(404).send({ message: "order not found", error: error });
    } finally {
     // await queryRunner.release();

      res.status(201).send({ message: "order ", order: orders });
    }
  };

  static getUnverifiedOrder = async (req: Request, res: Response) => {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    let orders;
    try {
      console.log("koko");

      orders = await queryRunner.manager
        .createQueryBuilder()
        .select("Orders")
        .from(Orders, "Orders")
        .where("Orders.status= :status", { status: Status.UNVERIFIED })
        .getMany();
      console.log("koko");

      console.log(orders);
      for (var i = 0; i < orders.length; i++) {
        const orderOffers = await createQueryBuilder("Offers")
          .select(
            "OrderOffers.offersId , OrderOffers.id as  orderOfferId, OrderOffers.quantity,  Offers.name, Offers.price "
          )
          .leftJoin("Offers.OrderOffers", "OrderOffers")
          .where("OrderOffers.ordersId= :ids", { ids: orders[i].id })
          .getRawMany();

        const orderMeals = await createQueryBuilder("Meals")
          .select(
            "OrderMeals.mealsId , OrderMeals.id as  orderMealId, OrderMeals.quantity,  Meals.name, Meals.price "
          )
          .leftJoin("Meals.OrderMeals", "OrderMeals")
          .where("OrderMeals.ordersId= :ids", { ids: orders[i].id })
          .getRawMany();
          let total=0;
          for(var orderMeal of orderMeals){
            total +=orderMeal.price;
          }
          for(var orderOffer of orderOffers){
            total+=orderOffer.price;
          }
          console.log(total);

        orders[i].OrderMeals = orderMeals;
        orders[i].OrderOffers = orderOffers;
        orders[i].totalPrice=total;

      }
    } catch (error) {
      await queryRunner.release();

      res.status(404).send({ message: "meal not found", error: error });
    } finally {
      await queryRunner.release();
      res.status(201).send({ message: "order created", order: orders });
    }
  };

  static getOrderByStatus = async (req: Request, res: Response) => {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    const orderStatus: string = req.params.status;
    if (orderStatus!=Status.CANCELD &&
        orderStatus!=Status.UNVERIFIED &&
        orderStatus!=Status.VERIFIED &&
        orderStatus!=Status.PREPARE &&
        orderStatus!=Status.FINISHED )
        {
          res.status(404).send({ message: "order not found", error: " status is not valid" });

        }
    let orders;
    try {
      console.log("koko");

      orders = await queryRunner.manager
        .createQueryBuilder()
        .select("Orders")
        .from(Orders, "Orders")
        .where("Orders.status= :status", { status: orderStatus })
        .getMany();
      console.log("koko");

      console.log(orders);
      for (var i = 0; i < orders.length; i++) {
        const orderOffers = await createQueryBuilder("Offers")
          .select(
            "OrderOffers.offersId , OrderOffers.id as  orderOfferId, OrderOffers.quantity,  Offers.name, Offers.price "
          )
          .leftJoin("Offers.OrderOffers", "OrderOffers")
          .where("OrderOffers.ordersId= :ids", { ids: orders[i].id })
          .getRawMany();

        const orderMeals = await createQueryBuilder("Meals")
          .select(
            "OrderMeals.mealsId , OrderMeals.id as  orderMealId, OrderMeals.quantity,  Meals.name, Meals.price "
          )
          .leftJoin("Meals.OrderMeals", "OrderMeals")
          .where("OrderMeals.ordersId= :ids", { ids: orders[i].id })
          .getRawMany();
          let total=0;
          for(var orderMeal of orderMeals){
            total +=orderMeal.price;
          }
          for(var orderOffer of orderOffers){
            total+=orderOffer.price;
          }
          console.log(total);

        orders[i].OrderMeals = orderMeals;
        orders[i].OrderOffers = orderOffers;
        orders[i].totalPrice=total;

      }
    } catch (error) {
      res.status(404).send({ message: "meal not found", error: error });
    } finally {
      await queryRunner.release();
      res.status(201).send({ message: "order created", order: orders });
    }
  };


  static verifyOrder = async (req: Request, res: Response) => {
    const id = req.params.id;
    let unverified = req.body.verify;
    console.log(unverified+"   kkk");
    console.log(req.body);



    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");
    try {
      let order = await queryRunner.manager
        .createQueryBuilder()
        .select("Orders")
        .from(Orders, "Orders")
        .where("Orders.id= :ids", { ids: id })
        .getOneOrFail();
        console.log(" kook "+unverified)
        if(!unverified){
          order.status = Status.CANCELD;
      
          await queryRunner.manager.save(order);

        }
        else{
          if(order.status===Status.UNVERIFIED){
            order.status = Status.VERIFIED;
      
            await queryRunner.manager.save(order);
      
            const orderOffers =  await queryRunner.manager
            .createQueryBuilder()
            .select("OrderOffers")
            .from(OrderOffers, "OrderOffers")
            .where("OrderOffers.Orders= :ids", { ids: id })
            .getMany();
            let total = 0;
      
            for (var orderOffer of orderOffers) {
              console.log(orderOffer.quantity* orderOffer.offerPrice);
              total +=( orderOffer.quantity * orderOffer.offerPrice);
                console.log(total);
            }
      
            const orderMeals =  await queryRunner.manager
              .createQueryBuilder()
              .select("OrderMeals")
              .from(OrderMeals, "OrderMeals")
              .where("OrderMeals.Orders= :ids", { ids: id })
              .getMany();
            let bill = new Bills();
            console.log(total);
            for (var orderMeal of orderMeals) {
              console.log(orderMeal.quantity*orderMeal.mealPrice);
              total += (orderMeal.quantity * orderMeal.mealPrice);
                console.log(total);
            }
           
            bill.total=total;
            bill.fee = 0.25;
            bill.totalWithFee = bill.total * 0.25;
            bill.type = "unpaid";
            bill.discount = 0;
            bill.Order = order.id;
            console.log(bill);
            await queryRunner.manager.save(bill);}
        }

   

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res.status(409).send({
        message: "order edited was unsuccessful",
        error: err,
      });
      return;
    } finally {
      await queryRunner.release();
      res.status(201).send({ message: "order edited" });
    }
  };
  /*static putOnQueueOrder = async (req: Request, res: Response) => {
    const id = req.params.id;

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");
    try {
      let order = await queryRunner.manager
        .createQueryBuilder()
        .select("Orders")
        .from(Orders, "Orders")
        .where("Orders.id= :ids", { ids: id })
        .getOneOrFail();
      order.status = Status.QUEUE;
      await queryRunner.manager.save(order);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res.status(409).send({
        message: "order edited was unsuccessful",
        error: err,
      });
      return;
    } finally {
      await queryRunner.release();
      res.status(201).send({ message: "order edited" });
    }
  };*/
  static prepareOrder = async (req: Request, res: Response) => {
    const id = req.params.id;

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");
    try {
      let order = await queryRunner.manager
        .createQueryBuilder()
        .select("Orders")
        .from(Orders, "Orders")
        .where("Orders.id= :ids", { ids: id })
        .getOneOrFail();
      order.status = Status.PREPARE;
      await queryRunner.manager.save(order);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res.status(409).send({
        message: "order edited was unsuccessful",
        error: err,
      });
      return;
    } finally {
      await queryRunner.release();
      res.status(201).send({ message: "order edited" });
    }
  };
  static fishingOrder = async (req: Request, res: Response) => {
    const id = req.params.id;

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");
    try {
      let order = await queryRunner.manager
        .createQueryBuilder()
        .select("Orders")
        .from(Orders, "Orders")
        .where("Orders.id= :ids", { ids: id })
        .getOneOrFail();
      order.status = Status.FINISHED;
      await queryRunner.manager.save(order);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res.status(409).send({
        message: "order edited was unsuccessful",
        error: err,
      });
      return;
    } finally {
      await queryRunner.release();
      res.status(201).send({ message: "order edited" });
    }
  };

  static editOrders = async (req: Request, res: Response) => {
    const id = req.params.id;
    const { OrderMeal, bill } = req.body;
    let order;

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    try {
      const Meal = await queryRunner.manager
        .createQueryBuilder()
        .select("Orders")
        .from(Orders, "Orders")
        .where("Orders.id= :ids", { ids: id })
        .getMany();
    } catch (error) {
      res.status(404).send("meal not found");
    }

    order.OrderMeals = OrderMeal;
    order.Bill = bill;
    const errors = await validate(order);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");

    try {
      await queryRunner.manager.save(order);
      const orderOffers = await createQueryBuilder("Offers")
        .select(
          "OrderOffers.offersId , OrderOffers.id as  orderOfferId, OrderOffers.quantity,  Offers.name, Offers.price "
        )
        .leftJoin("Offers.OrderOffers", "OrderOffers")
        .where("OrderOffers.ordersId= :ids", { ids: id })
        .getRawMany();

      const orderMeals = await createQueryBuilder("Meals")
        .select(
          "OrderMeals.mealsId , OrderMeals.id as  orderMealId, OrderMeals.quantity,  Meals.name, Meals.price "
        )
        .leftJoin("Meals.OrderMeals", "OrderMeals")
        .where("OrderMeals.ordersId= :ids", { ids: id })
        .getRawMany();

      let bill: Bills = new Bills();
      bill.total = 0;
      for (const orderMeal of orderMeals) {
        bill.total = bill.total + orderMeal.quantity * orderMeal.Meals.price;
      }

      for (const orderOffer of orderOffers) {
        bill.total = bill.total + orderOffer.quantity * orderOffer.Meals.price;
      }
      bill.fee = (bill.total * 25.0) / 100.0;
      bill.totalWithFee = bill.total + bill.fee;
      bill.type = "delivery";
      bill.discount = 0;
      bill.Order = order;
      await queryRunner.manager.save(bill);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res.status(409).send("order edit was unsuccessful");
    } finally {
      await queryRunner.release();
      res.status(201).send("order created");
    }
  };
  static deleteOrders = async (req: Request, res: Response) => {
    const id = req.params.id;
    let order;

    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    try {
      order = await connection
        .createQueryBuilder()
        .select("Orders")
        .from(Orders, "Orders")
        .where("Orders.id= :ids", { ids: id })
        .getMany();
    } catch (error) {
      res.status(404).send("meal not found");
    }
    await queryRunner.connect();
    await queryRunner.startTransaction("SERIALIZABLE");

    try {
      await queryRunner.manager.remove(order);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      res.status(409).send("order deletion was unsuccessful");
    } finally {
      await queryRunner.release();
      res.status(201).send("order deleted");
    }
  };
}

export default OrdersController;
