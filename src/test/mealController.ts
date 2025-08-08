import  MealController  from "../controllers/MealController";
import { expect } from 'chai';
import * as jwt from "jsonwebtoken";
//import * as sinon from "ts-sinon";
const sinon = require('sinon');
import { Request, response, Response } from "express";
import {createConnection,getConnection} from "typeorm";
import { Staff } from "../entity/Staff";
import { User } from "../entity/User";
import { Meals } from "../entity/Meal";

describe('Meal Controller', function() {
  before(function(done) {

    createConnection()
      .then(result => {
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
      .then(() => {
        done();
      });
  });

  beforeEach(function() {});

  afterEach(function() {});

  it('should add a created meal to the meal of the creator', function(done) {
    const req = {
      body: {
        "name":"Spicy seasoned seafood noodles",
        "description":"showrma", 
        
        "price":2300,
        "available":true,
        "mealIngredients":[
            {
                "quantity":4,
                "ingredientId":2
            },{
    
                "quantity":5,
                "ingredientId":5
            }
        ]
      },
     
    };
    const res = {
      status: function() {
        return this;
      },
      json: function() {}
    };

    MealController.newMeal(req, response).then(savedMeal => {
   //   console.log(savedMeal)
      expect(savedMeal).to.have.property('id');
      done();
    });
  });
  it('should give an error', function(done) {
    const req = {
      body: {
        "description":"showrma", 
        
        "price":2300,
        "available":true,
        "mealIngredients":[
            {
                "quantity":4,
                "ingredientId":2
            },{
    
                "quantity":5,
                "ingredientId":5
            }
        ]
      },
     
    };
    const res = {
      status: function() {
        return this;
      },
      json: function() {}
    };

    MealController.newMeal(req, response).then(savedMeal => {
      expect(savedMeal).to.have.property("error");
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
