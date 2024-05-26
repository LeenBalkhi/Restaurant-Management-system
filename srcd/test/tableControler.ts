import  TablesController  from "../controllers/TablesController";
import { expect } from 'chai';
const sinon = require('sinon');
import { response } from "express";
import {createConnection,getConnection} from "typeorm";

describe('table Controller', function() {
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

  it('should add a new table ', function(done) {
    const req = {
      body: {
        "tableNumber":4,
        "seatsNumber":2},
     
    };
   

    TablesController.newtable(req, response).then(savedOffer => {
      expect(savedOffer).to.have.property('message');
      expect(response.statusCode).to.be.equal(201);


      done();
    });
  });
  it('should give an error MISSING FIELD', function(done) {
    const req = {
      body: { "tableNumber":4,
      },
     
    };
   
    TablesController.newtable(req, response).then(savedMeal => {
      expect(savedMeal).to.have.property("error");
      expect(response.statusCode).to.be.equal(409);

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
