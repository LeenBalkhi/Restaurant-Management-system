"use strict";
exports.__esModule = true;
var OrdersController_1 = require("../controllers/OrdersController");
var chai_1 = require("chai");
var express_1 = require("express");
var typeorm_1 = require("typeorm");
describe('order Controller', function () {
    before(function (done) {
        typeorm_1.createConnection()
            .then(function (result) {
        })
            .then(function () {
            done();
        });
    });
    beforeEach(function () { });
    afterEach(function () { });
    it('should add a new order ', function (done) {
        var req = {
            body: {
                "meals": [
                    {
                        "quantity": 4,
                        "mealId": 3
                    }, {
                        "quantity": 5,
                        "mealId": 4
                    }
                ],
                "offers": [
                    {
                        "quantity": 4,
                        "offerId": 2
                    }
                ]
            }
        };
        OrdersController_1["default"].newOrders(req, express_1.response).then(function (savedorder) {
            // console.log(savedorder);
            chai_1.expect(savedorder).to.have.property('message');
            chai_1.expect(savedorder).to.have.property('order');
            chai_1.expect(express_1.response.statusCode).to.be.equal(201);
            done();
        });
    });
    it('should give an error offer and meal are empty', function (done) {
        var req = {
            body: {}
        };
        OrdersController_1["default"].newOrders(req, express_1.response).then(function (savedMeal) {
            chai_1.expect(savedMeal).to.have.property("error");
            chai_1.expect(express_1.response.statusCode).to.be.equal(409);
            done();
        });
    });
    it('should give an error  meal id not valid', function (done) {
        var req = {
            body: {
                "meals": [
                    {
                        "quantity": 4,
                        "mealId": 0
                    }, {
                        "quantity": 5,
                        "mealId": 4
                    }
                ],
                "offers": [
                    {
                        "quantity": 4,
                        "offerId": 2
                    }
                ]
            }
        };
        OrdersController_1["default"].newOrders(req, express_1.response).then(function (savedMeal) {
            // console.log(response)
            //  console.log(savedMeal);
            chai_1.expect(savedMeal).to.have.property("error");
            chai_1.expect(express_1.response.statusCode).to.be.equal(404);
            done();
        });
    });
    it('should give an error  offer id not valid', function (done) {
        var req = {
            body: {
                "meals": [
                    {
                        "quantity": 4,
                        "mealId": 3
                    }, {
                        "quantity": 5,
                        "mealId": 4
                    }
                ],
                "offers": [
                    {
                        "quantity": 4,
                        "offerId": 0
                    }
                ]
            }
        };
        OrdersController_1["default"].newOrders(req, express_1.response).then(function (savedMeal) {
            // console.log(response)
            //   console.log(savedMeal);
            chai_1.expect(savedMeal).to.have.property("error");
            chai_1.expect(express_1.response.statusCode).to.be.equal(404);
            done();
        });
    });
    after(function (done) {
        typeorm_1.getConnection().close()
            .then(function () {
            done();
        });
    });
});
