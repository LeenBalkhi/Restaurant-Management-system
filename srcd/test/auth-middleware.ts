import { checkJwt } from "../middlewares/checkJwt";
import { expect } from 'chai';
import * as jwt from "jsonwebtoken";
//import * as sinon from "ts-sinon";
const sinon = require('sinon');
import { Request, response, Response } from "express";
import { OutgoingMessage } from "http";




describe('Auth middleware', () => {
    it('should throw an error if no authorization header is present', function() {
        const req = {
          get: function(headerName) {
            return null;
          }
        };
        expect(checkJwt.bind(this, req, {}, () => {})).to.throw();
      });

      it('should throw an error if the authorization header is only one string', function() {
        const req = {
          get: function(headerName) {
            return 'xyz';
          }
        };
        expect(checkJwt.bind(this, req, {}, () => {})).to.throw();
      });
          
       let headers=[];
       headers["Authorization"]='Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2Mjk2NDk0NDEsImV4cCI6MTYzMDI1NDI0MX0.KFdsyPdOl7TzhQJCs3mxSvkhKBdXAnrjOYwcpq08lzg';

      it('should yield a userId after decoding the token', function() {
        const req = {
            headers:headers,
         get: function(headerName) {
            return 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2Mjk2NDk0NDEsImV4cCI6MTYzMDI1NDI0MX0.KFdsyPdOl7TzhQJCs3mxSvkhKBdXAnrjOYwcpq08lzg';
          },
          
        };
       // console.log("koko",req.headers["Authorization"]);

        sinon.stub(jwt, 'verify');
        jwt.verify.returns({ userId: 1 });
      //  checkJwt(req, {}, () => {});
        checkJwt(req, response, () => {});

       expect(response.locals.jwtPayload).to.have.property('userId');
        expect(response.locals.jwtPayload).to.have.property('userId', );
        expect(jwt.verify.called).to.be.true;
        jwt.verify.restore();
      });
    
      it('should throw an error if the token cannot be verified', function() {
        const req = {
          get: function(headerName) {
            return 'Bearer xyz';
          }
        };
        expect(checkJwt.bind(this, req, {}, () => {})).to.throw();
      });
      
  });