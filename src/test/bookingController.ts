import  BookingController  from "../controllers/BookingController";
import { expect } from 'chai';
const sinon = require('sinon');
import { response } from "express";
import {createConnection,getConnection} from "typeorm";

describe('booking  Controller', function() {
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

  it('should add a new booking ', function(done) {
    const req = {
      body: {
        "tableId":1,
        "name":"koko",
        "date":"2021-08-25",
        "time":"7:30"
      },
     
    };
   

    BookingController.newBooking(req, response).then(savedOffer => {

      expect(savedOffer).to.have.property('message');
      expect(response.statusCode).to.be.equal(201);


      done();
    });
  });
  it('should not add a new booking at the same time ', function(done) {
    const req = {
      body: {
        "tableId":1,
        "name":"koko",
        "date":"2021-08-25",
        "time":"7:30"
      },
     
    };
   

    BookingController.newBooking(req, response).then(savedOffer => {

      expect(savedOffer).to.have.property('message');
      expect(response.statusCode).to.be.equal(409);


      done();
    });
  });
  it('should give an error MISSING FIELD', function(done) {
    const req = {
      body: {
        "name":"koko",
        "date":"2021-08-22",
        "time":"7:30"
},
     
    };
   

    BookingController.newBooking(req, response).then(savedMeal => {

      expect(savedMeal).to.have.property("error");
      expect(response.statusCode).to.be.equal(409);

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

  after(function(done) {
     getConnection().close()
    .then(() => {
      done();
    });

    
     
  });
});
