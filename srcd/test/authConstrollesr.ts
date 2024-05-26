import  AuthController  from "../controllers/AuthController";
import { expect } from 'chai';
import * as jwt from "jsonwebtoken";
//import * as sinon from "ts-sinon";
const sinon = require('sinon');
import { Request, response, Response } from "express";
import {createConnection,getConnection} from "typeorm";
import { Staff } from "../entity/Staff";
import { User } from "../entity/User";
import { Customer } from "../entity/Customer";
/*
describe('Auth Controller', function() {
    before(function(done) {
        createConnection()
          .then(result => {
            const user = new User();
            user.username="test";
            user.password="test";
            user.hashPassword();
            const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
         queryRunner.connect().then(()=>{
            return queryRunner.manager.save(user);
    
         });
    
          })
          .then(() => {
            done();
          });
      });

  beforeEach(function() {});

  afterEach(function() {});
/*
  it('should throw an error with code 500 if accessing the database fails', function(done) {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    sinon.stub(User, 'findOne');
    User.findOne.throws();

    const req = {
      body: {
        email: 'test@test.com',
        password: 'tester'
      }
    };

    AuthController.login(req, {}).then(result => {
      expect(result).to.be.an('error');
      expect(result).to.have.property('statusCode', 500);
      done();
    });

    User.findOne.restore();
  });

  it('should send a response with a valid user status for an existing user', function(done) {
    const req = { userId: '5c0f66b979af55031b34728a' };
    const res = {
      statusCode: 500,
      userStatus: null,
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        this.userStatus = data.status;
      }
    };
    AuthController.getUserStatus(req, res, () => {}).then(() => {
      expect(res.statusCode).to.be.equal(200);
      expect(res.userStatus).to.be.equal('I am new!');
      done();
    });
  });

  after(function(done) {
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });
});*/
