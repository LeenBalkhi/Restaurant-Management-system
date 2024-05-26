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
var MealOffer_1 = require("../entity/MealOffer");
var MealOfferController = /** @class */ (function () {
    function MealOfferController() {
    }
    MealOfferController.listAll = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var connection, queryRunner, mealOffeer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    connection = typeorm_1.getConnection();
                    queryRunner = connection.createQueryRunner();
                    return [4 /*yield*/, queryRunner.manager
                            .createQueryBuilder()
                            .select("MealOffer")
                            .from(MealOffer_1.MealOffer, "MealOffer")
                            .getMany()];
                case 1:
                    mealOffeer = _a.sent();
                    res.send(mealOffeer);
                    return [2 /*return*/];
            }
        });
    }); };
    MealOfferController.getOneById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, connection, queryRunner, mealOffer, error_1;
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
                            .select("MealOffer")
                            .from(MealOffer_1.MealOffer, "MealOffer")
                            .where("MealOffer.id= :ids", { ids: id })
                            .getMany()];
                case 2:
                    mealOffer = _a.sent();
                    res.send(mealOffer);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    res.status(404).send("meal not found");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    MealOfferController.newMealOffer = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/];
        });
    }); };
    MealOfferController.editMealOffer = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, mealOfferReq, mealOffer, connection, queryRunner, error_2, errors, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = req.params.id;
                    mealOfferReq = req.body;
                    connection = typeorm_1.getConnection();
                    queryRunner = connection.createQueryRunner();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, queryRunner.manager
                            .createQueryBuilder()
                            .select("MealOffer")
                            .from(MealOffer_1.MealOffer, "MealOffer")
                            .where("MealOffer.id= :ids", { ids: id })
                            .getMany()];
                case 2:
                    mealOffer = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    res.status(404).send("meal not found");
                    return [3 /*break*/, 4];
                case 4:
                    if (mealOfferReq.quantity != null)
                        mealOffer.quantity = mealOfferReq.quantity;
                    if (mealOfferReq.mealId != null)
                        mealOffer.Meals = mealOfferReq.mealId;
                    if (mealOfferReq.offerId != null)
                        mealOffer.Offers = mealOfferReq.offerId;
                    return [4 /*yield*/, class_validator_1.validate(mealOffer)];
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
                    _a.trys.push([8, 11, 13, 15]);
                    return [4 /*yield*/, queryRunner.manager.save(mealOffer)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, queryRunner.commitTransaction()];
                case 10:
                    _a.sent();
                    return [3 /*break*/, 15];
                case 11:
                    err_1 = _a.sent();
                    return [4 /*yield*/, queryRunner.rollbackTransaction()];
                case 12:
                    _a.sent();
                    res.status(409).send("meal edit was unsuccessful");
                    return [3 /*break*/, 15];
                case 13: return [4 /*yield*/, queryRunner.release()];
                case 14:
                    _a.sent();
                    res.status(201).send("meal created");
                    return [7 /*endfinally*/];
                case 15: return [2 /*return*/];
            }
        });
    }); };
    MealOfferController.deleteMealOffer = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, mealOffer, connection, queryRunner, error_3, err_2;
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
                            .select("MealOffer")
                            .from(MealOffer_1.MealOffer, "MealOffer")
                            .where("MealOffer.id= :ids", { ids: id })
                            .getMany()];
                case 2:
                    mealOffer = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
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
                    return [4 /*yield*/, queryRunner.manager.remove(mealOffer)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, queryRunner.commitTransaction()];
                case 9:
                    _a.sent();
                    return [3 /*break*/, 14];
                case 10:
                    err_2 = _a.sent();
                    return [4 /*yield*/, queryRunner.rollbackTransaction()];
                case 11:
                    _a.sent();
                    res.status(409).send("meal deletion was unsuccessful");
                    return [3 /*break*/, 14];
                case 12: return [4 /*yield*/, queryRunner.release()];
                case 13:
                    _a.sent();
                    res.status(201).send("meal deleted");
                    return [7 /*endfinally*/];
                case 14: return [2 /*return*/];
            }
        });
    }); };
    return MealOfferController;
}());
exports["default"] = MealOfferController;
