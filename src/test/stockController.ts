import { expect } from 'chai';
const sinon = require('sinon');
import { response } from "express";
import {createConnection,getConnection} from "typeorm";
import StockIngredientController from "../controllers/StockIngredientController";

describe('StockIngredient Controller', function() {
  before(function(done) {

    createConnection()
      .then(result => {
      })
      .then(() => {
        done();
      });
  });

  beforeEach(function() {});

  afterEach(function() {});

  it('should add a created stock ingredient in to the stock ingredient', function(done) {
    const req = {
      body: {
        "quantity":4,
    "expirationDate":"2022-4-5",
    "ingredientId":1,
    "stockId":1
},
     
    };
   

    StockIngredientController.newStockIngredient(req, response).then(savedStockIng => {
      expect(savedStockIng).to.have.property('message');
      expect(savedStockIng).to.have.property('StockIngredient');
      expect(response.statusCode).to.be.equal(201);


      done();
    });
  });
  it('should give an error MISSING FIELD', function(done) {
    const req = {
        body: {
            "quantity":4,
        "expirationDate":"2022-4-5",
        "ingredientId":1,
          }
     
    };
    const res = {
      status: function() {
        return this;
      },
      json: function() {}
    };

    StockIngredientController.newStockIngredient(req, response).then(savedMeal => {

      expect(savedMeal).to.have.property("error");
      expect(response.statusCode).to.be.equal(409);

      done();
    });
  });
  it('should give an error  ingredientId not valid', function(done) {
    const req = {
        body: {
            "quantity":4,
        "expirationDate":"2022-4-5",
        "ingredientId":0,
        "stockId":1

          }
     
    };
    
   // expect(StockIngredientController.newStockIngredient.bind(this, req, {})).to.throw();

    StockIngredientController.newStockIngredient(req, response).then(savedMeal => {
     //   console.log(response)
   //     console.log(savedMeal);
      expect(savedMeal).to.have.property("error");
      expect(response.statusCode).to.be.equal(404);

      done();
    });
  });

  after(function(done) {
     getConnection().close()
    .then(() => {
      done();
    });

    
     
  });
});
