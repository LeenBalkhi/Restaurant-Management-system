"use strict";
exports.__esModule = true;
var TablesController_1 = require("../controllers/TablesController");
var chai_1 = require("chai");
var sinon = require('sinon');
var express_1 = require("express");
var typeorm_1 = require("typeorm");
describe('table Controller', function () {
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
    it('should add a new table ', function (done) {
        var req = {
            body: {
                "tableNumber": 4,
                "seatsNumber": 2
            }
        };
        TablesController_1["default"].newtable(req, express_1.response).then(function (savedOffer) {
            chai_1.expect(savedOffer).to.have.property('message');
            chai_1.expect(express_1.response.statusCode).to.be.equal(201);
            done();
        });
    });
    it('should give an error MISSING FIELD', function (done) {
        var req = {
            body: { "tableNumber": 4
            }
        };
        TablesController_1["default"].newtable(req, express_1.response).then(function (savedMeal) {
            chai_1.expect(savedMeal).to.have.property("error");
            chai_1.expect(express_1.response.statusCode).to.be.equal(409);
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
