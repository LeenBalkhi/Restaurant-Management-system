"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var typeorm_1 = require("typeorm");
var class_validator_1 = require("class-validator");
var Orders_1 = require("../entity/Orders");
var Customer_1 = require("../entity/Customer");
var Staff_1 = require("../entity/Staff");
var OrderMeals_1 = require("../entity/OrderMeals");
var OrderOffers_1 = require("../entity/OrderOffers");
var Bills_1 = require("../entity/Bills");
var Offers_1 = require("../entity/Offers");
var Meal_1 = require("../entity/Meal");
var IngredientsController_1 = require("./IngredientsController");
var OrdersController = /** @class */ (function () {
    function OrdersController() {
    }
    OrdersController.listAll = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var connection, queryRunner, orders;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    connection = typeorm_1.getConnection();
                    queryRunner = connection.createQueryRunner();
                    return [4 /*yield*/, queryRunner.manager
                            .createQueryBuilder()
                            .select("Orders")
                            .from(Orders_1.Orders, "Orders")
                            .getMany()];
                case 1:
                    orders = _a.sent();
                    res.send(orders);
                    return [2 /*return*/];
            }
        });
    }); };
    OrdersController.getOneById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, connection, queryRunner, order, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = req.params.id;
                    connection = typeorm_1.getConnection();
                    queryRunner = connection.createQueryRunner();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, queryRunner.manager
                            .createQueryBuilder()
                            .select("Orders")
                            .from(Orders_1.Orders, "Orders")
                            .where("Orders.id= :ids", { ids: id })
                            .getMany()];
                case 2:
                    order = _a.sent();
                    res.send(order);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    res.status(404).send("order not found");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    OrdersController.newOrders = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, reqOrder, order, connection, queryRunner, totalOffer, totalMeal, user, user_1, errors, savedOrder, _i, _a, reqOffer, orderOffer, offer, errors_1, _b, _c, reqMeal, orderMeal, meal, errors_2, bill, orderOffers, orderMeals, x, err_1;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    userId = res.locals.jwtPayload.userId;
                    reqOrder = req.body;
                    order = new Orders_1.Orders();
                    connection = typeorm_1.getConnection();
                    queryRunner = connection.createQueryRunner();
                    return [4 /*yield*/, queryRunner.connect()];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, queryRunner.startTransaction("SERIALIZABLE")];
                case 2:
                    _d.sent();
                    totalOffer = 0, totalMeal = 0;
                    return [4 /*yield*/, queryRunner.manager
                            .createQueryBuilder()
                            .select("Customer")
                            .from(Customer_1.Customer, "Customer")
                            .where("Customer.id= :ids", { ids: userId })
                            .getOne()];
                case 3:
                    user = _d.sent();
                    if ((reqOrder.meals == null && reqOrder.offers == null) || (reqOrder.meals.length == 0 && reqOrder.offers.length == 0)) {
                        res.status(409); //.send({ error: err });
                        return [2 /*return*/, { error: "all fields are requierd" }];
                    }
                    if (!(user != null)) return [3 /*break*/, 4];
                    order.status = Orders_1.Status.UNVERIFIED;
                    return [3 /*break*/, 6];
                case 4:
                    order.status = Orders_1.Status.VERIFIED;
                    return [4 /*yield*/, queryRunner.manager
                            .createQueryBuilder()
                            .select("Staff")
                            .from(Staff_1.Staff, "Staff")
                            .where("Staff.id= :ids", { ids: userId })
                            .getOneOrFail()];
                case 5:
                    user_1 = _d.sent();
                    _d.label = 6;
                case 6:
                    //   console.log(userId)
                    order.user = userId;
                    return [4 /*yield*/, class_validator_1.validate(order)];
                case 7:
                    errors = _d.sent();
                    if (errors.length > 0) {
                        res.status(400).send(errors);
                        return [2 /*return*/];
                    }
                    _d.label = 8;
                case 8:
                    _d.trys.push([8, 33, 35, 36]);
                    return [4 /*yield*/, queryRunner.manager.save(order)];
                case 9:
                    savedOrder = _d.sent();
                    if (!(reqOrder.offers != null)) return [3 /*break*/, 17];
                    _i = 0, _a = reqOrder.offers;
                    _d.label = 10;
                case 10:
                    if (!(_i < _a.length)) return [3 /*break*/, 17];
                    reqOffer = _a[_i];
                    orderOffer = new OrderOffers_1.OrderOffers();
                    orderOffer.quantity = reqOffer.quantity;
                    orderOffer.offers = reqOffer.offerId;
                    orderOffer.Orders = savedOrder;
                    return [4 /*yield*/, queryRunner.manager
                            .createQueryBuilder()
                            .select("Offers")
                            .from(Offers_1.Offers, "Offers")
                            .where("Offers.id= :ids", { ids: reqOffer.offerId })
                            .getOneOrFail()];
                case 11:
                    offer = _d.sent();
                    orderOffer.offerPrice = offer.price;
                    totalOffer = totalOffer + offer.price * reqOffer.quantity;
                    return [4 /*yield*/, class_validator_1.validate(orderOffer)];
                case 12:
                    errors_1 = _d.sent();
                    if (!(errors_1.length > 0)) return [3 /*break*/, 14];
                    return [4 /*yield*/, queryRunner.rollbackTransaction()];
                case 13:
                    _d.sent();
                    res.status(400).send({
                        message: "mealoffer newoffer was unsuccessful",
                        error: errors_1
                    });
                    return [2 /*return*/];
                case 14: return [4 /*yield*/, queryRunner.manager.save(orderOffer)];
                case 15:
                    _d.sent();
                    _d.label = 16;
                case 16:
                    _i++;
                    return [3 /*break*/, 10];
                case 17:
                    if (!(reqOrder.meals != null)) return [3 /*break*/, 25];
                    _b = 0, _c = reqOrder.meals;
                    _d.label = 18;
                case 18:
                    if (!(_b < _c.length)) return [3 /*break*/, 25];
                    reqMeal = _c[_b];
                    orderMeal = new OrderMeals_1.OrderMeals();
                    orderMeal.quantity = reqMeal.quantity;
                    orderMeal.Meals = reqMeal.mealId;
                    orderMeal.Orders = savedOrder;
                    return [4 /*yield*/, queryRunner.manager
                            .createQueryBuilder()
                            .select("Meals")
                            .from(Meal_1.Meals, "Meals")
                            .where("Meals.id= :ids", { ids: reqMeal.mealId })
                            .getOneOrFail()];
                case 19:
                    meal = _d.sent();
                    orderMeal.mealPrice = meal.price;
                    totalMeal = totalMeal + meal.price * reqMeal.quantity;
                    return [4 /*yield*/, class_validator_1.validate(orderMeal)];
                case 20:
                    errors_2 = _d.sent();
                    if (!(errors_2.length > 0)) return [3 /*break*/, 22];
                    return [4 /*yield*/, queryRunner.rollbackTransaction()];
                case 21:
                    _d.sent();
                    res.status(400).send({
                        message: "mealoffer newoffer was unsuccessful",
                        error: errors_2
                    });
                    return [2 /*return*/];
                case 22: return [4 /*yield*/, queryRunner.manager.save(orderMeal)];
                case 23:
                    _d.sent();
                    _d.label = 24;
                case 24:
                    _b++;
                    return [3 /*break*/, 18];
                case 25:
                    if (!(savedOrder.status != Orders_1.Status.UNVERIFIED)) return [3 /*break*/, 27];
                    bill = new Bills_1.Bills();
                    bill.total = totalOffer + totalMeal;
                    bill.fee = 0.25;
                    bill.totalWithFee = bill.total + (bill.fee * bill.total);
                    bill.type = "unpaied";
                    bill.discount = 0;
                    bill.Order = savedOrder.id;
                    //   console.log(bill);
                    return [4 /*yield*/, queryRunner.manager.save(bill)];
                case 26:
                    //   console.log(bill);
                    _d.sent();
                    _d.label = 27;
                case 27: return [4 /*yield*/, queryRunner.commitTransaction()];
                case 28:
                    _d.sent();
                    return [4 /*yield*/, typeorm_1.createQueryBuilder("Offers")
                            .select("OrderOffers.offersId , OrderOffers.id as  orderOfferId, OrderOffers.quantity,  Offers.name, Offers.price ")
                            .leftJoin("Offers.OrderOffers", "OrderOffers")
                            .where("OrderOffers.ordersId= :ids", { ids: savedOrder.id })
                            .getRawMany()];
                case 29:
                    orderOffers = _d.sent();
                    return [4 /*yield*/, typeorm_1.createQueryBuilder("Meals")
                            .select("OrderMeals.mealsId , OrderMeals.id as  orderMealId, OrderMeals.quantity,  Meals.name, Meals.price ")
                            .leftJoin("Meals.OrderMeals", "OrderMeals")
                            .where("OrderMeals.ordersId= :ids", { ids: savedOrder.id })
                            .getRawMany()];
                case 30:
                    orderMeals = _d.sent();
                    savedOrder.OrderMeals = orderMeals;
                    savedOrder.OrderOffers = orderOffers;
                    return [4 /*yield*/, IngredientsController_1["default"].hasEnough(savedOrder)];
                case 31:
                    x = _d.sent();
                    // console.log(x);
                    return [4 /*yield*/, queryRunner.release()];
                case 32:
                    // console.log(x);
                    _d.sent();
                    res.status(201);
                    return [2 /*return*/, { message: "order created", order: savedOrder }];
                case 33:
                    err_1 = _d.sent();
                    //console.log("koko al kokyat")
                    return [4 /*yield*/, queryRunner.rollbackTransaction()];
                case 34:
                    //console.log("koko al kokyat")
                    _d.sent();
                    res.status(404);
                    return [2 /*return*/, {
                            message: "order creation was unsuccessful, it already exists",
                            error: err_1
                        }];
                case 35: return [7 /*endfinally*/];
                case 36: return [2 /*return*/];
            }
        });
    }); };
    OrdersController.getMyOrder = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, connection, queryRunner, orders, prepareOrders, finishedOrders, i, total, orderOffers, orderMeals, _i, orderMeals_1, orderMeal, _a, orderOffers_1, orderOffer, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    userId = res.locals.jwtPayload.userId;
                    connection = typeorm_1.getConnection();
                    queryRunner = connection.createQueryRunner();
                    prepareOrders = [];
                    finishedOrders = [];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 10, 12, 14]);
                    return [4 /*yield*/, queryRunner.startTransaction("READ UNCOMMITTED")];
                case 2:
                    _b.sent();
                    console.log("koko");
                    return [4 /*yield*/, queryRunner.manager
                            .createQueryBuilder()
                            .select("Orders")
                            .from(Orders_1.Orders, "Orders")
                            .where("Orders.user= :ids", { ids: userId })
                            .getMany()];
                case 3:
                    orders = _b.sent();
                    console.log("koko");
                    console.log(orders);
                    i = 0;
                    _b.label = 4;
                case 4:
                    if (!(i < orders.length)) return [3 /*break*/, 9];
                    total = 0;
                    return [4 /*yield*/, typeorm_1.createQueryBuilder("Offers")
                            .select("OrderOffers.offersId , OrderOffers.id as  orderOfferId, OrderOffers.quantity,  Offers.name, Offers.price ")
                            .leftJoin("Offers.OrderOffers", "OrderOffers")
                            .where("OrderOffers.ordersId= :ids", { ids: orders[i].id })
                            .getRawMany()];
                case 5:
                    orderOffers = _b.sent();
                    return [4 /*yield*/, typeorm_1.createQueryBuilder("Meals")
                            .select("OrderMeals.mealsId , OrderMeals.id as  orderMealId, OrderMeals.quantity,  Meals.name, Meals.price ")
                            .leftJoin("Meals.OrderMeals", "OrderMeals")
                            .where("OrderMeals.ordersId= :ids", { ids: orders[i].id })
                            .getRawMany()];
                case 6:
                    orderMeals = _b.sent();
                    for (_i = 0, orderMeals_1 = orderMeals; _i < orderMeals_1.length; _i++) {
                        orderMeal = orderMeals_1[_i];
                        total += orderMeal.price;
                    }
                    for (_a = 0, orderOffers_1 = orderOffers; _a < orderOffers_1.length; _a++) {
                        orderOffer = orderOffers_1[_a];
                        total += orderOffer.price;
                    }
                    console.log(total);
                    orders[i].OrderMeals = orderMeals;
                    orders[i].OrderOffers = orderOffers;
                    orders[i].totalPrice = total;
                    if (orders[i].status === Orders_1.Status.PREPARE) {
                        prepareOrders.push(orders[i]);
                    }
                    if (orders[i].status === Orders_1.Status.FINISHED) {
                        finishedOrders.push(orders[i]);
                    }
                    return [4 /*yield*/, queryRunner.commitTransaction()];
                case 7:
                    _b.sent();
                    _b.label = 8;
                case 8:
                    i++;
                    return [3 /*break*/, 4];
                case 9: return [3 /*break*/, 14];
                case 10:
                    error_2 = _b.sent();
                    return [4 /*yield*/, queryRunner.rollbackTransaction()];
                case 11:
                    _b.sent();
                    res.status(404).send({ message: "meal not found", error: error_2 });
                    return [3 /*break*/, 14];
                case 12: return [4 /*yield*/, queryRunner.release()];
                case 13:
                    _b.sent();
                    res.status(201).send({ message: "order created", order: orders, prepareOrders: prepareOrders, finishedOrders: finishedOrders });
                    return [7 /*endfinally*/];
                case 14: return [2 /*return*/];
            }
        });
    }); };
    OrdersController.getMyOrderByStatus = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, connection, queryRunner, orderStatus, orders, i, total, orderOffers, orderMeals, _i, orderMeals_2, orderMeal, _a, orderOffers_2, orderOffer, error_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    userId = res.locals.jwtPayload.userId;
                    connection = typeorm_1.getConnection();
                    queryRunner = connection.createQueryRunner();
                    return [4 /*yield*/, queryRunner.startTransaction("READ UNCOMMITTED")];
                case 1:
                    _b.sent();
                    orderStatus = req.params.status;
                    if (!(orderStatus != Orders_1.Status.CANCELD &&
                        orderStatus != Orders_1.Status.UNVERIFIED &&
                        orderStatus != Orders_1.Status.VERIFIED &&
                        orderStatus != Orders_1.Status.PREPARE &&
                        orderStatus != Orders_1.Status.FINISHED)) return [3 /*break*/, 4];
                    return [4 /*yield*/, queryRunner.commitTransaction()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, queryRunner.release()];
                case 3:
                    _b.sent();
                    res.status(404).send({ message: "order not found", error: " status is not valid" });
                    return [2 /*return*/];
                case 4:
                    _b.trys.push([4, 13, 16, 17]);
                    console.log("koko");
                    return [4 /*yield*/, queryRunner.manager
                            .createQueryBuilder()
                            .select("Orders")
                            .from(Orders_1.Orders, "Orders")
                            .where("Orders.user= :ids and Orders.status= :status", { ids: userId, status: orderStatus })
                            .getMany()];
                case 5:
                    orders = _b.sent();
                    console.log("koko");
                    console.log(orders);
                    i = 0;
                    _b.label = 6;
                case 6:
                    if (!(i < orders.length)) return [3 /*break*/, 12];
                    total = 0;
                    return [4 /*yield*/, typeorm_1.createQueryBuilder("Offers")
                            .select("OrderOffers.offersId , OrderOffers.id as  orderOfferId, OrderOffers.quantity,  Offers.name, Offers.price ")
                            .leftJoin("Offers.OrderOffers", "OrderOffers")
                            .where("OrderOffers.ordersId= :ids ", { ids: orders[i].id })
                            .getRawMany()];
                case 7:
                    orderOffers = _b.sent();
                    return [4 /*yield*/, typeorm_1.createQueryBuilder("Meals")
                            .select("OrderMeals.mealsId , OrderMeals.id as  orderMealId, OrderMeals.quantity,  Meals.name, Meals.price ")
                            .leftJoin("Meals.OrderMeals", "OrderMeals")
                            .where("OrderMeals.ordersId= :ids", { ids: orders[i].id })
                            .getRawMany()];
                case 8:
                    orderMeals = _b.sent();
                    for (_i = 0, orderMeals_2 = orderMeals; _i < orderMeals_2.length; _i++) {
                        orderMeal = orderMeals_2[_i];
                        total += orderMeal.price;
                    }
                    for (_a = 0, orderOffers_2 = orderOffers; _a < orderOffers_2.length; _a++) {
                        orderOffer = orderOffers_2[_a];
                        total += orderOffer.price;
                    }
                    console.log(total);
                    orders[i].OrderMeals = orderMeals;
                    orders[i].OrderOffers = orderOffers;
                    orders[i].totalPrice = total;
                    return [4 /*yield*/, queryRunner.commitTransaction()];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, queryRunner.release()];
                case 10:
                    _b.sent();
                    _b.label = 11;
                case 11:
                    i++;
                    return [3 /*break*/, 6];
                case 12: return [3 /*break*/, 17];
                case 13:
                    error_3 = _b.sent();
                    return [4 /*yield*/, queryRunner.rollbackTransaction()];
                case 14:
                    _b.sent();
                    return [4 /*yield*/, queryRunner.release()];
                case 15:
                    _b.sent();
                    res.status(404).send({ message: "order not found", error: error_3 });
                    return [3 /*break*/, 17];
                case 16:
                    // await queryRunner.release();
                    res.status(201).send({ message: "order ", order: orders });
                    return [7 /*endfinally*/];
                case 17: return [2 /*return*/];
            }
        });
    }); };
    OrdersController.getUnverifiedOrder = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var connection, queryRunner, orders, i, orderOffers, orderMeals, total, _i, orderMeals_3, orderMeal, _a, orderOffers_3, orderOffer, error_4;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    connection = typeorm_1.getConnection();
                    queryRunner = connection.createQueryRunner();
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 8, 10, 12]);
                    console.log("koko");
                    return [4 /*yield*/, queryRunner.manager
                            .createQueryBuilder()
                            .select("Orders")
                            .from(Orders_1.Orders, "Orders")
                            .where("Orders.status= :status", { status: Orders_1.Status.UNVERIFIED })
                            .getMany()];
                case 2:
                    orders = _b.sent();
                    console.log("koko");
                    console.log(orders);
                    i = 0;
                    _b.label = 3;
                case 3:
                    if (!(i < orders.length)) return [3 /*break*/, 7];
                    return [4 /*yield*/, typeorm_1.createQueryBuilder("Offers")
                            .select("OrderOffers.offersId , OrderOffers.id as  orderOfferId, OrderOffers.quantity,  Offers.name, Offers.price ")
                            .leftJoin("Offers.OrderOffers", "OrderOffers")
                            .where("OrderOffers.ordersId= :ids", { ids: orders[i].id })
                            .getRawMany()];
                case 4:
                    orderOffers = _b.sent();
                    return [4 /*yield*/, typeorm_1.createQueryBuilder("Meals")
                            .select("OrderMeals.mealsId , OrderMeals.id as  orderMealId, OrderMeals.quantity,  Meals.name, Meals.price ")
                            .leftJoin("Meals.OrderMeals", "OrderMeals")
                            .where("OrderMeals.ordersId= :ids", { ids: orders[i].id })
                            .getRawMany()];
                case 5:
                    orderMeals = _b.sent();
                    total = 0;
                    for (_i = 0, orderMeals_3 = orderMeals; _i < orderMeals_3.length; _i++) {
                        orderMeal = orderMeals_3[_i];
                        total += orderMeal.price;
                    }
                    for (_a = 0, orderOffers_3 = orderOffers; _a < orderOffers_3.length; _a++) {
                        orderOffer = orderOffers_3[_a];
                        total += orderOffer.price;
                    }
                    console.log(total);
                    orders[i].OrderMeals = orderMeals;
                    orders[i].OrderOffers = orderOffers;
                    orders[i].totalPrice = total;
                    _b.label = 6;
                case 6:
                    i++;
                    return [3 /*break*/, 3];
                case 7: return [3 /*break*/, 12];
                case 8:
                    error_4 = _b.sent();
                    return [4 /*yield*/, queryRunner.release()];
                case 9:
                    _b.sent();
                    res.status(404).send({ message: "meal not found", error: error_4 });
                    return [3 /*break*/, 12];
                case 10: return [4 /*yield*/, queryRunner.release()];
                case 11:
                    _b.sent();
                    res.status(201).send({ message: "order created", order: orders });
                    return [7 /*endfinally*/];
                case 12: return [2 /*return*/];
            }
        });
    }); };
    OrdersController.getOrderByStatus = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var connection, queryRunner, orderStatus, orders, i, orderOffers, orderMeals, total, _i, orderMeals_4, orderMeal, _a, orderOffers_4, orderOffer, error_5;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    connection = typeorm_1.getConnection();
                    queryRunner = connection.createQueryRunner();
                    orderStatus = req.params.status;
                    if (orderStatus != Orders_1.Status.CANCELD &&
                        orderStatus != Orders_1.Status.UNVERIFIED &&
                        orderStatus != Orders_1.Status.VERIFIED &&
                        orderStatus != Orders_1.Status.PREPARE &&
                        orderStatus != Orders_1.Status.FINISHED) {
                        res.status(404).send({ message: "order not found", error: " status is not valid" });
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 8, 9, 11]);
                    console.log("koko");
                    return [4 /*yield*/, queryRunner.manager
                            .createQueryBuilder()
                            .select("Orders")
                            .from(Orders_1.Orders, "Orders")
                            .where("Orders.status= :status", { status: orderStatus })
                            .getMany()];
                case 2:
                    orders = _b.sent();
                    console.log("koko");
                    console.log(orders);
                    i = 0;
                    _b.label = 3;
                case 3:
                    if (!(i < orders.length)) return [3 /*break*/, 7];
                    return [4 /*yield*/, typeorm_1.createQueryBuilder("Offers")
                            .select("OrderOffers.offersId , OrderOffers.id as  orderOfferId, OrderOffers.quantity,  Offers.name, Offers.price ")
                            .leftJoin("Offers.OrderOffers", "OrderOffers")
                            .where("OrderOffers.ordersId= :ids", { ids: orders[i].id })
                            .getRawMany()];
                case 4:
                    orderOffers = _b.sent();
                    return [4 /*yield*/, typeorm_1.createQueryBuilder("Meals")
                            .select("OrderMeals.mealsId , OrderMeals.id as  orderMealId, OrderMeals.quantity,  Meals.name, Meals.price ")
                            .leftJoin("Meals.OrderMeals", "OrderMeals")
                            .where("OrderMeals.ordersId= :ids", { ids: orders[i].id })
                            .getRawMany()];
                case 5:
                    orderMeals = _b.sent();
                    total = 0;
                    for (_i = 0, orderMeals_4 = orderMeals; _i < orderMeals_4.length; _i++) {
                        orderMeal = orderMeals_4[_i];
                        total += orderMeal.price;
                    }
                    for (_a = 0, orderOffers_4 = orderOffers; _a < orderOffers_4.length; _a++) {
                        orderOffer = orderOffers_4[_a];
                        total += orderOffer.price;
                    }
                    console.log(total);
                    orders[i].OrderMeals = orderMeals;
                    orders[i].OrderOffers = orderOffers;
                    orders[i].totalPrice = total;
                    _b.label = 6;
                case 6:
                    i++;
                    return [3 /*break*/, 3];
                case 7: return [3 /*break*/, 11];
                case 8:
                    error_5 = _b.sent();
                    res.status(404).send({ message: "meal not found", error: error_5 });
                    return [3 /*break*/, 11];
                case 9: return [4 /*yield*/, queryRunner.release()];
                case 10:
                    _b.sent();
                    res.status(201).send({ message: "order created", order: orders });
                    return [7 /*endfinally*/];
                case 11: return [2 /*return*/];
            }
        });
    }); };
    OrdersController.verifyOrder = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, unverified, connection, queryRunner, order, orderOffers, total, _i, orderOffers_5, orderOffer, orderMeals, bill, _a, orderMeals_5, orderMeal, err_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    id = req.params.id;
                    unverified = req.body.verify;
                    console.log(unverified + "   kkk");
                    console.log(req.body);
                    connection = typeorm_1.getConnection();
                    queryRunner = connection.createQueryRunner();
                    return [4 /*yield*/, queryRunner.connect()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, queryRunner.startTransaction("SERIALIZABLE")];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 13, 15, 17]);
                    return [4 /*yield*/, queryRunner.manager
                            .createQueryBuilder()
                            .select("Orders")
                            .from(Orders_1.Orders, "Orders")
                            .where("Orders.id= :ids", { ids: id })
                            .getOneOrFail()];
                case 4:
                    order = _b.sent();
                    console.log(" kook " + unverified);
                    if (!!unverified) return [3 /*break*/, 6];
                    order.status = Orders_1.Status.CANCELD;
                    return [4 /*yield*/, queryRunner.manager.save(order)];
                case 5:
                    _b.sent();
                    return [3 /*break*/, 11];
                case 6:
                    if (!(order.status === Orders_1.Status.UNVERIFIED)) return [3 /*break*/, 11];
                    order.status = Orders_1.Status.VERIFIED;
                    return [4 /*yield*/, queryRunner.manager.save(order)];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, queryRunner.manager
                            .createQueryBuilder()
                            .select("OrderOffers")
                            .from(OrderOffers_1.OrderOffers, "OrderOffers")
                            .where("OrderOffers.Orders= :ids", { ids: id })
                            .getMany()];
                case 8:
                    orderOffers = _b.sent();
                    total = 0;
                    for (_i = 0, orderOffers_5 = orderOffers; _i < orderOffers_5.length; _i++) {
                        orderOffer = orderOffers_5[_i];
                        console.log(orderOffer.quantity * orderOffer.offerPrice);
                        total += (orderOffer.quantity * orderOffer.offerPrice);
                        console.log(total);
                    }
                    return [4 /*yield*/, queryRunner.manager
                            .createQueryBuilder()
                            .select("OrderMeals")
                            .from(OrderMeals_1.OrderMeals, "OrderMeals")
                            .where("OrderMeals.Orders= :ids", { ids: id })
                            .getMany()];
                case 9:
                    orderMeals = _b.sent();
                    bill = new Bills_1.Bills();
                    console.log(total);
                    for (_a = 0, orderMeals_5 = orderMeals; _a < orderMeals_5.length; _a++) {
                        orderMeal = orderMeals_5[_a];
                        console.log(orderMeal.quantity * orderMeal.mealPrice);
                        total += (orderMeal.quantity * orderMeal.mealPrice);
                        console.log(total);
                    }
                    bill.total = total;
                    bill.fee = 0.25;
                    bill.totalWithFee = bill.total * 0.25;
                    bill.type = "unpaid";
                    bill.discount = 0;
                    bill.Order = order.id;
                    console.log(bill);
                    return [4 /*yield*/, queryRunner.manager.save(bill)];
                case 10:
                    _b.sent();
                    _b.label = 11;
                case 11: return [4 /*yield*/, queryRunner.commitTransaction()];
                case 12:
                    _b.sent();
                    return [3 /*break*/, 17];
                case 13:
                    err_2 = _b.sent();
                    return [4 /*yield*/, queryRunner.rollbackTransaction()];
                case 14:
                    _b.sent();
                    res.status(409).send({
                        message: "order edited was unsuccessful",
                        error: err_2
                    });
                    return [2 /*return*/];
                case 15: return [4 /*yield*/, queryRunner.release()];
                case 16:
                    _b.sent();
                    res.status(201).send({ message: "order edited" });
                    return [7 /*endfinally*/];
                case 17: return [2 /*return*/];
            }
        });
    }); };
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
    OrdersController.prepareOrder = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, connection, queryRunner, order, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = req.params.id;
                    connection = typeorm_1.getConnection();
                    queryRunner = connection.createQueryRunner();
                    return [4 /*yield*/, queryRunner.connect()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, queryRunner.startTransaction("SERIALIZABLE")];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 7, 9, 11]);
                    return [4 /*yield*/, queryRunner.manager
                            .createQueryBuilder()
                            .select("Orders")
                            .from(Orders_1.Orders, "Orders")
                            .where("Orders.id= :ids", { ids: id })
                            .getOneOrFail()];
                case 4:
                    order = _a.sent();
                    order.status = Orders_1.Status.PREPARE;
                    return [4 /*yield*/, queryRunner.manager.save(order)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, queryRunner.commitTransaction()];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 11];
                case 7:
                    err_3 = _a.sent();
                    return [4 /*yield*/, queryRunner.rollbackTransaction()];
                case 8:
                    _a.sent();
                    res.status(409).send({
                        message: "order edited was unsuccessful",
                        error: err_3
                    });
                    return [2 /*return*/];
                case 9: return [4 /*yield*/, queryRunner.release()];
                case 10:
                    _a.sent();
                    res.status(201).send({ message: "order edited" });
                    return [7 /*endfinally*/];
                case 11: return [2 /*return*/];
            }
        });
    }); };
    OrdersController.fishingOrder = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, connection, queryRunner, order, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = req.params.id;
                    connection = typeorm_1.getConnection();
                    queryRunner = connection.createQueryRunner();
                    return [4 /*yield*/, queryRunner.connect()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, queryRunner.startTransaction("SERIALIZABLE")];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 7, 9, 11]);
                    return [4 /*yield*/, queryRunner.manager
                            .createQueryBuilder()
                            .select("Orders")
                            .from(Orders_1.Orders, "Orders")
                            .where("Orders.id= :ids", { ids: id })
                            .getOneOrFail()];
                case 4:
                    order = _a.sent();
                    order.status = Orders_1.Status.FINISHED;
                    return [4 /*yield*/, queryRunner.manager.save(order)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, queryRunner.commitTransaction()];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 11];
                case 7:
                    err_4 = _a.sent();
                    return [4 /*yield*/, queryRunner.rollbackTransaction()];
                case 8:
                    _a.sent();
                    res.status(409).send({
                        message: "order edited was unsuccessful",
                        error: err_4
                    });
                    return [2 /*return*/];
                case 9: return [4 /*yield*/, queryRunner.release()];
                case 10:
                    _a.sent();
                    res.status(201).send({ message: "order edited" });
                    return [7 /*endfinally*/];
                case 11: return [2 /*return*/];
            }
        });
    }); };
    OrdersController.editOrders = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, _a, OrderMeal, bill, order, connection, queryRunner, Meal, error_6, errors, orderOffers, orderMeals, bill_1, _i, orderMeals_6, orderMeal, _b, orderOffers_6, orderOffer, err_5;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    id = req.params.id;
                    _a = req.body, OrderMeal = _a.OrderMeal, bill = _a.bill;
                    connection = typeorm_1.getConnection();
                    queryRunner = connection.createQueryRunner();
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, queryRunner.manager
                            .createQueryBuilder()
                            .select("Orders")
                            .from(Orders_1.Orders, "Orders")
                            .where("Orders.id= :ids", { ids: id })
                            .getMany()];
                case 2:
                    Meal = _c.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_6 = _c.sent();
                    res.status(404).send("meal not found");
                    return [3 /*break*/, 4];
                case 4:
                    order.OrderMeals = OrderMeal;
                    order.Bill = bill;
                    return [4 /*yield*/, class_validator_1.validate(order)];
                case 5:
                    errors = _c.sent();
                    if (errors.length > 0) {
                        res.status(400).send(errors);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, queryRunner.connect()];
                case 6:
                    _c.sent();
                    return [4 /*yield*/, queryRunner.startTransaction("SERIALIZABLE")];
                case 7:
                    _c.sent();
                    _c.label = 8;
                case 8:
                    _c.trys.push([8, 14, 16, 18]);
                    return [4 /*yield*/, queryRunner.manager.save(order)];
                case 9:
                    _c.sent();
                    return [4 /*yield*/, typeorm_1.createQueryBuilder("Offers")
                            .select("OrderOffers.offersId , OrderOffers.id as  orderOfferId, OrderOffers.quantity,  Offers.name, Offers.price ")
                            .leftJoin("Offers.OrderOffers", "OrderOffers")
                            .where("OrderOffers.ordersId= :ids", { ids: id })
                            .getRawMany()];
                case 10:
                    orderOffers = _c.sent();
                    return [4 /*yield*/, typeorm_1.createQueryBuilder("Meals")
                            .select("OrderMeals.mealsId , OrderMeals.id as  orderMealId, OrderMeals.quantity,  Meals.name, Meals.price ")
                            .leftJoin("Meals.OrderMeals", "OrderMeals")
                            .where("OrderMeals.ordersId= :ids", { ids: id })
                            .getRawMany()];
                case 11:
                    orderMeals = _c.sent();
                    bill_1 = new Bills_1.Bills();
                    bill_1.total = 0;
                    for (_i = 0, orderMeals_6 = orderMeals; _i < orderMeals_6.length; _i++) {
                        orderMeal = orderMeals_6[_i];
                        bill_1.total = bill_1.total + orderMeal.quantity * orderMeal.Meals.price;
                    }
                    for (_b = 0, orderOffers_6 = orderOffers; _b < orderOffers_6.length; _b++) {
                        orderOffer = orderOffers_6[_b];
                        bill_1.total = bill_1.total + orderOffer.quantity * orderOffer.Meals.price;
                    }
                    bill_1.fee = (bill_1.total * 25.0) / 100.0;
                    bill_1.totalWithFee = bill_1.total + bill_1.fee;
                    bill_1.type = "delivery";
                    bill_1.discount = 0;
                    bill_1.Order = order;
                    return [4 /*yield*/, queryRunner.manager.save(bill_1)];
                case 12:
                    _c.sent();
                    return [4 /*yield*/, queryRunner.commitTransaction()];
                case 13:
                    _c.sent();
                    return [3 /*break*/, 18];
                case 14:
                    err_5 = _c.sent();
                    return [4 /*yield*/, queryRunner.rollbackTransaction()];
                case 15:
                    _c.sent();
                    res.status(409).send("order edit was unsuccessful");
                    return [3 /*break*/, 18];
                case 16: return [4 /*yield*/, queryRunner.release()];
                case 17:
                    _c.sent();
                    res.status(201).send("order created");
                    return [7 /*endfinally*/];
                case 18: return [2 /*return*/];
            }
        });
    }); };
    OrdersController.deleteOrders = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, order, connection, queryRunner, error_7, err_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = req.params.id;
                    connection = typeorm_1.getConnection();
                    queryRunner = connection.createQueryRunner();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, connection
                            .createQueryBuilder()
                            .select("Orders")
                            .from(Orders_1.Orders, "Orders")
                            .where("Orders.id= :ids", { ids: id })
                            .getMany()];
                case 2:
                    order = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_7 = _a.sent();
                    res.status(404).send("meal not found");
                    return [3 /*break*/, 4];
                case 4: return [4 /*yield*/, queryRunner.connect()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, queryRunner.startTransaction("SERIALIZABLE")];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7:
                    _a.trys.push([7, 10, 12, 14]);
                    return [4 /*yield*/, queryRunner.manager.remove(order)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, queryRunner.commitTransaction()];
                case 9:
                    _a.sent();
                    return [3 /*break*/, 14];
                case 10:
                    err_6 = _a.sent();
                    return [4 /*yield*/, queryRunner.rollbackTransaction()];
                case 11:
                    _a.sent();
                    res.status(409).send("order deletion was unsuccessful");
                    return [3 /*break*/, 14];
                case 12: return [4 /*yield*/, queryRunner.release()];
                case 13:
                    _a.sent();
                    res.status(201).send("order deleted");
                    return [7 /*endfinally*/];
                case 14: return [2 /*return*/];
            }
        });
    }); };
    return OrdersController;
}());
exports["default"] = OrdersController;
