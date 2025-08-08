"use strict";
exports.__esModule = true;
var MealController_1 = require("../controllers/MealController");
var chai_1 = require("chai");
//import * as sinon from "ts-sinon";
var sinon = require('sinon');
var express_1 = require("express");
var typeorm_1 = require("typeorm");
describe('Meal Controller', function () {
    before(function (done) {
        typeorm_1.createConnection()
            .then(function (result) {
            //  console.log("connected");
            /*  const user = new User();
              user.username="test";
              user.password="test";
              user.hashPassword();
              const connection = getConnection();
          const queryRunner = connection.createQueryRunner();
           queryRunner.connect().then(()=>{
              return queryRunner.manager.save(user);
      
           });*/
            //   done();
        })
            .then(function () {
            done();
        });
    });
    beforeEach(function () { });
    afterEach(function () { });
    it('should add a created meal to the meal of the creator', function (done) {
        var req = {
            body: {
                "name": "Spicy seasoned seafood noodles",
                "description": "showrma",
                "price": 2300,
                "available": true,
                "mealIngredients": [
                    {
                        "quantity": 4,
                        "ingredientId": 2
                    }, {
                        "quantity": 5,
                        "ingredientId": 5
                    }
                ]
            }
        };
        var res = {
            status: function () {
                return this;
            },
            json: function () { }
        };
        MealController_1["default"].newMeal(req, express_1.response).then(function (savedMeal) {
            //   console.log(savedMeal)
            chai_1.expect(savedMeal).to.have.property('id');
            done();
        });
    });
    it('should give an error', function (done) {
        var req = {
            body: {
                "description": "showrma",
                "price": 2300,
                "available": true,
                "mealIngredients": [
                    {
                        "quantity": 4,
                        "ingredientId": 2
                    }, {
                        "quantity": 5,
                        "ingredientId": 5
                    }
                ]
            }
        };
        var res = {
            status: function () {
                return this;
            },
            json: function () { }
        };
        MealController_1["default"].newMeal(req, express_1.response).then(function (savedMeal) {
            chai_1.expect(savedMeal).to.have.property("error");
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
