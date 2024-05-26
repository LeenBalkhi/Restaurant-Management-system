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
var Table_1 = require("../entity/Table");
var Table_2 = require("../entity/Table");
var tableController = /** @class */ (function () {
    function tableController() {
    }
    tableController.listAll = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var connection, queryRunner, table;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    connection = typeorm_1.getConnection();
                    queryRunner = connection.createQueryRunner();
                    return [4 /*yield*/, queryRunner.manager
                            .createQueryBuilder()
                            .select("Resttables")
                            .from(Table_1.Resttables, "Resttables")
                            .getMany()];
                case 1:
                    table = _a.sent();
                    res.send(table);
                    return [2 /*return*/];
            }
        });
    }); };
    tableController.getOneById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, connection, queryRunner, table, error_1;
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
                            .select("Resttables")
                            .from(Table_1.Resttables, "Resttables")
                            .where("Resttables.id= :ids", { ids: id })
                            .getMany()];
                case 2:
                    table = _a.sent();
                    res.send(table);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    res.status(404).send("table not found");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    tableController.newtable = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var tableReq, table, errors, connection, queryRunner, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tableReq = req.body;
                    table = new Table_1.Resttables();
                    table.tableNumber = tableReq.tableNumber;
                    table.seatsNumber = tableReq.seatsNumber;
                    table.state = Table_2.state.AVAILABLE;
                    if (table.tableNumber == null || table.seatsNumber == null) {
                        res.status(409); //.send({ error: err });
                        return [2 /*return*/, { error: "all fields are requierd" }];
                    }
                    return [4 /*yield*/, class_validator_1.validate(table)];
                case 1:
                    errors = _a.sent();
                    if (errors.length > 0) {
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
                    _a.trys.push([4, 7, 9, 11]);
                    return [4 /*yield*/, queryRunner.manager.save(table)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, queryRunner.commitTransaction()];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 11];
                case 7:
                    err_1 = _a.sent();
                    return [4 /*yield*/, queryRunner.rollbackTransaction()];
                case 8:
                    _a.sent();
                    res
                        .status(409)
                        .send({ message: "table creation was unsuccessful, it already exists", error: err_1 });
                    return [3 /*break*/, 11];
                case 9: return [4 /*yield*/, queryRunner.release()];
                case 10:
                    _a.sent();
                    res.status(201);
                    return [2 /*return*/, ({ message: "table created" })];
                case 11: return [2 /*return*/];
            }
        });
    }); };
    tableController.edittable = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, _a, TableNumber, state, booking, table, connection, queryRunner, Meal, error_2, errors, err_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    id = req.params.id;
                    _a = req.body, TableNumber = _a.TableNumber, state = _a.state, booking = _a.booking;
                    connection = typeorm_1.getConnection();
                    queryRunner = connection.createQueryRunner();
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, queryRunner.manager
                            .createQueryBuilder()
                            .select("meals")
                            .from(Table_1.Resttables, "meals")
                            .where("meals.id= :ids", { ids: id })
                            .getMany()];
                case 2:
                    Meal = _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _b.sent();
                    res.status(404).send("meal not found");
                    return [3 /*break*/, 4];
                case 4:
                    table.TableNumber = TableNumber;
                    table.state = state;
                    table.booking = booking;
                    return [4 /*yield*/, class_validator_1.validate(table)];
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
                    return [4 /*yield*/, queryRunner.manager.save(table)];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, queryRunner.commitTransaction()];
                case 10:
                    _b.sent();
                    return [3 /*break*/, 15];
                case 11:
                    err_2 = _b.sent();
                    return [4 /*yield*/, queryRunner.rollbackTransaction()];
                case 12:
                    _b.sent();
                    res.status(409).send("table edit was unsuccessful");
                    return [3 /*break*/, 15];
                case 13: return [4 /*yield*/, queryRunner.release()];
                case 14:
                    _b.sent();
                    res.status(201).send("table created");
                    return [7 /*endfinally*/];
                case 15: return [2 /*return*/];
            }
        });
    }); };
    tableController.deletetable = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, table, connection, queryRunner, error_3, err_3;
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
                            .select("Resttables")
                            .from(Table_1.Resttables, "Resttables")
                            .where("Resttables.id= :ids", { ids: id })
                            .getMany()];
                case 2:
                    table = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    res.status(404).send("table not found");
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
                    return [4 /*yield*/, queryRunner.manager.remove(table)];
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
                    res.status(409).send("table deletion was unsuccessful");
                    return [3 /*break*/, 14];
                case 12: return [4 /*yield*/, queryRunner.release()];
                case 13:
                    _a.sent();
                    res.status(201).send("table deleted");
                    return [7 /*endfinally*/];
                case 14: return [2 /*return*/];
            }
        });
    }); };
    return tableController;
}());
exports["default"] = tableController;
