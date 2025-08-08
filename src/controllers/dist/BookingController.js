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
var Booking_1 = require("../entity/Booking");
var Table_1 = require("../entity/Table");
var Table_2 = require("../entity/Table");
var User_1 = require("../entity/User");
var UserBills_1 = require("../entity/UserBills");
var BookingController = /** @class */ (function () {
    function BookingController() {
    }
    BookingController.listAll = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var connection, queryRunner, bookings;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    connection = typeorm_1.getConnection();
                    queryRunner = connection.createQueryRunner();
                    return [4 /*yield*/, queryRunner.manager
                            .createQueryBuilder()
                            .select("Booking")
                            .from(Booking_1.Booking, "Booking")
                            .getMany()];
                case 1:
                    bookings = _a.sent();
                    //Send the bookings object
                    res.send(bookings);
                    return [2 /*return*/];
            }
        });
    }); };
    BookingController.getOneById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, connection, queryRunner, booking, error_1;
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
                            .select("Booking")
                            .from(Booking_1.Booking, "Booking")
                            .where("Booking.id= :ids", { ids: id })
                            .getMany()];
                case 2:
                    booking = _a.sent();
                    res.send(booking);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    res.status(404).send("booking not found");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    BookingController.newBooking = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var bookingReq, booking, errors, connection, queryRunner, table, errror_1, id, userRole, userRepository, user, userBill, newUserBill, prevBooking, id, userRole, userRepository, user, userBill, newUserBill, _i, prevBooking_1, book, errror_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    bookingReq = req.body;
                    booking = new Booking_1.Booking();
                    booking.name = bookingReq.name;
                    booking.time = bookingReq.time;
                    booking.date = bookingReq.date;
                    booking.Resttables = bookingReq.tableId;
                    // console.log("new booking", booking);
                    if (booking.name == null || booking.time == null || booking.date == null || booking.Resttables == null) {
                        res.status(409); //.send({ error: err });
                        return [2 /*return*/, { error: "all fields are requierd" }];
                    }
                    return [4 /*yield*/, class_validator_1.validate(booking)];
                case 1:
                    errors = _a.sent();
                    if (errors.length > 0) {
                        // console.log("table");
                        res.status(400).send({ error: errors });
                        return [2 /*return*/];
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
                    _a.trys.push([4, 6, , 9]);
                    return [4 /*yield*/, queryRunner.manager
                            .createQueryBuilder()
                            .select("Resttables")
                            .from(Table_1.Resttables, "Resttables")
                            .where("Resttables.id= :ids", { ids: bookingReq.tableId })
                            .getOne()];
                case 5:
                    table = _a.sent();
                    return [3 /*break*/, 9];
                case 6:
                    errror_1 = _a.sent();
                    //   console.log(errror);
                    // console.log("koko");
                    return [4 /*yield*/, queryRunner.rollbackTransaction()];
                case 7:
                    //   console.log(errror);
                    // console.log("koko");
                    _a.sent();
                    return [4 /*yield*/, queryRunner.release()];
                case 8:
                    _a.sent();
                    res
                        .status(409)
                        .send({
                        message: "booking creation was unsuccessful, it already exists",
                        error: errror_1
                    });
                    return [2 /*return*/];
                case 9:
                    _a.trys.push([9, 31, 34, 35]);
                    if (!(table.state !== Table_2.state.BOOKED && table.state != Table_2.state.OCCUPIED)) return [3 /*break*/, 16];
                    id = res.locals.jwtPayload.userId;
                    userRole = void 0;
                    userRepository = typeorm_1.getRepository(User_1.User);
                    return [4 /*yield*/, userRepository.findOne(id)];
                case 10:
                    user = _a.sent();
                    userBill = new UserBills_1.UserBills();
                    userBill.User = user;
                    return [4 /*yield*/, queryRunner.manager.save(userBill)];
                case 11:
                    newUserBill = _a.sent();
                    booking.UserBills = newUserBill;
                    return [4 /*yield*/, queryRunner.manager.save(booking)];
                case 12:
                    _a.sent();
                    table.state = Table_2.state.BOOKED;
                    return [4 /*yield*/, queryRunner.manager.save(table)];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, queryRunner.commitTransaction()];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, queryRunner.release()];
                case 15:
                    _a.sent();
                    res.status(201);
                    return [2 /*return*/, ({ message: "booking created" })];
                case 16: return [4 /*yield*/, queryRunner.manager
                        .createQueryBuilder()
                        .select("Booking")
                        .from(Booking_1.Booking, "Booking")
                        .where("Booking.Resttables= :ids and Booking.date>=:dates", {
                        ids: booking.Resttables,
                        dates: booking.date
                    })
                        .getMany()];
                case 17:
                    prevBooking = _a.sent();
                    if (!(prevBooking == null || prevBooking.length == 0)) return [3 /*break*/, 23];
                    id = res.locals.jwtPayload.userId;
                    userRole = void 0;
                    userRepository = typeorm_1.getRepository(User_1.User);
                    return [4 /*yield*/, userRepository.findOne(id)];
                case 18:
                    user = _a.sent();
                    userBill = new UserBills_1.UserBills();
                    userBill.User = user;
                    return [4 /*yield*/, queryRunner.manager.save(userBill)];
                case 19:
                    newUserBill = _a.sent();
                    booking.UserBills = newUserBill;
                    return [4 /*yield*/, queryRunner.manager.save(booking)];
                case 20:
                    _a.sent();
                    return [4 /*yield*/, queryRunner.commitTransaction()];
                case 21:
                    _a.sent();
                    return [4 /*yield*/, queryRunner.release()];
                case 22:
                    _a.sent();
                    res.status(201);
                    return [2 /*return*/, ({ message: "booking created" })];
                case 23:
                    _i = 0, prevBooking_1 = prevBooking;
                    _a.label = 24;
                case 24:
                    if (!(_i < prevBooking_1.length)) return [3 /*break*/, 28];
                    book = prevBooking_1[_i];
                    if (!(book.date == booking.date &&
                        (book.time <= booking.time + 1 || book.time <= booking.time + -1))) return [3 /*break*/, 27];
                    return [4 /*yield*/, queryRunner.rollbackTransaction()];
                case 25:
                    _a.sent();
                    return [4 /*yield*/, queryRunner.release()];
                case 26:
                    _a.sent();
                    //   await queryRunner.rollbackTransaction();
                    res
                        .status(409);
                    return [2 /*return*/, ({
                            message: "booking creation was unsuccessful, it is booked in this time"
                        })];
                case 27:
                    _i++;
                    return [3 /*break*/, 24];
                case 28: return [4 /*yield*/, queryRunner.release()];
                case 29:
                    _a.sent();
                    res.status(201);
                    return [2 /*return*/, ({ message: "booking created" })];
                case 30: return [3 /*break*/, 35];
                case 31:
                    errror_2 = _a.sent();
                    //   console.log(errror);
                    //   console.log("koko");
                    return [4 /*yield*/, queryRunner.rollbackTransaction()];
                case 32:
                    //   console.log(errror);
                    //   console.log("koko");
                    _a.sent();
                    return [4 /*yield*/, queryRunner.release()];
                case 33:
                    _a.sent();
                    res
                        .status(409)
                        .send({
                        message: "booking creation was unsuccessful, it already exists",
                        error: errror_2
                    });
                    return [2 /*return*/];
                case 34: return [7 /*endfinally*/];
                case 35: return [2 /*return*/];
            }
        });
    }); };
    BookingController.editBooking = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, connection, queryRunner, _a, name, time, date, table, booking, error_2, errors, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    id = req.params.id;
                    connection = typeorm_1.getConnection();
                    queryRunner = connection.createQueryRunner();
                    _a = req.body, name = _a.name, time = _a.time, date = _a.date, table = _a.table;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, queryRunner.manager
                            .createQueryBuilder()
                            .select("Booking")
                            .from(Booking_1.Booking, "Booking")
                            .where("Booking.id= :ids", { ids: id })
                            .getMany()];
                case 2:
                    booking = _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _b.sent();
                    //If not found, send a 404 response
                    res.status(404).send("booking not found");
                    return [2 /*return*/];
                case 4:
                    //Validate the new values on model
                    booking.name = name;
                    booking.time = time;
                    booking.date = date;
                    booking.table = table;
                    return [4 /*yield*/, class_validator_1.validate(booking)];
                case 5:
                    errors = _b.sent();
                    if (errors.length > 0) {
                        res.status(400).send(errors);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, queryRunner.connect()];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, queryRunner.startTransaction("SERIALIZABLE")];
                case 7:
                    _b.sent();
                    _b.label = 8;
                case 8:
                    _b.trys.push([8, 11, 13, 15]);
                    return [4 /*yield*/, queryRunner.manager.save(booking)];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, queryRunner.commitTransaction()];
                case 10:
                    _b.sent();
                    return [3 /*break*/, 15];
                case 11:
                    err_1 = _b.sent();
                    return [4 /*yield*/, queryRunner.rollbackTransaction()];
                case 12:
                    _b.sent();
                    res.status(409).send("booking edit was unsuccessful");
                    return [3 /*break*/, 15];
                case 13: return [4 /*yield*/, queryRunner.release()];
                case 14:
                    _b.sent();
                    res.status(201).send("booking created");
                    return [7 /*endfinally*/];
                case 15: return [2 /*return*/];
            }
        });
    }); };
    BookingController.deleteBooking = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, connection, queryRunner, booking, error_3, err_2;
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
                            .select("Booking")
                            .from(Booking_1.Booking, "Booking")
                            .where("Booking.id= :ids", { ids: id })
                            .getMany()];
                case 2:
                    booking = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    res.status(404).send("booking not found");
                    return [2 /*return*/];
                case 4: return [4 /*yield*/, queryRunner.connect()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, queryRunner.startTransaction("SERIALIZABLE")];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7:
                    _a.trys.push([7, 10, 12, 14]);
                    return [4 /*yield*/, queryRunner.manager.remove(booking)];
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
                    res.status(409).send("booking deletion was unsuccessful");
                    return [3 /*break*/, 14];
                case 12: return [4 /*yield*/, queryRunner.release()];
                case 13:
                    _a.sent();
                    res.status(201).send("booking deleted");
                    return [7 /*endfinally*/];
                case 14: return [2 /*return*/];
            }
        });
    }); };
    return BookingController;
}());
exports["default"] = BookingController;
