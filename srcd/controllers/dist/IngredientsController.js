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
var Ingredients_1 = require("../entity/Ingredients");
var StockIngredient_1 = require("../entity/StockIngredient");
var SubOrderIngredient_1 = require("../entity/SubOrderIngredient");
var MealIngredients_1 = require("../entity/MealIngredients");
var console = require("console");
var IngredientsController = /** @class */ (function () {
    function IngredientsController() {
    }
    IngredientsController.listAll = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var connection, queryRunner, ingredient;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    connection = typeorm_1.getConnection();
                    queryRunner = connection.createQueryRunner();
                    return [4 /*yield*/, queryRunner.manager
                            .createQueryBuilder()
                            .select("ingredients")
                            .from(Ingredients_1.ingredients, "ingredients")
                            .getMany()];
                case 1:
                    ingredient = _a.sent();
                    //Send the ingredients object
                    res.send(ingredient);
                    return [2 /*return*/];
            }
        });
    }); };
    IngredientsController.hasEnough = function (order) { return __awaiter(void 0, void 0, void 0, function () {
        var connection, queryRunner, orderOffers, orderMeals, _i, orderMeals_1, mealIngredient, ingredient, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
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
                    _a.trys.push([3, 16, 18, 20]);
                    return [4 /*yield*/, typeorm_1.createQueryBuilder("Offers")
                            .select("OrderOffers.offersId , OrderOffers.id as  orderOfferId, OrderOffers.quantity,  Offers.name, Offers.price ")
                            .leftJoin("Offers.OrderOffers", "OrderOffers")
                            .where("OrderOffers.ordersId= :ids", { ids: order.id })
                            .getRawMany()];
                case 4:
                    orderOffers = _a.sent();
                    return [4 /*yield*/, typeorm_1.createQueryBuilder("Meals")
                            .select("OrderMeals.mealsId , OrderMeals.id as  orderMealId, OrderMeals.quantity ,  Meals.name, Meals.price,MealIngredients.ingredientsId as ingredientsId ,MealIngredients.quantity as mealQuantity")
                            .leftJoin("Meals.OrderMeals", "OrderMeals")
                            .leftJoin("Meals.MealIngredients", "MealIngredients")
                            .where("OrderMeals.ordersId= :ids", { ids: order.id })
                            .getRawMany()];
                case 5:
                    orderMeals = _a.sent();
                    _i = 0, orderMeals_1 = orderMeals;
                    _a.label = 6;
                case 6:
                    if (!(_i < orderMeals_1.length)) return [3 /*break*/, 14];
                    mealIngredient = orderMeals_1[_i];
                    return [4 /*yield*/, queryRunner.manager
                            .createQueryBuilder()
                            .select("ingredients")
                            .from(Ingredients_1.ingredients, "ingredients")
                            .where("ingredients.id= :ids", { ids: mealIngredient.ingredientsId })
                            .getOneOrFail()];
                case 7:
                    ingredient = _a.sent();
                    if (!(ingredient.quantity < (mealIngredient.quantity * mealIngredient.mealQuantity))) return [3 /*break*/, 9];
                    console.log(ingredient.quantity + "  k  " + (mealIngredient.quantity * mealIngredient.mealQuantity));
                    ingredient.quantity = ingredient.quantity - (mealIngredient.quantity * mealIngredient.mealQuantity);
                    return [4 /*yield*/, queryRunner.manager.save(ingredient)];
                case 8:
                    _a.sent();
                    return [3 /*break*/, 11];
                case 9: return [4 /*yield*/, queryRunner.rollbackTransaction()];
                case 10:
                    _a.sent();
                    return [2 /*return*/, false];
                case 11: return [4 /*yield*/, queryRunner.manager.save(ingredient)];
                case 12:
                    _a.sent();
                    _a.label = 13;
                case 13:
                    _i++;
                    return [3 /*break*/, 6];
                case 14: return [4 /*yield*/, queryRunner.commitTransaction()];
                case 15:
                    _a.sent();
                    return [3 /*break*/, 20];
                case 16:
                    err_1 = _a.sent();
                    return [4 /*yield*/, queryRunner.rollbackTransaction()];
                case 17:
                    _a.sent();
                    return [2 /*return*/, false];
                case 18: return [4 /*yield*/, queryRunner.release()];
                case 19:
                    _a.sent();
                    return [2 /*return*/, true];
                case 20: return [2 /*return*/];
            }
        });
    }); };
    IngredientsController.getOneById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, connection, queryRunner, ingredient, error_1;
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
                            .select("ingredients")
                            .from(Ingredients_1.ingredients, "ingredients")
                            .where("ingredients.id= :ids", { ids: id })
                            .getOneOrFail()];
                case 2:
                    ingredient = _a.sent();
                    res.send(ingredient);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    res.status(404).send({ error: error_1 });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    IngredientsController.newIngredient = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, name, measurment, price, quantity, minthreshold, ingredient, errors, connection, queryRunner, err_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = req.body, name = _a.name, measurment = _a.measurment, price = _a.price, quantity = _a.quantity, minthreshold = _a.minthreshold;
                    ingredient = new Ingredients_1.ingredients();
                    ingredient.name = name;
                    ingredient.measurment = measurment;
                    ingredient.price = price;
                    ingredient.quantity = quantity;
                    ingredient.minthreshold = minthreshold;
                    return [4 /*yield*/, class_validator_1.validate(ingredient)];
                case 1:
                    errors = _b.sent();
                    if (errors.length > 0) {
                        res.status(400).send(errors);
                        return [2 /*return*/];
                    }
                    connection = typeorm_1.getConnection();
                    queryRunner = connection.createQueryRunner();
                    return [4 /*yield*/, queryRunner.connect()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, queryRunner.startTransaction("SERIALIZABLE")];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    _b.trys.push([4, 7, 9, 11]);
                    return [4 /*yield*/, queryRunner.manager.save(ingredient)];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, queryRunner.commitTransaction()];
                case 6:
                    _b.sent();
                    return [3 /*break*/, 11];
                case 7:
                    err_2 = _b.sent();
                    return [4 /*yield*/, queryRunner.rollbackTransaction()];
                case 8:
                    _b.sent();
                    res
                        .status(409)
                        .send({
                        message: "ingredient creation was unsuccessful, it already exists",
                        error: err_2
                    });
                    return [3 /*break*/, 11];
                case 9: return [4 /*yield*/, queryRunner.release()];
                case 10:
                    _b.sent();
                    res.status(201).send(ingredient);
                    return [7 /*endfinally*/];
                case 11: return [2 /*return*/];
            }
        });
    }); };
    IngredientsController.editIngredient = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, reqIngredient, connection, queryRunner, IngredientsRepository, ingredient, error_2, errors, a, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = req.params.id;
                    reqIngredient = req.body;
                    connection = typeorm_1.getConnection();
                    queryRunner = connection.createQueryRunner();
                    IngredientsRepository = typeorm_1.getRepository(Ingredients_1.ingredients);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, queryRunner.manager
                            .createQueryBuilder()
                            .select("ingredients")
                            .from(Ingredients_1.ingredients, "ingredients")
                            .where("ingredients.id= :ids", { ids: id })
                            .getOneOrFail()];
                case 2:
                    ingredient = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    //If not found, send a 404 response
                    res.status(404).send({ message: "ingredient not found", error: error_2 });
                    return [2 /*return*/];
                case 4:
                    console.log(reqIngredient);
                    //Validate the new values on model
                    if (reqIngredient.hasOwnProperty("name"))
                        ingredient.name = reqIngredient.name;
                    if (reqIngredient.measurment != null)
                        ingredient.measurment = reqIngredient.measurment;
                    if (reqIngredient.price != null)
                        ingredient.price = reqIngredient.price;
                    if (reqIngredient.quantity != null) {
                        ingredient.quantity = reqIngredient.quantity;
                        console.log(reqIngredient.quantity);
                    }
                    if (reqIngredient.minthreshold != null)
                        ingredient.minthreshold = reqIngredient.minthreshold;
                    return [4 /*yield*/, class_validator_1.validate(ingredient)];
                case 5:
                    errors = _a.sent();
                    if (errors.length > 0) {
                        res.status(400).send(errors);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, queryRunner.connect()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, queryRunner.startTransaction("SERIALIZABLE")];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8:
                    _a.trys.push([8, 11, 13, 16]);
                    console.log(ingredient);
                    return [4 /*yield*/, queryRunner.manager.save(ingredient)];
                case 9:
                    a = _a.sent();
                    console.log("koko  ");
                    console.log(a);
                    return [4 /*yield*/, queryRunner.commitTransaction()];
                case 10:
                    _a.sent();
                    return [3 /*break*/, 16];
                case 11:
                    err_3 = _a.sent();
                    return [4 /*yield*/, queryRunner.rollbackTransaction()];
                case 12:
                    _a.sent();
                    res
                        .status(409)
                        .send({ message: "ingredient edit was unsuccessful", error: err_3 });
                    return [3 /*break*/, 16];
                case 13: return [4 /*yield*/, queryRunner.manager
                        .createQueryBuilder()
                        .select("ingredients")
                        .from(Ingredients_1.ingredients, "ingredients")
                        .where("ingredients.id= :ids", { ids: id })
                        .getOne()];
                case 14:
                    ingredient = _a.sent();
                    return [4 /*yield*/, queryRunner.release()];
                case 15:
                    _a.sent();
                    res
                        .status(201)
                        .send({ message: "ingredient created", ingredient: ingredient });
                    return [7 /*endfinally*/];
                case 16: return [2 /*return*/];
            }
        });
    }); };
    IngredientsController.deleteIngredient = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, connection, queryRunner, ingredient, error_3, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = req.params.id;
                    console.log("koko");
                    connection = typeorm_1.getConnection();
                    queryRunner = connection.createQueryRunner();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, queryRunner.manager
                            .createQueryBuilder()
                            .select("ingredients")
                            .from(Ingredients_1.ingredients, "ingredients")
                            .where("ingredients.id= :ids", { ids: id })
                            .getOne()];
                case 2:
                    ingredient = _a.sent();
                    console.log(ingredient);
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    res.status(404).send({ message: "ingredient not found", error: error_3 });
                    return [2 /*return*/];
                case 4: return [4 /*yield*/, queryRunner.connect()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, queryRunner.startTransaction("SERIALIZABLE")];
                case 6:
                    _a.sent();
                    console.log("koko2");
                    _a.label = 7;
                case 7:
                    _a.trys.push([7, 13, 15, 17]);
                    return [4 /*yield*/, typeorm_1.getConnection()
                            .createQueryBuilder()["delete"]()
                            .from(StockIngredient_1.StockIngredient)
                            .where("ingredientsId= :ids", { ids: id })
                            .execute()];
                case 8:
                    _a.sent();
                    //delete SubOrderIngredient
                    return [4 /*yield*/, typeorm_1.getConnection()
                            .createQueryBuilder()["delete"]()
                            .from(SubOrderIngredient_1.SubOrderIngredient)
                            .where("ingredientId= :ids", { ids: id })
                            .execute()];
                case 9:
                    //delete SubOrderIngredient
                    _a.sent();
                    //delete MealIngredients
                    return [4 /*yield*/, typeorm_1.getConnection()
                            .createQueryBuilder()["delete"]()
                            .from(MealIngredients_1.MealIngredients)
                            .where("ingredientId= :ids", { ids: id })
                            .execute()];
                case 10:
                    //delete MealIngredients
                    _a.sent();
                    return [4 /*yield*/, queryRunner.manager.remove(ingredient)];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, queryRunner.commitTransaction()];
                case 12:
                    _a.sent();
                    return [3 /*break*/, 17];
                case 13:
                    err_4 = _a.sent();
                    return [4 /*yield*/, queryRunner.rollbackTransaction()];
                case 14:
                    _a.sent();
                    res
                        .status(409)
                        .send({ message: "ingredient deletion was unsuccessful", error: err_4 });
                    return [3 /*break*/, 17];
                case 15: return [4 /*yield*/, queryRunner.release()];
                case 16:
                    _a.sent();
                    res.status(201).send({ message: "ingredient deleted" });
                    return [7 /*endfinally*/];
                case 17: return [2 /*return*/];
            }
        });
    }); };
    return IngredientsController;
}());
exports["default"] = IngredientsController;
