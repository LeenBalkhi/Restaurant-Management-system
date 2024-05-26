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
var StockIngredient_1 = require("../entity/StockIngredient");
var Ingredients_1 = require("../entity/Ingredients");
var console = require("console");
var console_1 = require("console");
var StockIngredientController = /** @class */ (function () {
    function StockIngredientController() {
    }
    StockIngredientController.listAll = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var connection, queryRunner, stockIngredients;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    connection = typeorm_1.getConnection();
                    queryRunner = connection.createQueryRunner();
                    return [4 /*yield*/, queryRunner.manager
                            .createQueryBuilder()
                            .select("stockIngredient")
                            .from(StockIngredient_1.StockIngredient, "stockIngredient")
                            .getMany()];
                case 1:
                    stockIngredients = _a.sent();
                    res.send(stockIngredients);
                    return [2 /*return*/];
            }
        });
    }); };
    StockIngredientController.getOneById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, connection, queryRunner, stockIngredient, error_1;
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
                            .select("stockIngredient")
                            .from(StockIngredient_1.StockIngredient, "stockIngredient")
                            .where("stockIngredient.id= :ids", { ids: id })
                            .getMany()];
                case 2:
                    stockIngredient = _a.sent();
                    res.send(stockIngredient);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    res
                        .status(404)
                        .send({ message: "stock Ingredient not found", error: error_1 });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    StockIngredientController.getOneByIngredientId = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, connection, queryRunner, stockIngredient, error_2;
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
                            .select("stockIngredient")
                            .from(StockIngredient_1.StockIngredient, "stockIngredient")
                            .where("stockIngredient.ingredientsId= :ids", { ids: id })
                            .getMany()];
                case 2:
                    stockIngredient = _a.sent();
                    //    console.log(stockIngredient);
                    res.send(stockIngredient);
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    res
                        .status(404)
                        .send({ message: "stock Ingredient not found", error: error_2 });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    StockIngredientController.newStockIngredient = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var reqStockIngredient, StockIngr, errors, connection, queryRunner, Ingredient, t, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    reqStockIngredient = req.body;
                    StockIngr = new StockIngredient_1.StockIngredient();
                    StockIngr.expirationDate = new Date(reqStockIngredient.expirationDate);
                    StockIngr.quantity = reqStockIngredient.quantity;
                    StockIngr.ingredients = reqStockIngredient.ingredientId;
                    StockIngr.stock = reqStockIngredient.stockId;
                    StockIngr.price = reqStockIngredient.price;
                    if (StockIngr.stock == null || StockIngr.quantity == null || StockIngr.expirationDate == null || StockIngr.ingredients == null) {
                        //   console.log(StockIngr)
                        res.status(409); //.send({ error: err });
                        return [2 /*return*/, { error: "all fields are requierd" }];
                    }
                    return [4 /*yield*/, class_validator_1.validate(StockIngr)];
                case 1:
                    errors = _a.sent();
                    if (errors.length > 0) {
                        res.status(400).send({ error: errors });
                        return [2 /*return*/, errors];
                    }
                    connection = typeorm_1.getConnection();
                    queryRunner = connection.createQueryRunner();
                    return [4 /*yield*/, queryRunner.connect()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, queryRunner.startTransaction("SERIALIZABLE")];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 14, , 17]);
                    return [4 /*yield*/, queryRunner.manager
                            .createQueryBuilder()
                            .select("ingredients")
                            .from(Ingredients_1.ingredients, "ingredients")
                            .where("ingredients.id= :ids", { ids: StockIngr.ingredients })
                            .getOne()];
                case 5:
                    Ingredient = _a.sent();
                    if (!(Ingredient == null)) return [3 /*break*/, 8];
                    //   console.log("koko not")
                    // console.log(Ingredient);
                    return [4 /*yield*/, queryRunner.rollbackTransaction()];
                case 6:
                    //   console.log("koko not")
                    // console.log(Ingredient);
                    _a.sent();
                    return [4 /*yield*/, queryRunner.release()];
                case 7:
                    _a.sent();
                    res.status(404); //.send({ error: err });
                    return [2 /*return*/, { error: "all fields are requierd" }];
                case 8: 
                //console.log(Ingredient);
                //  console.log("koko")
                return [4 /*yield*/, queryRunner.manager.save(StockIngr)];
                case 9:
                    //console.log(Ingredient);
                    //  console.log("koko")
                    _a.sent();
                    Ingredient.quantity = Ingredient.quantity + StockIngr.quantity;
                    return [4 /*yield*/, queryRunner.manager.save(Ingredient)];
                case 10:
                    t = _a.sent();
                    //console.log(t);
                    //  console.log("koko")
                    return [4 /*yield*/, queryRunner.commitTransaction()];
                case 11:
                    //console.log(t);
                    //  console.log("koko")
                    _a.sent();
                    return [4 /*yield*/, queryRunner.release()];
                case 12:
                    _a.sent();
                    res.status(201); //.send({ stockIngredient: StockIngr });
                    return [2 /*return*/, { message: "new stock stockIngredient ", StockIngredient: StockIngr }];
                case 13: return [3 /*break*/, 17];
                case 14:
                    err_1 = _a.sent();
                    return [4 /*yield*/, queryRunner.rollbackTransaction()];
                case 15:
                    _a.sent();
                    //  console.log(err);
                    return [4 /*yield*/, queryRunner.release()];
                case 16:
                    //  console.log(err);
                    _a.sent();
                    res.status(404); //.send({ error: err });
                    return [2 /*return*/, { error: "all fields are requierd" }];
                case 17: return [2 /*return*/];
            }
        });
    }); };
    StockIngredientController.editStockIngredient = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, reqStockIngredient, y, StockIngr, connection, queryRunner, stockIngredient, error_3, oldQuantity, errors, Ingredient, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = req.params.id;
                    reqStockIngredient = req.body;
                    console.log(reqStockIngredient);
                    y = +id;
                    console.log(id);
                    StockIngr = new StockIngredient_1.StockIngredient();
                    connection = typeorm_1.getConnection();
                    queryRunner = connection.createQueryRunner();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, queryRunner.manager
                            .createQueryBuilder()
                            .select("stockIngredient")
                            .from(StockIngredient_1.StockIngredient, "stockIngredient")
                            .where("stockIngredient.id= :ids", { ids: id })
                            .getOne()];
                case 2:
                    stockIngredient = _a.sent();
                    StockIngr = stockIngredient;
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    res.status(404).send({ error: error_3 });
                    return [3 /*break*/, 4];
                case 4:
                    oldQuantity = StockIngr.quantity;
                    console.log(StockIngr);
                    StockIngr.id = y;
                    console.log(StockIngr);
                    if (reqStockIngredient.expirationDate != null)
                        StockIngr.expirationDate = reqStockIngredient.expirationDate;
                    console.log(StockIngr);
                    if (reqStockIngredient.quantity != null)
                        StockIngr.quantity = reqStockIngredient.quantity;
                    console.log(StockIngr);
                    if (reqStockIngredient.ingredientId != null)
                        StockIngr.ingredients = reqStockIngredient.ingredientId;
                    console.log(StockIngr);
                    if (reqStockIngredient.price != null)
                        StockIngr.price = reqStockIngredient.price;
                    return [4 /*yield*/, class_validator_1.validate(StockIngr)];
                case 5:
                    errors = _a.sent();
                    if (errors.length > 0) {
                        res.status(400).send({ error: errors });
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
                    _a.trys.push([8, 14, 16, 18]);
                    return [4 /*yield*/, queryRunner.manager.save(StockIngr)];
                case 9:
                    _a.sent();
                    if (!(reqStockIngredient.quantity != null)) return [3 /*break*/, 12];
                    return [4 /*yield*/, queryRunner.manager
                            .createQueryBuilder()
                            .select("ingredients")
                            .from(Ingredients_1.ingredients, "ingredients")
                            .where("ingredients.id= :ids", { ids: StockIngr.ingredients })
                            .getOne()];
                case 10:
                    Ingredient = _a.sent();
                    Ingredient.quantity =
                        Ingredient.quantity + StockIngr.quantity - oldQuantity;
                    return [4 /*yield*/, queryRunner.manager.save(Ingredient)];
                case 11:
                    _a.sent();
                    _a.label = 12;
                case 12: return [4 /*yield*/, queryRunner.commitTransaction()];
                case 13:
                    _a.sent();
                    return [3 /*break*/, 18];
                case 14:
                    err_2 = _a.sent();
                    return [4 /*yield*/, queryRunner.rollbackTransaction()];
                case 15:
                    _a.sent();
                    res.status(409).send({ error: err_2 });
                    return [3 /*break*/, 18];
                case 16: return [4 /*yield*/, queryRunner.release()];
                case 17:
                    _a.sent();
                    res.status(201).send({
                        message: "stock Ingredient created",
                        stockIngredient: StockIngr
                    });
                    return [7 /*endfinally*/];
                case 18: return [2 /*return*/];
            }
        });
    }); };
    StockIngredientController.deleteStockIngredient = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, StockIngr, connection, queryRunner, error_4, err_3;
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
                            .select("stockIngredient")
                            .from(StockIngredient_1.StockIngredient, "stockIngredient")
                            .where("stockIngredient.id= :ids", { ids: id })
                            .getMany()];
                case 2:
                    StockIngr = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _a.sent();
                    res
                        .status(404)
                        .send({ message: "stock Ingredient not found", error: error_4 });
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
                    return [4 /*yield*/, queryRunner.manager.remove(StockIngr)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, queryRunner.commitTransaction()];
                case 9:
                    _a.sent();
                    return [3 /*break*/, 14];
                case 10:
                    err_3 = _a.sent();
                    return [4 /*yield*/, queryRunner.rollbackTransaction()];
                case 11:
                    _a.sent();
                    res.status(409).send({
                        message: "stock Ingredient deletion was unsuccessful",
                        error: console_1.error
                    });
                    return [3 /*break*/, 14];
                case 12: return [4 /*yield*/, queryRunner.release()];
                case 13:
                    _a.sent();
                    res.status(201).send({ message: "stock Ingredient deleted" });
                    return [7 /*endfinally*/];
                case 14: return [2 /*return*/];
            }
        });
    }); };
    return StockIngredientController;
}());
exports["default"] = StockIngredientController;
