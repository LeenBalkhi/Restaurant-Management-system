"use strict";
exports.__esModule = true;
var BookingController_1 = require("../controllers/BookingController");
var chai_1 = require("chai");
var sinon = require('sinon');
var express_1 = require("express");
var typeorm_1 = require("typeorm");
describe('booking  Controller', function () {
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
    it('should add a new booking ', function (done) {
        var req = {
            body: {
                "tableId": 1,
                "name": "koko",
                "date": "2021-08-25",
                "time": "7:30"
            }
        };
        BookingController_1["default"].newBooking(req, express_1.response).then(function (savedOffer) {
            chai_1.expect(savedOffer).to.have.property('message');
            chai_1.expect(express_1.response.statusCode).to.be.equal(201);
            done();
        });
    });
    it('should not add a new booking at the same time ', function (done) {
        var req = {
            body: {
                "tableId": 1,
                "name": "koko",
                "date": "2021-08-25",
                "time": "7:30"
            }
        };
        BookingController_1["default"].newBooking(req, express_1.response).then(function (savedOffer) {
            chai_1.expect(savedOffer).to.have.property('message');
            chai_1.expect(express_1.response.statusCode).to.be.equal(409);
            done();
        });
    });
    it('should give an error MISSING FIELD', function (done) {
        var req = {
            body: {
                "name": "koko",
                "date": "2021-08-22",
                "time": "7:30"
            }
        };
        BookingController_1["default"].newBooking(req, express_1.response).then(function (savedMeal) {
            chai_1.expect(savedMeal).to.have.property("error");
            chai_1.expect(express_1.response.statusCode).to.be.equal(409);
            done();
        });
    });
    /*it('should give an error  meal id not valid', function(done) {
      const req = {
          body: {
            "name":"Spicy seasoned seafood noodles",
            "expirationDate":"2022-4-5",
            "price":25000,
            "mealOffers":[
                {
                    "quantity":4,
                    "mealId":0
                },{
        
                    "quantity":5,
                    "mealId":2
                }
            ]
    },
         
        };
      
  
        OffersController.newOffers(req, response).then(savedMeal => {
        // console.log(response)
         // console.log(savedMeal);
        expect(savedMeal).to.have.property("error");
        expect(response.statusCode).to.be.equal(404);
  
        done();
      });
    });*/
    after(function (done) {
        typeorm_1.getConnection().close()
            .then(function () {
            done();
        });
    });
});
