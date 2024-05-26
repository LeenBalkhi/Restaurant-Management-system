"use strict";
exports.__esModule = true;
var chai_1 = require("chai");
var sinon = require('sinon');
var express_1 = require("express");
var typeorm_1 = require("typeorm");
var StockIngredientController_1 = require("../controllers/StockIngredientController");
describe('StockIngredient Controller', function () {
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
    it('should add a created stock ingredient in to the stock ingredient', function (done) {
        var req = {
            body: {
                "quantity": 4,
                "expirationDate": "2022-4-5",
                "ingredientId": 1,
                "stockId": 1
            }
        };
        StockIngredientController_1["default"].newStockIngredient(req, express_1.response).then(function (savedStockIng) {
            chai_1.expect(savedStockIng).to.have.property('message');
            chai_1.expect(savedStockIng).to.have.property('StockIngredient');
            chai_1.expect(express_1.response.statusCode).to.be.equal(201);
            done();
        });
    });
    it('should give an error MISSING FIELD', function (done) {
        var req = {
            body: {
                "quantity": 4,
                "expirationDate": "2022-4-5",
                "ingredientId": 1
            }
        };
        var res = {
            status: function () {
                return this;
            },
            json: function () { }
        };
        StockIngredientController_1["default"].newStockIngredient(req, express_1.response).then(function (savedMeal) {
            chai_1.expect(savedMeal).to.have.property("error");
            chai_1.expect(express_1.response.statusCode).to.be.equal(409);
            done();
        });
    });
    it('should give an error  ingredientId not valid', function (done) {
        var req = {
            body: {
                "quantity": 4,
                "expirationDate": "2022-4-5",
                "ingredientId": 0,
                "stockId": 1
            }
        };
        // expect(StockIngredientController.newStockIngredient.bind(this, req, {})).to.throw();
        StockIngredientController_1["default"].newStockIngredient(req, express_1.response).then(function (savedMeal) {
            //   console.log(response)
            //     console.log(savedMeal);
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
