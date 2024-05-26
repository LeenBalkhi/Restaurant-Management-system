"use strict";
exports.__esModule = true;
var OffersController_1 = require("../controllers/OffersController");
var chai_1 = require("chai");
var sinon = require('sinon');
var express_1 = require("express");
var typeorm_1 = require("typeorm");
describe('offer Controller', function () {
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
    it('should add a new offer ', function (done) {
        var req = {
            body: {
                "name": "Spicy seasoned seafood noodles",
                "expirationDate": "2022-4-5",
                "price": 25000,
                "mealOffers": [
                    {
                        "quantity": 4,
                        "mealId": 3
                    }, {
                        "quantity": 5,
                        "mealId": 2
                    }
                ]
            }
        };
        OffersController_1["default"].newOffers(req, express_1.response).then(function (savedOffer) {
            chai_1.expect(savedOffer).to.have.property('message');
            chai_1.expect(savedOffer).to.have.property('offer');
            chai_1.expect(express_1.response.statusCode).to.be.equal(201);
            done();
        });
    });
    it('should give an error MISSING FIELD', function (done) {
        var req = {
            body: {
                "name": "Spicy seasoned seafood noodles",
                "expirationDate": "2022-4-5",
                "mealOffers": [
                    {
                        "quantity": 4,
                        "mealId": 3
                    }, {
                        "quantity": 5,
                        "mealId": 2
                    }
                ]
            }
        };
        OffersController_1["default"].newOffers(req, express_1.response).then(function (savedMeal) {
            chai_1.expect(savedMeal).to.have.property("error");
            chai_1.expect(express_1.response.statusCode).to.be.equal(409);
            done();
        });
    });
    it('should give an error  meal id not valid', function (done) {
        var req = {
            body: {
                "name": "Spicy seasoned seafood noodles",
                "expirationDate": "2022-4-5",
                "price": 25000,
                "mealOffers": [
                    {
                        "quantity": 4,
                        "mealId": 0
                    }, {
                        "quantity": 5,
                        "mealId": 2
                    }
                ]
            }
        };
        OffersController_1["default"].newOffers(req, express_1.response).then(function (savedMeal) {
            // console.log(response)
            // console.log(savedMeal);
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
