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
var Offers_1 = require("../entity/Offers");
var MealOffer_1 = require("../entity/MealOffer");
var OffersController = /** @class */ (function () {
    function OffersController() {
    }
    OffersController.listAll = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var connection, queryRunner, offers, _i, offers_1, offer, offerMeals;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    connection = typeorm_1.getConnection();
                    queryRunner = connection.createQueryRunner();
                    return [4 /*yield*/, queryRunner.manager
                            .createQueryBuilder()
                            .select("Offers")
                            .from(Offers_1.Offers, "Offers")
                            .getMany()];
                case 1:
                    offers = _a.sent();
                    _i = 0, offers_1 = offers;
                    _a.label = 2;
                case 2:
                    if (!(_i < offers_1.length)) return [3 /*break*/, 5];
                    offer = offers_1[_i];
                    return [4 /*yield*/, typeorm_1.createQueryBuilder("Meals")
                            .select("MealOffer.mealsId as mealId , MealOffer.quantity as quantity ,Meals.name as name")
                            .leftJoin("Meals.MealOffers", "MealOffer")
                            .where("MealOffer.offersId= :ids", { ids: offer.id })
                            .getRawMany()];
                case 3:
                    offerMeals = _a.sent();
                    offer.mealOffers = offerMeals;
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    res.send(offers);
                    return [2 /*return*/];
            }
        });
    }); };
    OffersController.getOneById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, connection, queryRunner, offer, error_1;
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
                            .select("Offers")
                            .from(Offers_1.Offers, "Offers")
                            .where("Offers.id= :ids", { ids: id })
                            .getMany()];
                case 2:
                    offer = _a.sent();
                    res.send(offer);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    res.status(404).send("offer not found");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    OffersController.newOffers = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var reqOffer, offer, errors, connection, queryRunner, savedOffer, _i, _a, reqmealOffer, mealOffer, errors_1, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    reqOffer = req.body;
                    offer = new Offers_1.Offers();
                    offer.name = reqOffer.name;
                    offer.price = reqOffer.price;
                    offer.expirationDate = reqOffer.expirationDate;
                    if (offer.name == null || offer.price == null || offer.expirationDate == null) {
                        res.status(409); //.send({ error: err });
                        return [2 /*return*/, { error: "all fields are requierd" }];
                    }
                    return [4 /*yield*/, class_validator_1.validate(offer)];
                case 1:
                    errors = _b.sent();
                    if (errors.length > 0) {
                        res.status(400).send({ messsage: "unvalid input", error: errors });
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
                    _b.trys.push([4, 15, 17, 18]);
                    return [4 /*yield*/, queryRunner.manager.save(offer)];
                case 5:
                    savedOffer = _b.sent();
                    if (!(reqOffer.mealOffers != null)) return [3 /*break*/, 12];
                    _i = 0, _a = reqOffer.mealOffers;
                    _b.label = 6;
                case 6:
                    if (!(_i < _a.length)) return [3 /*break*/, 12];
                    reqmealOffer = _a[_i];
                    mealOffer = new MealOffer_1.MealOffer();
                    mealOffer.quantity = reqmealOffer.quantity;
                    mealOffer.Meals = reqmealOffer.mealId;
                    mealOffer.Offers = savedOffer;
                    return [4 /*yield*/, class_validator_1.validate(mealOffer)];
                case 7:
                    errors_1 = _b.sent();
                    if (!(errors_1.length > 0)) return [3 /*break*/, 9];
                    return [4 /*yield*/, queryRunner.rollbackTransaction()];
                case 8:
                    _b.sent();
                    res
                        .status(404);
                    return [2 /*return*/, {
                            message: "mealoffer newoffer was unsuccessful",
                            error: errors_1
                        }];
                case 9: return [4 /*yield*/, queryRunner.manager.save(mealOffer)];
                case 10:
                    _b.sent();
                    _b.label = 11;
                case 11:
                    _i++;
                    return [3 /*break*/, 6];
                case 12: return [4 /*yield*/, queryRunner.commitTransaction()];
                case 13:
                    _b.sent();
                    return [4 /*yield*/, queryRunner.release()];
                case 14:
                    _b.sent();
                    res.status(201); //.send({ message: "offer created", offer: savedOffer });
                    return [2 /*return*/, { message: "offer created", offer: savedOffer }];
                case 15:
                    err_1 = _b.sent();
                    return [4 /*yield*/, queryRunner.rollbackTransaction()];
                case 16:
                    _b.sent();
                    res
                        .status(404);
                    return [2 /*return*/, {
                            message: "offer creation was unsuccessful, it already exists",
                            error: err_1
                        }];
                case 17: return [7 /*endfinally*/];
                case 18: return [2 /*return*/];
            }
        });
    }); };
    OffersController.getmealsByOfferlId = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var offerId, connection, queryRunner, offerMeals, offer, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    offerId = req.params.id;
                    connection = typeorm_1.getConnection();
                    queryRunner = connection.createQueryRunner();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, typeorm_1.createQueryBuilder("Meals")
                            .select("MealOffer.mealsId , MealOffer.id as  mealOfferId, MealOffer.quantity, MealOffer.offersId,Meals.name as mealName")
                            .leftJoin("Meals.MealOffers", "MealOffer")
                            .where("MealOffer.offersId= :ids", { ids: offerId })
                            .getRawMany()];
                case 2:
                    offerMeals = _a.sent();
                    return [4 /*yield*/, queryRunner.manager
                            .createQueryBuilder()
                            .select("Offers")
                            .from(Offers_1.Offers, "Offers")
                            .where("Offers.id= :ids", { ids: offerId })
                            .getOneOrFail()];
                case 3:
                    offer = _a.sent();
                    res.send({
                        message: "offer and offer meals was successful",
                        offer: offer,
                        mealOffer: offerMeals
                    });
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _a.sent();
                    res.status(404).send({ message: "offer not found", error: error_2 });
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    OffersController.editOffers = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, offerReq, offer, connection, queryRunner, error_3, errors, mealOfferReqs, _i, mealOfferReqs_1, mealOfferReq, mealOffer, errors_2, err_2, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = req.params.id;
                    offerReq = req.body;
                    connection = typeorm_1.getConnection();
                    queryRunner = connection.createQueryRunner();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, queryRunner.manager
                            .createQueryBuilder()
                            .select("Offers")
                            .from(Offers_1.Offers, "Offers")
                            .where("Offers.id= :ids", { ids: id })
                            .getMany()];
                case 2:
                    offer = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    res.status(404).send({ error: "offer not found" });
                    return [3 /*break*/, 4];
                case 4:
                    if (offerReq.name != null)
                        offer.name = offerReq.name;
                    if (offerReq.mealOffeer != null)
                        offer.MealOffers = offerReq.mealOffeer;
                    if (offerReq.price != null)
                        offer.price = offerReq.price;
                    return [4 /*yield*/, class_validator_1.validate(offer)];
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
                    _a.trys.push([8, 20, 22, 24]);
                    return [4 /*yield*/, queryRunner.manager.save(offer)];
                case 9:
                    _a.sent();
                    if (!(req.body.mealOffers != null)) return [3 /*break*/, 18];
                    mealOfferReqs = req.body.mealOffers;
                    _i = 0, mealOfferReqs_1 = mealOfferReqs;
                    _a.label = 10;
                case 10:
                    if (!(_i < mealOfferReqs_1.length)) return [3 /*break*/, 18];
                    mealOfferReq = mealOfferReqs_1[_i];
                    mealOffer = new MealOffer_1.MealOffer();
                    mealOffer.quantity = mealOfferReq.quantity;
                    mealOffer.Meals = mealOfferReq.mealId;
                    mealOffer.Offers = mealOfferReq.offerId;
                    return [4 /*yield*/, class_validator_1.validate(mealOffer)];
                case 11:
                    errors_2 = _a.sent();
                    if (!(errors_2.length > 0)) return [3 /*break*/, 13];
                    return [4 /*yield*/, queryRunner.rollbackTransaction()];
                case 12:
                    _a.sent();
                    res.status(400).send(errors_2);
                    return [2 /*return*/];
                case 13:
                    _a.trys.push([13, 15, , 17]);
                    return [4 /*yield*/, queryRunner.manager.save(mealOffer)];
                case 14:
                    _a.sent();
                    return [3 /*break*/, 17];
                case 15:
                    err_2 = _a.sent();
                    return [4 /*yield*/, queryRunner.rollbackTransaction()];
                case 16:
                    _a.sent();
                    res.status(409).send("meal creation was unsuccessful, it already exists");
                    return [3 /*break*/, 17];
                case 17:
                    _i++;
                    return [3 /*break*/, 10];
                case 18: return [4 /*yield*/, queryRunner.commitTransaction()];
                case 19:
                    _a.sent();
                    return [3 /*break*/, 24];
                case 20:
                    err_3 = _a.sent();
                    return [4 /*yield*/, queryRunner.rollbackTransaction()];
                case 21:
                    _a.sent();
                    res.status(409).send("offer edit was unsuccessful");
                    return [3 /*break*/, 24];
                case 22: return [4 /*yield*/, queryRunner.release()];
                case 23:
                    _a.sent();
                    res.status(201).send("offer created");
                    return [7 /*endfinally*/];
                case 24: return [2 /*return*/];
            }
        });
    }); };
    OffersController.deleteOffers = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, offer, connection, queryRunner, error_4, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = req.params.id;
                    connection = typeorm_1.getConnection();
                    queryRunner = connection.createQueryRunner();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 5]);
                    return [4 /*yield*/, connection
                            .createQueryBuilder()
                            .select("Offers")
                            .from(Offers_1.Offers, "Offers")
                            .where("Offers.id= :ids", { ids: id })
                            .getMany()];
                case 2:
                    offer = _a.sent();
                    return [3 /*break*/, 5];
                case 3:
                    error_4 = _a.sent();
                    return [4 /*yield*/, queryRunner.release()];
                case 4:
                    _a.sent();
                    res.status(404).send({ message: "offer not found", error: error_4 });
                    return [3 /*break*/, 5];
                case 5: return [4 /*yield*/, queryRunner.connect()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, queryRunner.startTransaction("SERIALIZABLE")];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8:
                    _a.trys.push([8, 11, 13, 15]);
                    return [4 /*yield*/, queryRunner.manager.remove(offer)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, queryRunner.commitTransaction()];
                case 10:
                    _a.sent();
                    return [3 /*break*/, 15];
                case 11:
                    err_4 = _a.sent();
                    return [4 /*yield*/, queryRunner.rollbackTransaction()];
                case 12:
                    _a.sent();
                    res.status(409).send({ message: "offer deletion was unsuccessful", error: err_4 });
                    return [3 /*break*/, 15];
                case 13: return [4 /*yield*/, queryRunner.release()];
                case 14:
                    _a.sent();
                    res.status(201).send({ message: "offer deleted" });
                    return [7 /*endfinally*/];
                case 15: return [2 /*return*/];
            }
        });
    }); };
    return OffersController;
}());
exports["default"] = OffersController;
