import  OrdersController  from "../controllers/OrdersController";
import { expect } from 'chai';
import { response } from "express";
import {createConnection,getConnection} from "typeorm";

describe('order Controller', function() {
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

  it('should add a new order ', function(done) {
    const req = {
      body:{
    
        "meals":[
            {
                "quantity":4,
                "mealId":3
            },{
    
                "quantity":5,
                "mealId":4
            }
        ],
         "offers":[
            {
                "quantity":4,
                "offerId":2
            }
        ]
    }
     
    };
   


    OrdersController.newOrders(req, response).then(savedorder => {

       // console.log(savedorder);
      expect(savedorder).to.have.property('message');
      expect(savedorder).to.have.property('order');
      expect(response.statusCode).to.be.equal(201);


      done();
    });
  });
  
  it('should give an error offer and meal are empty', function(done) {
    const req = {
        body:{
       }
       
      };
   

      OrdersController.newOrders(req, response).then(savedMeal => {

      expect(savedMeal).to.have.property("error");
      expect(response.statusCode).to.be.equal(409);

      done();
    });
  });
  it('should give an error  meal id not valid', function(done) {
    const req = {
        body:{
      
          "meals":[
              {
                  "quantity":4,
                  "mealId":0
              },{
      
                  "quantity":5,
                  "mealId":4
              }
          ],
           "offers":[
              {
                  "quantity":4,
                  "offerId":2
              }
          ]
      }
       
      };
    

      OrdersController.newOrders(req, response).then(savedMeal => {
      // console.log(response)
      //  console.log(savedMeal);
      expect(savedMeal).to.have.property("error");
      expect(response.statusCode).to.be.equal(404);

      done();
    });
  });
  it('should give an error  offer id not valid', function(done) {
    const req = {
        body:{
      
          "meals":[
              {
                  "quantity":4,
                  "mealId":3
              },{
      
                  "quantity":5,
                  "mealId":4
              }
          ],
           "offers":[
              {
                  "quantity":4,
                  "offerId":0
              }
          ]
      }
       
      };
    

      OrdersController.newOrders(req, response).then(savedMeal => {
      // console.log(response)
     //   console.log(savedMeal);
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
