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
var jwt = require("jsonwebtoken");
var typeorm_1 = require("typeorm");
var class_validator_1 = require("class-validator");
var config_1 = require("../config/config");
var Staff_1 = require("../entity/Staff");
var User_1 = require("../entity/User");
var Customer_1 = require("../entity/Customer");
var AuthController = /** @class */ (function () {
    function AuthController() {
    }
    AuthController.login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var userreq, username, password, userRepository, user, connection, queryRunner, error_1, role, customer, staff, token, jwtPayload;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userreq = req.body;
                    username = userreq.username, password = userreq.password;
                    if (!(username && password)) {
                        res.status(400).send();
                    }
                    userRepository = typeorm_1.getRepository(User_1.User);
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
                    _a.trys.push([3, 5, , 8]);
                    return [4 /*yield*/, queryRunner.manager
                            .createQueryBuilder()
                            .select("User")
                            .from(User_1.User, "User")
                            .where("User.username= :names", { names: username })
                            .getOneOrFail()];
                case 4:
                    //  user = await userRepository.findOneOrFail({ where: { username } });
                    user = _a.sent();
                    return [3 /*break*/, 8];
                case 5:
                    error_1 = _a.sent();
                    return [4 /*yield*/, queryRunner.commitTransaction()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, queryRunner.release()];
                case 7:
                    _a.sent();
                    res.status(401).send(error_1);
                    return [2 /*return*/];
                case 8:
                    if (!!user.checkIfUnencryptedPasswordIsValid(password)) return [3 /*break*/, 11];
                    return [4 /*yield*/, queryRunner.commitTransaction()];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, queryRunner.release()];
                case 10:
                    _a.sent();
                    res.status(401).send({ message: "password not valid" });
                    return [2 /*return*/];
                case 11: return [4 /*yield*/, queryRunner.manager
                        .createQueryBuilder()
                        .select("Customer")
                        .from(Customer_1.Customer, "Customer")
                        .where("Customer.id= :ids", { ids: user.id })
                        .getOne()];
                case 12:
                    customer = _a.sent();
                    if (!(customer == null)) return [3 /*break*/, 14];
                    return [4 /*yield*/, queryRunner.manager
                            .createQueryBuilder()
                            .select("Staff")
                            .from(Staff_1.Staff, "Staff")
                            .where("Staff.id= :ids", { ids: user.id })
                            .getOne()];
                case 13:
                    staff = _a.sent();
                    role = staff.role;
                    return [3 /*break*/, 15];
                case 14:
                    role = "customer";
                    _a.label = 15;
                case 15:
                    token = jwt.sign({ userId: user.id, username: user.username, role: role }, config_1["default"].jwtSecret, { expiresIn: "7d" });
                    jwtPayload = jwt.verify(token, config_1["default"].jwtSecret);
                    console.log("10000koko");
                    console.log(jwtPayload);
                    return [4 /*yield*/, queryRunner.commitTransaction()];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, queryRunner.release()];
                case 17:
                    _a.sent();
                    //Send the jwt in the response
                    res.status(200).send({
                        userId: user.id,
                        username: user.username,
                        token: token,
                        role: role
                    });
                    return [2 /*return*/];
            }
        });
    }); };
    AuthController.changePassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var id, _a, oldPassword, newPassword, userRepository, user, id_1, errors;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    id = res.locals.jwtPayload.userId;
                    _a = req.body, oldPassword = _a.oldPassword, newPassword = _a.newPassword;
                    if (!(oldPassword && newPassword)) {
                        res.status(400).send();
                    }
                    userRepository = typeorm_1.getRepository(User_1.User);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, userRepository.findOneOrFail(id)];
                case 2:
                    user = _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    id_1 = _b.sent();
                    res.status(401).send();
                    return [3 /*break*/, 4];
                case 4:
                    //Check if old password matchs
                    if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
                        res.status(401).send();
                        return [2 /*return*/];
                    }
                    //Validate de model (password lenght)
                    user.password = newPassword;
                    return [4 /*yield*/, class_validator_1.validate(user)];
                case 5:
                    errors = _b.sent();
                    if (errors.length > 0) {
                        res.status(400).send(errors);
                        return [2 /*return*/];
                    }
                    //Hash the new password and save
                    user.hashPassword();
                    userRepository.save(user);
                    res.status(204).send();
                    return [2 /*return*/];
            }
        });
    }); };
    return AuthController;
}());
exports["default"] = AuthController;
