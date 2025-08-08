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
var Meal_1 = require("../entity/Meal");
var MealIngredients_1 = require("../entity/MealIngredients");
var console = require("console");
var fs = require("fs");
var path = require("path");
var MealController = /** @class */ (function () {
    function MealController() {
    }
    MealController.listAll = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var connection, queryRunner, Meal;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    connection = typeorm_1.getConnection();
                    queryRunner = connection.createQueryRunner();
                    return [4 /*yield*/, queryRunner.manager
                            .createQueryBuilder()
                            .select("meals")
                            .from(Meal_1.Meals, "meals")
                            .where("meals.available= :availables", { availables: 1 })
                            .getMany()];
                case 1:
                    Meal = _a.sent();
                    res.send({ message: "meal listAll was successful", Meal: Meal });
                    return [2 /*return*/];
            }
        });
    }); };
    MealController.getOneById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, connection, queryRunner, Meal, error_1;
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
                            .select("meals")
                            .from(Meal_1.Meals, "meals")
                            .where("meals.id= :ids", { ids: id })
                            .getOne()];
                case 2:
                    Meal = _a.sent();
                    res.send({ message: "meal listAll was successful", Meal: Meal });
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    res.status(404).send({ message: "meal not found", error: error_1 });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    MealController.getManyBySectionId = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var sectionId, connection, queryRunner, meals, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sectionId = req.params.id;
                    connection = typeorm_1.getConnection();
                    queryRunner = connection.createQueryRunner();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, queryRunner.manager
                            .createQueryBuilder()
                            .select("meal")
                            .from(Meal_1.Meals, "meal")
                            .where("meal.available=1 and meal.sectionId= :ids", { ids: sectionId })
                            .getMany()];
                case 2:
                    meals = _a.sent();
                    if (meals == null || meals.length == 0) {
                        res.send({ message: "no ingredients for this meal", meals: meals });
                        return [2 /*return*/];
                    }
                    res.send({
                        message: "meal getManyBySectionId was successful",
                        meals: meals
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    res.status(404).send({ message: "meal not found", error: error_2 });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    MealController.newMeal = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var reqMeal, meal, errors, connection, queryRunner, savedMeal, MealIngredient, _i, _a, mealIngredient, MealIngredient_1, errors_1, err_1, MealIngredient_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    reqMeal = req.body;
                    meal = new Meal_1.Meals();
                    meal.name = reqMeal.name;
                    meal.description = reqMeal.description;
                    meal.price = reqMeal.price;
                    if (meal.price == null || meal.name == null || meal.description == null) {
                        return [2 /*return*/, { error: "all fields are requierd" }];
                    }
                    if (reqMeal.section == null)
                        reqMeal.section = 1;
                    meal.section = reqMeal.section;
                    if (reqMeal.available != null)
                        meal.available = reqMeal.available;
                    else
                        meal.available = true;
                    return [4 /*yield*/, class_validator_1.validate(meal)];
                case 1:
                    errors = _b.sent();
                    if (errors.length > 0) {
                        res
                            .status(400)
                            .send({ message: "meal newMeal was unsuccessful", error: errors });
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
                    _b.trys.push([4, 13, 15, 18]);
                    return [4 /*yield*/, queryRunner.manager.save(meal)];
                case 5:
                    savedMeal = _b.sent();
                    _i = 0, _a = reqMeal.mealIngredients;
                    _b.label = 6;
                case 6:
                    if (!(_i < _a.length)) return [3 /*break*/, 10];
                    mealIngredient = _a[_i];
                    MealIngredient_1 = new MealIngredients_1.MealIngredients();
                    MealIngredient_1.quantity = mealIngredient.quantity;
                    MealIngredient_1.meal = savedMeal;
                    MealIngredient_1.ingredient = mealIngredient.ingredientId;
                    return [4 /*yield*/, class_validator_1.validate(MealIngredient_1)];
                case 7:
                    errors_1 = _b.sent();
                    if (errors_1.length > 0) {
                        res
                            .status(400)
                            .send({ message: "meal newMeal was unsuccessful", error: errors_1 });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, queryRunner.manager.save(MealIngredient_1)];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9:
                    _i++;
                    return [3 /*break*/, 6];
                case 10: return [4 /*yield*/, queryRunner.commitTransaction()];
                case 11:
                    _b.sent();
                    return [4 /*yield*/, queryRunner.manager
                            .createQueryBuilder()
                            .select("MealIngredient.mealId , MealIngredient.id as  mealIngredientId, MealIngredient.quantity, MealIngredient.ingredientId")
                            .from(MealIngredients_1.MealIngredients, "MealIngredient")
                            .where("MealIngredient.mealId= :ids", { ids: savedMeal.id })
                            .getRawMany()];
                case 12:
                    MealIngredient = _b.sent();
                    savedMeal.MealIngredients = MealIngredients_1.MealIngredients;
                    return [3 /*break*/, 18];
                case 13:
                    err_1 = _b.sent();
                    return [4 /*yield*/, queryRunner.rollbackTransaction()];
                case 14:
                    _b.sent();
                    res.status(409).send({
                        message: "meal creation was unsuccessful, it already exists",
                        error: err_1
                    });
                    return [3 /*break*/, 18];
                case 15: return [4 /*yield*/, queryRunner.manager
                        .createQueryBuilder()
                        .select("MealIngredient.mealId , MealIngredient.id as  mealIngredientId, MealIngredient.quantity, MealIngredient.ingredientId")
                        .from(MealIngredients_1.MealIngredients, "MealIngredient")
                        .where("MealIngredient.mealId= :ids", { ids: savedMeal.id })
                        .getRawMany()];
                case 16:
                    MealIngredient_2 = _b.sent();
                    savedMeal.mealIngredients = MealIngredient_2;
                    //console.log(MealIngredient);
                    return [2 /*return*/, savedMeal];
                case 17:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 18: return [2 /*return*/];
            }
        });
    }); };
    MealController.editMeal = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, reqMeal, meal, connection, queryRunner, error_3, _i, _a, mealIngredient, MealIngredient, error_4, MealIngredient, errors_2, err_2, errors, editedMeal, MealIngredient, err_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    id = req.params.id;
                    reqMeal = req.body;
                    connection = typeorm_1.getConnection();
                    queryRunner = connection.createQueryRunner();
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, queryRunner.manager
                            .createQueryBuilder()
                            .select("meals")
                            .from(Meal_1.Meals, "meals")
                            .where("meals.id= :ids", { ids: id })
                            .getOneOrFail()];
                case 2:
                    meal = _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _b.sent();
                    res.status(404).send({ message: "meal not found", error: error_3 });
                    return [3 /*break*/, 4];
                case 4:
                    /*if(reqMeal.available!=null)
                        meal.available=(req.available);*/
                    if (reqMeal.name != null)
                        meal.name = reqMeal.name;
                    if (reqMeal.description != null)
                        meal.description = reqMeal.description;
                    if (reqMeal.price != null)
                        meal.price = reqMeal.price;
                    if (reqMeal.section != null)
                        meal.section = reqMeal.section;
                    return [4 /*yield*/, queryRunner.connect()];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, queryRunner.startTransaction("SERIALIZABLE")];
                case 6:
                    _b.sent();
                    if (!(reqMeal.mealIngredients != null)) return [3 /*break*/, 22];
                    _i = 0, _a = reqMeal.mealIngredients;
                    _b.label = 7;
                case 7:
                    if (!(_i < _a.length)) return [3 /*break*/, 22];
                    mealIngredient = _a[_i];
                    if (!(mealIngredient.mealIngredientId != null)) return [3 /*break*/, 14];
                    _b.label = 8;
                case 8:
                    _b.trys.push([8, 11, , 13]);
                    return [4 /*yield*/, queryRunner.manager
                            .createQueryBuilder()
                            .select("MealIngredients")
                            .from(MealIngredients_1.MealIngredients, "MealIngredients")
                            .where("MealIngredients.id= :ids", {
                            ids: mealIngredient.mealIngredientId
                        })
                            .getOne()];
                case 9:
                    MealIngredient = _b.sent();
                    if (mealIngredient.quantity != null) {
                        MealIngredient.quantity = mealIngredient.quantity;
                    }
                    if (mealIngredient.ingredientId != null) {
                        MealIngredient.ingredient = mealIngredient.ingredientId;
                    }
                    return [4 /*yield*/, queryRunner.manager.save(MealIngredient)];
                case 10:
                    _b.sent();
                    return [3 /*break*/, 13];
                case 11:
                    error_4 = _b.sent();
                    return [4 /*yield*/, queryRunner.rollbackTransaction()];
                case 12:
                    _b.sent();
                    res.status(409).send({
                        message: "meal edit was unsuccessful mealIngredient ",
                        error: error_4
                    });
                    return [3 /*break*/, 13];
                case 13: return [3 /*break*/, 21];
                case 14:
                    _b.trys.push([14, 19, , 21]);
                    if (!(mealIngredient.ingredientId != null &&
                        mealIngredient.quantity != null)) return [3 /*break*/, 17];
                    MealIngredient = new MealIngredients_1.MealIngredients();
                    MealIngredient.quantity = mealIngredient.quantity;
                    MealIngredient.meal = meal;
                    MealIngredient.ingredient = mealIngredient.ingredientId;
                    return [4 /*yield*/, class_validator_1.validate(MealIngredient)];
                case 15:
                    errors_2 = _b.sent();
                    if (errors_2.length > 0) {
                        res.status(400).send({
                            message: "meal edit was unsuccessful",
                            error: errors_2
                        });
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, queryRunner.manager.save(MealIngredient)];
                case 16:
                    _b.sent();
                    return [3 /*break*/, 18];
                case 17:
                    res.status(404).send({ message: "meal not found" });
                    _b.label = 18;
                case 18: return [3 /*break*/, 21];
                case 19:
                    err_2 = _b.sent();
                    return [4 /*yield*/, queryRunner.rollbackTransaction()];
                case 20:
                    _b.sent();
                    res.status(409).send({
                        message: "meal edit was unsuccessful mealIngredient new",
                        error: err_2
                    });
                    return [2 /*return*/];
                case 21:
                    _i++;
                    return [3 /*break*/, 7];
                case 22: return [4 /*yield*/, class_validator_1.validate(meal)];
                case 23:
                    errors = _b.sent();
                    if (errors.length > 0) {
                        res
                            .status(400)
                            .send({ message: "meal edit was unsuccessful", error: errors });
                        return [2 /*return*/];
                    }
                    _b.label = 24;
                case 24:
                    _b.trys.push([24, 28, 30, 32]);
                    return [4 /*yield*/, queryRunner.manager.save(meal)];
                case 25:
                    editedMeal = _b.sent();
                    return [4 /*yield*/, queryRunner.manager
                            .createQueryBuilder()
                            .select("MealIngredient.mealId , MealIngredient.id as  mealIngredientId, MealIngredient.quantity, MealIngredient.ingredientId")
                            .from(MealIngredients_1.MealIngredients, "MealIngredient")
                            .where("MealIngredient.mealId= :ids", { ids: id })
                            .getRawMany()];
                case 26:
                    MealIngredient = _b.sent();
                    editedMeal.mealIngredients = MealIngredient;
                    return [4 /*yield*/, queryRunner.commitTransaction()];
                case 27:
                    _b.sent();
                    return [3 /*break*/, 32];
                case 28:
                    err_3 = _b.sent();
                    return [4 /*yield*/, queryRunner.rollbackTransaction()];
                case 29:
                    _b.sent();
                    res
                        .status(409)
                        .send({ message: "meal edit was unsuccessful", error: err_3 });
                    return [3 /*break*/, 32];
                case 30: return [4 /*yield*/, queryRunner.release()];
                case 31:
                    _b.sent();
                    res.status(201).send({ message: "meal edited", meal: editedMeal });
                    return [7 /*endfinally*/];
                case 32: return [2 /*return*/];
            }
        });
    }); };
    MealController.deleteMeal = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, meal, deletedMeal, connection, queryRunner, error_5, err_4;
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
                            .select("meals")
                            .from(Meal_1.Meals, "meals")
                            .where("meals.id= :ids", { ids: id })
                            .getOne()];
                case 2:
                    meal = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_5 = _a.sent();
                    res.status(404).send({ message: "meal not found", error: error_5 });
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
                    meal.available = false;
                    return [4 /*yield*/, queryRunner.manager.save(meal)];
                case 8:
                    deletedMeal = _a.sent();
                    // await queryRunner.manager.remove(meal);
                    return [4 /*yield*/, queryRunner.commitTransaction()];
                case 9:
                    // await queryRunner.manager.remove(meal);
                    _a.sent();
                    return [3 /*break*/, 14];
                case 10:
                    err_4 = _a.sent();
                    return [4 /*yield*/, queryRunner.rollbackTransaction()];
                case 11:
                    _a.sent();
                    res
                        .status(409)
                        .send({ message: "meal deletion was unsuccessful", error: err_4 });
                    return [3 /*break*/, 14];
                case 12: return [4 /*yield*/, queryRunner.release()];
                case 13:
                    _a.sent();
                    res.status(201).send({
                        message: "meal was deleted successfuly",
                        deletedMeal: deletedMeal
                    });
                    return [7 /*endfinally*/];
                case 14: return [2 /*return*/];
            }
        });
    }); };
    MealController.uploadImage = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var avatar, id, meal, connection, queryRunner, error_6, editedMeal, err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log(req.file.filename);
                    avatar = req.file.filename;
                    id = req.params.id;
                    connection = typeorm_1.getConnection();
                    queryRunner = connection.createQueryRunner();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, queryRunner.manager
                            .createQueryBuilder()
                            .select("meals")
                            .from(Meal_1.Meals, "meals")
                            .where("meals.id= :ids", { ids: id })
                            .getOneOrFail()];
                case 2:
                    meal = _a.sent();
                    meal.imageUrl = "http://localhost:3307/images/" + avatar;
                    return [3 /*break*/, 4];
                case 3:
                    error_6 = _a.sent();
                    res.status(404).send({ message: "meal not found", error: error_6 });
                    return [3 /*break*/, 4];
                case 4:
                    _a.trys.push([4, 7, 9, 11]);
                    return [4 /*yield*/, queryRunner.manager.save(meal)];
                case 5:
                    editedMeal = _a.sent();
                    return [4 /*yield*/, queryRunner.commitTransaction()];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 11];
                case 7:
                    err_5 = _a.sent();
                    return [4 /*yield*/, queryRunner.rollbackTransaction()];
                case 8:
                    _a.sent();
                    res
                        .status(409)
                        .send({ message: "meal edit was unsuccessful", error: err_5 });
                    return [3 /*break*/, 11];
                case 9: return [4 /*yield*/, queryRunner.release()];
                case 10:
                    _a.sent();
                    res.status(201).send({ message: "meal edited", meal: editedMeal });
                    return [7 /*endfinally*/];
                case 11: return [2 /*return*/];
            }
        });
    }); };
    return MealController;
}());
exports["default"] = MealController;
